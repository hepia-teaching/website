<script setup lang="ts">
import type { z } from 'zod'
import { updateSchema, getRouteParamsSchema } from '@/zod/user'
import { Role } from '@prisma/client'

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

const router = useRouter()
const toast = useToastStore()

async function submit(values: z.infer<typeof updateSchema>) {
	try {
		const updated = await $trpc.user.update.mutate({
			id: values.id,
			role: values.role,
			email: values.email,
		})
		reset()
		router.push(`/users?role=${updated.role}`)
	} catch (e) {
		toast.error(e)
	}
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Edit a Course</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				type="hidden"
				disabled="true"
				name="id"
			/>
			<ZodKit
				label="Email"
				type="text"
				name="email"
			/>
			<ZodKit
				label="Role"
				type="select"
				name="role"
				:options="Role"
			/>
		</ZodForm>
	</div>
</template>
