<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/user'
import { Role } from '@prisma/client'

const { ZodForm, ZodKit } = useZodFormKit({
	schema: createSchema,
})

const router = useRouter()
const { $trpc } = useNuxtApp()

async function submit(values: z.infer<typeof createSchema>) {
	try {
		await $trpc.user.create.mutate(values)
		router.push('/login')
	} catch {
		alert('error')
	}
}
</script>

<template>
	<div class="mx-auto mt-5 flex h-full w-96 flex-col gap-3">
		<FancyTitle>Signup</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				type="text"
				name="email"
			/>

			<ZodKit
				type="select"
				name="role"
				:options="Role"
			/>
		</ZodForm>
	</div>
</template>
