import { protectedProcedure, publicProcedure, router } from '../trpc'
import { createSchema, listSchema, updateSchema } from '@/zod/user'
import { loginSchema } from '@/zod/auth'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'

export const userRouter = router({
	list: publicProcedure.input(listSchema).query(async ({ input, ctx }) => {
		const users = await ctx.prisma.user.findMany({
			where: input,
		})

		return users
	}),
	create: publicProcedure
		.input(createSchema)
		.mutation(async ({ input, ctx }) => {
			if (
				ctx.ability.cannot(
					'create',
					subject('User', {
						id: 0,
						...input,
					})
				)
			) {
				throw new TRPCError({
					code: 'FORBIDDEN',
				})
			}

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
					code: 'FORBIDDEN',
				})
			}

			await ctx.prisma.user.delete({
				where: {
					email: input.email,
				},
			})
		}),
		update: protectedProcedure
		.input(updateSchema)
		.mutation(async ({ input, ctx }) => {
			if (ctx.ability.cannot('update', 'User')) {
				throw new TRPCError({
					code: 'FORBIDDEN',
				})
			}

			return await ctx.prisma.user.update({
				where: {
					id: input.id,
					},
				},
				data: {
					id: input.id,
					email: input.email,
					role: input.role,
			})
	}),
})
