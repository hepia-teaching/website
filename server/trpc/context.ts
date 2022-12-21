import type { H3Event } from 'h3'
import { inferAsyncReturnType } from '@trpc/server'
import { client } from '../prisma'
import * as jose from 'jose'
import { User } from '@prisma/client'
import { defineAbilityFor } from '@/casl'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (event: H3Event) => {
	async function getUserFromCookie() {
		const token = getCookie(event, 'auth_token')

		if (token) {
			const secret = new TextEncoder().encode('secret')
			const { payload } = await jose.jwtVerify(token, secret)
			return payload as User
		}

		return null
	}

	const user = await getUserFromCookie()
	const ability = defineAbilityFor(user)

	return {
		user,
		event,
		prisma: client,
		ability,
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
