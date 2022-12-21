import { protectedProcedure, router } from '../trpc'
import { createSchema } from '@/zod/field'

export const fieldRouter = router({
	list: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.field.findMany()
	}),
	create: protectedProcedure.input(createSchema).mutation(({ input, ctx }) => {
		return ctx.prisma.field.create({
			data: input,
		})
	}),
})
