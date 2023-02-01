import type { User } from '@prisma/client'
import * as jose from 'jose'

export type Cookie = {
	value: string
	name: 'auth_token'
	path: '/'
	httpOnly: true
	domain: 'localhost'
}

export async function createCookie(user: User): Promise<Cookie> {
	const secret = new TextEncoder().encode('secret')
	const alg = 'HS256'

	const token = await new jose.SignJWT(user)
		.setProtectedHeader({ alg })
		.setExpirationTime('2h')
		.sign(secret)

	return {
		name: 'auth_token',
		value: token,
		path: '/',
		httpOnly: true,
		domain: 'localhost',
	}
}
