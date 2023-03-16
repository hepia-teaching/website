import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

export const useToastStore = defineStore('toast', () => {
    let idCounter = 0;

    type Toast = {
        id: number
        type: "info" | "warning" | "error" | "success"
        content: string
    }

    const toasts = ref<Toast[]>([])

    function add(toast: Omit<Toast, "id">) {
        toasts.value.push({ id: idCounter++, ...toast })
    }

    function info(message: string) {
        add({ content: message, type: "info" })
    }

    function success(message: string) {
        add({ content: message, type: "success" })
    }

    function warning(message: string) {
        add({ content: message, type: "warning" })
    }

    function error(e: unknown) {
        console.log({ e });

        if (e instanceof TRPCClientError) {
            add({
                content: `[${e.name}] : ${e.message}`,
                type: 'error'
            })
        }
        else {
            add({
                content: "Something unexpected happened",
                type: "error"
            })
        }
    }

    function removeById(id: number) {
        toasts.value = toasts.value.filter(toast => toast.id != id);
    }

    function removeAll() {
        toasts.value = []
    }

    return {
        toasts: toasts,
        info,
        success,
        warning,
        error,
        removeById,
        removeAll,
    }
})
