import { protectedProcedure, router } from '../trpc'
import { createSchema, deleteSchema } from '@/zod/semester'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'

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
	delete: protectedProcedure
		.input(deleteSchema)
		.mutation(async ({ input, ctx }) => {
			const semester = await ctx.prisma.semester.findUnique({
				where: {
					year_season: {
						year: input.year,
						season: input.season,
					},
				},
			})

			if (!semester) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				})
			}

			if (ctx.ability.cannot('delete', subject('Semester', semester))) {
				throw new TRPCError({
					code: 'FORBIDDEN',
				})
			}

			await ctx.prisma.semester.delete({
				where: {
					year_season: {
						year: input.year,
						season: input.season,
					},
				},
			})
		}),
})
