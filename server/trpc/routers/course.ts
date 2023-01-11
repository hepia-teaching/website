import { protectedProcedure, router } from '../trpc'
import { createSchema, getSchema } from '@/zod/course'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'

export const courseRouter = router({
	list: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.course.findMany({
			include: {
				field: true,
				room: true,
			},
		})
	}),
	myCourses: protectedProcedure.query(async ({ ctx }) => {
		const courses = await ctx.prisma.course.findMany({
			where: {
				teaching: {
					some: {
						teacherId: ctx.user.id,
					},
				},
			},
			include: {
				field: true,
				room: true,
			},
		})

		return courses
	}),
	get: protectedProcedure.input(getSchema).query(async ({ input, ctx }) => {
		const course = await ctx.prisma.course.findUnique({
			where: {
				roomId_fieldId_year_season: input,
			},
			include: {
				teaching: true,
				field: true,
				room: true,
				assignements: true,
			},
		})

		if (!course) {
			throw new TRPCError({
				code: 'NOT_FOUND',
			})
		}

		if (ctx.ability.cannot('read', subject('Course', course))) {
			throw new TRPCError({
				code: 'FORBIDDEN',
			})
		}

		return course
	}),
	create: protectedProcedure.input(createSchema).mutation(({ input, ctx }) => {
		if (ctx.ability.cannot('create', 'Course')) {
			throw new TRPCError({
				code: 'FORBIDDEN',
			})
		}

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
