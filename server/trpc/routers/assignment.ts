import { protectedProcedure, router } from '../trpc'
import { createSchema } from '@/zod/assignment'
import { TRPCError } from '@trpc/server'
import { subject } from '@casl/ability'
import { string } from 'zod'

export const assignmentRouter = router({
	create: protectedProcedure.input(createSchema).mutation(({ input, ctx }) => {
		return ctx.prisma.assignements.create({
			data: {
				endDate: input.endDate,
				startDate: input.startDate,
				estimated_time : input.estimate_time,
				description: input.description,
				roomId: input.course.roomId,
				fieldId: input.course.fieldId,
				season: input.course.semester.season,
				year: input.course.semester.year,
			},
		})
	}),

})
