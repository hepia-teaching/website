import { protectedProcedure, router } from '../trpc'
import { createSchema, deleteSchema } from '@/zod/field'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'

export const fieldRouter = router({
	list: protectedProcedure.query(async ({ ctx }) => {
		const fields = await ctx.prisma.field.findMany()
		return fields
	}),
	create: protectedProcedure
		.input(createSchema)
		.mutation(async ({ input, ctx }) => {
			const field = await ctx.prisma.field.create({
				data: input,
			})

			return field
		}),
	delete: protectedProcedure
		.input(deleteSchema)
		.mutation(async ({ input, ctx }) => {
			const field = await ctx.prisma.field.findUnique({
				where: {
					id: input.id,
				},
			})

			if (!field) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				})
			}

			if (ctx.ability.cannot('delete', subject('Field', field))) {
				throw new TRPCError({
					code: 'FORBIDDEN',
				})
			}

			await ctx.prisma.field.delete({
				where: {
					id: input.id,
				},
			})
		}),
})
