import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'
import { User } from '@prisma/client'
import { createSchema } from '@/zod/user'
import { loginSchema } from '~~/zod/auth'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'

export let users: User[] = [
	{ id: 0, email: 'admin@hepia.local', role: 'Admin' },
	{ id: 1, email: 'teacher@hepia.local', role: 'Teacher' },
	{ id: 2, email: 'student@hepia.local', role: 'Student' },
]

export const userRouter = router({
	list: publicProcedure.query(() => {
		return users
	}),
	byId: publicProcedure
		.input(
			z.object({
				id: z.number(),
			})
		)
		.query(({ input }) => {
			return users.find((user) => user.id === input.id)
		}),
	create: publicProcedure.input(createSchema).mutation(({ input }) => {
		let user = {
			id: Math.random(),
			...input,
		}

		users.push(user)
		return user
	}),
	delete: protectedProcedure.input(loginSchema).mutation(({ input, ctx }) => {
		const user = users.find((user) => user.email === input.email)

		if (!user) {
			throw new TRPCError({
				code: 'NOT_FOUND',
			})
		}

		if (ctx.ability.cannot('delete', subject('User', user))) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
			})
		}

		users = users.filter((user) => user.email !== input.email)
	}),
})
