<script setup lang="ts">
import toast from '~~/plugins/toast'

const toastStore = useToastStore()
</script>

<template>
	<div class="mx-auto my-3 flex max-w-2xl flex-col gap-3 empty:hidden">
		<div
			class="alert relative justify-center shadow-lg"
			v-for:="toast in toastStore.toasts"
			:class="{
				'alert-success': toast.type === 'success',
				'alert-info': toast.type === 'info',
				'alert-warning': toast.type === 'warning',
				'alert-error': toast.type === 'error',
			}"
		>
			<div class="icon-container">
				<!-- Error icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="white"
					class="h-6 w-6"
					v-if="toast.type === 'error'"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
					/>
				</svg>

				<!-- Warning icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="white"
					class="h-6 w-6"
					v-if="toast.type === 'warning'"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
					/>
				</svg>

				<!-- Success icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="white"
					class="h-6 w-6"
					v-if="toast.type === 'success'"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4.5 12.75l6 6 9-13.5"
					/>
				</svg>

				<!-- Info icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="white"
					class="h-6 w-6"
					v-if="toast.type === 'info'"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
					/>
				</svg>
			</div>

			<p class="font-bold text-slate-100 drop-shadow-lg">{{ toast.content }}</p>
			<button
				class="absolute right-5"
				@click="toastStore.removeById(toast.id)"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="white"
					class="h-6 w-6 scale-100 transition-all hover:scale-150"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</button>
		</div>
		<button
			class="indicator-end indicator-bottom badge-primary badge-outline badge indicator-item"
			@click="toastStore.removeAll()"
			v-if="toastStore.toasts.length >= 2"
		>
			<p>clear all notifications</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-3 w-3"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
				/>
			</svg>
		</button>
	</div>
</template>
