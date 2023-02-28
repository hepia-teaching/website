import { z } from 'zod'
import { createSchema as createCourseSchema } from './course'

export const createSchema = z.object({
	studentId: z.number(),
	course: z.object({
		roomId: createCourseSchema.shape.roomId,
		fieldId: createCourseSchema.shape.fieldId,
		year: createCourseSchema.shape.semester.shape.year,
		season: createCourseSchema.shape.semester.shape.season,
	}),
})
