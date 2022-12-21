import { protectedProcedure, router } from '../trpc'
import { createSchema } from '@/zod/room'

export const roomRouter = router({
	list: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.room.findMany()
	}),
	create: protectedProcedure.input(createSchema).mutation(({ input, ctx }) => {
		return ctx.prisma.room.create({
			data: input,
		})
	}),
})
