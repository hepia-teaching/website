import { protectedProcedure, router } from '../trpc'
import { createSchema } from '@/zod/semester'

export const semesterRouter = router({
	list: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.semester.findMany()
	}),
	create: protectedProcedure.input(createSchema).mutation(({ input, ctx }) => {
		return ctx.prisma.semester.create({
			data: {
				year: input.year,
				season: input.season,
				name: `${input.season} ${input.year}`,
			},
		})
	}),
})
