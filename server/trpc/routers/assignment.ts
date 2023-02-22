import { protectedProcedure, router } from '../trpc'
import {
	createSchema,
	updateSchema,
	getSchema,
	deleteSchema,
} from '@/zod/assignment'
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
					gte: new Date(),
				},
			},
			include: {
				course: true,
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
			try {
				let res = await ctx.prisma.assignements.delete({
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

				if (ctx.ability.cannot('delete', subject('Assignement', res))) {
					throw new TRPCError({
						code: 'FORBIDDEN',
					})
				}

				return res
			} catch (e) {
				if (e instanceof Prisma.PrismaClientKnownRequestError) {
					if (e.code === 'P2025') {
						throw new TRPCError({
							code: 'NOT_FOUND',
						})
					}
				}

				throw e
			}
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
