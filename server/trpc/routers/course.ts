import { protectedProcedure, router } from '../trpc'
import { createSchema } from '@/zod/course'

export const courseRouter = router({
	list: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.course.findMany({
			include: {
				field: true,
			},
		})
	}),
	create: protectedProcedure.input(createSchema).mutation(({ input, ctx }) => {
		return ctx.prisma.course.create({
			data: {
				roomId: input.roomId,
				fieldId: input.fieldId,
				year: input.semester.year,
				season: input.semester.season,
				description: input.description,
			},
		})
	}),
})
