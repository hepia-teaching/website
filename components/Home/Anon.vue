<script setup lang="ts">
import { z } from 'zod'
import { loginSchema } from '@/zod/auth'

const { ZodForm, ZodKit } = useZodFormKit({
	schema: loginSchema,
	initialValues: {
		email: 'teacher@hepia.local',
	},
})

const store = useAuthStore()
const router = useRouter()

async function submit(values: z.infer<typeof loginSchema>) {
	try {
		await store.login(values)
		router.push('/')
	} catch {
		alert('error')
	}
}
</script>

<template>
	<div class="mx-auto mt-5 flex h-full flex-col gap-3">
		<FancyTitle>Login</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				data-testid="login-email"
				type="text"
				name="email"
			/>
		</ZodForm>
	</div>
</template>
