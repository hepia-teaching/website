<script setup lang="ts">
import { z } from 'zod'
import { updateSchema, getRouteParamsSchema } from '@/zod/user'
import dayjs from 'dayjs'
import { label } from '@formkit/inputs'
import test from 'node:test'
const { $trpc } = useNuxtApp()
const params = useParams(getRouteParamsSchema)
const user = await $trpc.user.get.query(params)
const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: updateSchema,
	initialValues: {
		id: user.id,
		role: user.role,
		email: user.email,
	},
})

// const [{ data: user }] = await Promise.all(
// 	[
// 		useAsyncData('user', () => $trpc.user.list.query()),
// 	]
// )

const router = useRouter()
async function submit({ ...values }: z.infer<typeof updateSchema>) {
	console.log(values)
	await $trpc.user.update.mutate({
		id: values.id,
		role: values.role,
		email: values.email,
	})
	reset()
	router.push(
		`/user/edit/${user.id}`
	)
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Edit a Course</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				label="id"
				name="id"
			/>
			<ZodKit
				label="email"
				name="email"
			/>
			<ZodKit
				label="role"
				name="role"
			/>
		</ZodForm>
	</div>
</template>
