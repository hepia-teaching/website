import { protectedProcedure, publicProcedure, router } from '../trpc'
import { loginSchema } from '@/zod/auth'
import { TRPCError } from '@trpc/server'
import * as jose from 'jose'

export const authRouter = router({
	me: protectedProcedure.query(async ({ ctx }) => {
		const me = await ctx.prisma.user.findUnique({
			where: {
				email: ctx.user.email,
			},
		})

		if (!me) {
			throw new TRPCError({
				code: 'NOT_FOUND',
			})
		}

		return me
	}),
	login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
		const user = await ctx.prisma.user.findUnique({
			where: {
				email: input.email,
			},
		})

		if (!user) {
			throw new TRPCError({
				code: 'NOT_FOUND',
			})
		}

		const secret = new TextEncoder().encode('secret')
		const alg = 'HS256'

		const token = await new jose.SignJWT(user)
			.setProtectedHeader({ alg })
			.setExpirationTime('2h')
			.sign(secret)

		setCookie(ctx.event, 'auth_token', token, { path: '/', httpOnly: true })
		return user
	}),
	logout: protectedProcedure.mutation(({ ctx }) => {
		deleteCookie(ctx.event, 'auth_token')
	}),
})
