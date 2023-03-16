<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/user'
import { Role } from '@prisma/client'

const route = useRoute()
const role = z.nativeEnum(Role).catch(Role.Student).parse(route.query.role)

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
	initialValues: {
		role,
	},
})

const { $trpc } = useNuxtApp()
const toasts = useToastStore()

async function submit(values: z.infer<typeof createSchema>) {
	try {
		await $trpc.user.create.mutate(values)
		reset()
		toasts.success("Successfully created used.")
	} catch(e) {
		toasts.error(e)
	}
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Create user</FancyTitle>
		<ZodForm @submit="submit">
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
