import { protectedProcedure, publicProcedure, router } from '../trpc'
import { createSchema, getSchema, getTeacherSchema } from '@/zod/teaching'
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
	listMyCourses: protectedProcedure.input(getTeacherSchema).query(async ({ input, ctx }) => {
		return await ctx.prisma.teaching.findMany({
			where: {
				teacherId: input.teacherId,
			},
			include: {
				course: {
					include: {
						field: true,
					}
				},
			}
		})
	}),
	delete: protectedProcedure.input(getSchema)
		.mutation(async ({ input, ctx }) => {
			const user = await ctx.prisma.teaching.findUnique({
				where: {
					teacherId_roomId_fieldId_year_season: {
						teacherId: input.teacherId,
						roomId: input.course.roomId,
						fieldId: input.course.fieldId,
						year: input.course.year,
						season: input.course.season
					},
				},
			})

			if (!user) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				})
			}

			await ctx.prisma.teaching.delete({
				where: {
					teacherId_roomId_fieldId_year_season: {
						teacherId: input.teacherId,
						roomId: input.course.roomId,
						fieldId: input.course.fieldId,
						year: input.course.year,
						season: input.course.season
					}
				},
			})

		}),
})
