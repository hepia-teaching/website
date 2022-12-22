import { protectedProcedure, publicProcedure, router } from '../trpc'
import { createSchema } from '@/zod/teaching'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'

export const teachingRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		const teaching = await ctx.prisma.teaching.findMany()
		return teaching
	}),
	create: publicProcedure
		.input(createSchema)
		.mutation(async ({ input, ctx }) => {
			const teaching = await ctx.prisma.teaching.create({
				data: {
					teacherId: input.teacherId,
					...input.course,
				},
			})

			return teaching
		}),
	// delete: protectedProcedure
	// 	.input(loginSchema)
	// 	.mutation(async ({ input, ctx }) => {
	// 		const user = await ctx.prisma.user.findUnique({
	// 			where: {
	// 				email: input.email,
	// 			},
	// 		})

	// 		if (!user) {
	// 			throw new TRPCError({
	// 				code: 'NOT_FOUND',
	// 			})
	// 		}

	// 		if (ctx.ability.cannot('delete', subject('User', user))) {
	// 			throw new TRPCError({
	// 				code: 'UNAUTHORIZED',
	// 			})
	// 		}

	// 		await ctx.prisma.user.delete({
	// 			where: {
	// 				email: input.email,
	// 			},
	// 		})
	// 	}),
})
