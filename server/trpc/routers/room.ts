import { protectedProcedure, router } from '../trpc'
import { createSchema, deleteSchema } from '@/zod/room'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'

export const roomRouter = router({
	list: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.room.findMany()
	}),
	create: protectedProcedure.input(createSchema).mutation(({ input, ctx }) => {
		return ctx.prisma.room.create({
			data: input,
		})
	}),
	delete: protectedProcedure
		.input(deleteSchema)
		.mutation(async ({ input, ctx }) => {
			const room = await ctx.prisma.room.findUnique({
				where: {
					id: input.id,
				},
			})

			if (!room) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				})
			}

			if (ctx.ability.cannot('delete', subject('Room', room))) {
				throw new TRPCError({
					code: 'FORBIDDEN',
				})
			}

			await ctx.prisma.room.delete({
				where: {
					id: input.id,
				},
			})
		}),
})
