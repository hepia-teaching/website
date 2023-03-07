import { protectedProcedure, router } from '../trpc'
import {
	createSchema,
	updateSchema,
	getSchema,
	workloadAssignmentsSchema,
	deleteSchema,
} from '@/zod/assignment'
import dayjs from 'dayjs'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'
import { Prisma } from '@prisma/client'

export const assignmentRouter = router({
	myAssignments: protectedProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.assignements.findMany({
			where: {
				course: {
					learning: {
						some: {
							studentId: ctx.user.id,
						},
					},
				},
				endDate: {
					gte: dayjs().startOf('day').toDate(),
				},
			},
			include: {
				course: {
					include: {
						field: true,
					},
				},
			},
			orderBy: [
				{
					endDate: 'asc',
				},
				{
					description: 'asc',
				},
			],
		})
	}),
	workloadAssignments: protectedProcedure
		.input(workloadAssignmentsSchema)
		.query(async ({ input, ctx }) => {
			const courseStudents = await ctx.prisma.learning.findMany({
				where: {
					roomId: input.roomId,
					fieldId: input.fieldId,
					year: input.year,
					season: input.season,
				},
				select: {
					studentId: true,
				},
			})

			const courseStudentsIds = courseStudents.map(
				(student) => student.studentId
			)

			return await ctx.prisma.assignements.findMany({
				where: {
					course: {
						learning: {
							some: {
								studentId: {
									in: courseStudentsIds,
								},
							},
						},
					},
					endDate: {
						gte: input.startDate,
					},
					startDate: {
						lte: input.endDate,
					},
				},
				include: {
					course: {
						include: {
							field: true,
						},
					},
				},
			})
		}),
	create: protectedProcedure
		.input(createSchema)
		.mutation(async ({ input, ctx }) => {
			if (ctx.ability.cannot('create', 'Assignement')) {
				throw new TRPCError({
					code: 'FORBIDDEN',
				})
			}

			return await ctx.prisma.assignements.create({
				data: {
					endDate: input.endDate,
					startDate: input.startDate,
					estimated_time: input.estimate_time,
					description: input.description,
					roomId: input.course.roomId,
					fieldId: input.course.fieldId,
					season: input.course.semester.season,
					year: input.course.semester.year,
				},
			})
		}),
	update: protectedProcedure
		.input(updateSchema)
		.mutation(async ({ input, ctx }) => {
			if (ctx.ability.cannot('update', 'Assignement')) {
				throw new TRPCError({
					code: 'FORBIDDEN',
				})
			}

			return await ctx.prisma.assignements.update({
				where: {
					id_roomId_fieldId_year_season: {
						id: input.id,
						roomId: input.roomId,
						fieldId: input.fieldId,
						season: input.season,
						year: input.year,
					},
				},
				data: {
					endDate: input.endDate,
					startDate: input.startDate,
					estimated_time: input.estimated_time,
					description: input.description,
					roomId: input.roomId,
					fieldId: input.fieldId,
					season: input.season,
					year: input.year,
				},
			})
		}),
	delete: protectedProcedure
		.input(deleteSchema)
		.mutation(async ({ input, ctx }) => {
			if (ctx.ability.cannot('delete', 'Assignement')) {
				throw new TRPCError({
					code: 'FORBIDDEN',
				})
			}

			const res = await ctx.prisma.assignements.delete({
				where: {
					id_roomId_fieldId_year_season: {
						id: input.id,
						roomId: input.roomId,
						fieldId: input.fieldId,
						season: input.season,
						year: input.year,
					},
				},
				include: {
					course: true,
				},
			})
			return res
		}),
	get: protectedProcedure.input(getSchema).query(async ({ input, ctx }) => {
		const assignement = await ctx.prisma.assignements.findUnique({
			where: {
				id_roomId_fieldId_year_season: input,
			},
			include: {
				course: true,
			},
		})

		if (!assignement) {
			throw new TRPCError({
				code: 'NOT_FOUND',
			})
		}

		if (ctx.ability.cannot('read', subject('Assignement', assignement))) {
			throw new TRPCError({
				code: 'FORBIDDEN',
			})
		}

		return assignement
	}),
})
