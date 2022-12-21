import { protectedProcedure, publicProcedure, router } from '../trpc'
import { createSchema } from '@/zod/user'
import { loginSchema } from '~~/zod/auth'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'

export const userRouter = router({
	list: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.user.findMany()
	}),
	create: publicProcedure
		.input(createSchema)
		.mutation(async ({ input, ctx }) => {
			const user = await ctx.prisma.user.create({
				data: input,
			})

			return user
		}),
	delete: protectedProcedure
		.input(loginSchema)
		.mutation(async ({ input, ctx }) => {
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

			if (ctx.ability.cannot('delete', subject('User', user))) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
				})
			}

			await ctx.prisma.user.delete({
				where: {
					email: input.email,
				},
			})
		}),
})
