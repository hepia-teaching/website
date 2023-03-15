<script setup lang="ts">
const toastStore = useToastStore()
</script>

<template>
    <div class="max-w-2xl mx-auto flex flex-col gap-3 my-3 empty:hidden">
        <div class="alert relative shadow-lg justify-center" v-for:="toast in toastStore.toasts" :class="{
            'alert-success': (toast.type === 'success'),
            'alert-info': (toast.type === 'info'),
            'alert-warning': (toast.type === 'warning'),
            'alert-error': (toast.type === 'error')
        }">
            <p class="text-slate-100 font-bold drop-shadow-lg">{{ toast.content }}</p>
            <button class="right-5 absolute" @click="toastStore.removeById(toast.id)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white"
                    class="w-6 h-6 scale-100 transition-all hover:scale-150">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>
    </div>
</template>