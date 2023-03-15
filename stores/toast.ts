export const useToastStore = defineStore('toast', () => {
    let idCounter = 0;

    type Toast = {
        id: number
        type: "info" | "warning" | "error" | "success"
        content: string
    }

    const toasts = ref<Toast[]>([])

    function add(toast: Omit<Toast, "id">) {
        toasts.value.push({id:idCounter++, ...toast})
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
