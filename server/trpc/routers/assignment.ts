import { protectedProcedure, router } from '../trpc'

export const assignmentRouter = router({
	myAssignments: protectedProcedure.query(async ({ ctx }) => {
		const assignments = await ctx.prisma.assignements.findMany({
			where: {
				course: {
					learning: {
						some: {
							studentId: ctx.user.id
						}
					}
				},
				endDate: {
					gte: new Date()
				}
			},
			include: {
				course: true
			},
		})

		return assignments
	})
})
