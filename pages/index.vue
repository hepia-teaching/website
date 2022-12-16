<script setup lang="ts">
import { Role, User } from '@prisma/client'
import { createSchema } from '@/zod/user'

const { $trpc } = useNuxtApp()

const { values, errors, handleSubmit, reset } = useForm({
	schema: createSchema,
	initialValues: {
		email: 'lmao',
		role: Role.Student,
	},
})

const users = ref<User[]>([])

onMounted(async () => {
	users.value = await $trpc.user.list.query()
})

const submit = handleSubmit(async (values) => {
	const user = await $trpc.user.create.mutate(values)
	users.value.push(user)
	reset()
})
</script>

<template>
	<div class="mx-auto mt-5 flex h-full w-96 flex-col gap-3">
		<h1
			data-testid="homepage-title"
			class="from-indigo-500 via-purple-500 to-pink-500 text-center text-3xl font-bold"
		>
			Hepia
		</h1>
		<form
			class="flex flex-col gap-3 rounded-lg bg-base-200 p-3 shadow-lg"
			@submit.prevent="submit"
		>
			<div class="form-control w-full">
				<label class="label">
					<span
						class="label-text"
						:class="{ 'text-error': errors.email }"
						>Email</span
					>
				</label>
				<input
					class="input-bordered input w-full"
					:class="{ 'input-error': errors.email }"
					type="text"
					v-model="values.email"
				/>
				<label
					class="label"
					v-if="errors.email"
				>
					<span class="label-text-alt text-error">{{ errors.email }}</span>
				</label>
				<p></p>
			</div>
			<div class="form-control w-full">
				<label class="label">
					<span class="label-text">Role</span>
				</label>
				<select
					v-model="values.role"
					class="select-bordered select w-full"
				>
					<option
						:value="role"
						v-for="role in Role"
					>
						{{ role }}
					</option>
				</select>
			</div>
			<button
				type="submit"
				class="btn-outline btn-primary btn"
			>
				submit
			</button>
		</form>
		<ul class="mt-5 text-base-content">
			<li v-for="user in users">
				<span class="badge-outline badge">{{ user.role }}</span>
				{{ user.email }}
			</li>
		</ul>
	</div>
</template>
