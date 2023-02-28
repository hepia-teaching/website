import { protectedProcedure, publicProcedure, router } from '../trpc'
import { createSchema } from '@/zod/learning'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'

export const learningRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		const learning = await ctx.prisma.learning.findMany()
		return learning
	}),
	create: publicProcedure
		.input(createSchema)
		.mutation(async ({ input, ctx }) => {
			const learning = await ctx.prisma.learning.createMany({
				data: {
					studentId: input.studentId,
					...input.course,
				},
			})

			return learning
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
