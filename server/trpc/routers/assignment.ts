import { protectedProcedure, router } from '../trpc'
import {
	createSchema,
	updateSchema,
	getSchema,
	deleteSchemaAssignement,
} from '@/zod/assignment'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'

export const assignmentRouter = router({
	create: protectedProcedure.input(createSchema).mutation(({ input, ctx }) => {
		return ctx.prisma.assignements.create({
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
	update: protectedProcedure.input(updateSchema).mutation(({ input, ctx }) => {
		return ctx.prisma.assignements.update({
			where: {
				id_roomId_fieldId_year_season: {
					id: input.id,
					roomId: input.course.roomId,
					fieldId: input.course.fieldId,
					season: input.course.semester.season,
					year: input.course.semester.year,
				},
			},
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
	delete: protectedProcedure
		.input(deleteSchemaAssignement)
		.mutation(async ({ input, ctx }) => {
			let res = await ctx.prisma.assignements.delete({
				where: {
					id_roomId_fieldId_year_season: {
						id: input.id,
						roomId: input.course.roomId,
						fieldId: input.course.fieldId,
						season: input.course.semester.season,
						year: input.course.semester.year,
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

		if (ctx.ability.cannot('update', subject('Assignement', assignement))) {
			throw new TRPCError({
				code: 'FORBIDDEN',
			})
		}

		if (ctx.ability.cannot('create', subject('Assignement', assignement))) {
			throw new TRPCError({
				code: 'FORBIDDEN',
			})
		}

		return assignement
	}),
})
