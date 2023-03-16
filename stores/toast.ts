import { TRPCError } from "@trpc/server";

export const useToastStore = defineStore('toast', () => {
    let idCounter = 0;

    type Toast = {
        id: number
        type: "info" | "warning" | "error" | "success"
        content: string
    }

    const toasts = ref<Toast[]>([])

    function add(toast: Omit<Toast, "id"> | TRPCError) {
        if (toast instanceof TRPCError) {
            toasts.value.push({
                id: idCounter++,
                content: toast.message,
                type: 'error'
            })
        }
        else {
            toasts.value.push({ id: idCounter++, ...toast })
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
        add,
        removeById,
        removeAll,
    }
})
