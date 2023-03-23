import { User } from '@prisma/client'
import { defineAbilityFor } from '@/casl'
import * as jose from 'jose'
import { loginSchema } from '@/zod/auth'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const useAuthStore = defineStore('auth', () => {
	const user = ref<User | null>(null)
	const loggedIn = computed(() => user.value !== null)

	const token = useCookie('auth_token')

	if (token.value) {
		user.value = jose.decodeJwt(token.value) as User
	}

	async function login(values: z.infer<typeof loginSchema>) {
		const { $trpc } = useNuxtApp()
		user.value = await $trpc.auth.login.mutate(values)
	}

	async function logout() {
		if (!loggedIn.value) return

		const { $trpc } = useNuxtApp()

		try {
			await $trpc.auth.logout.mutate()
			user.value = null
		} catch (e) {
			if (e instanceof TRPCError) {
				if (e.code === 'FORBIDDEN') {
					// we're already logged out
					user.value = null
					return
				}
			}

			throw e
		}
	}

	const ability = computed(() => defineAbilityFor(user.value))

	return {
		user,
		loggedIn,
		ability,
		login,
		logout,
	}
})
