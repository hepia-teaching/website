import { Season } from '@prisma/client'
import { z } from 'zod'
import { createSchema as createCourseSchema } from './course'

export const createSchema = z.object({
	teacherId: z.number(),
	course: z.object({
		roomId: createCourseSchema.shape.roomId,
		fieldId: createCourseSchema.shape.fieldId,
		year: createCourseSchema.shape.semester.shape.year,
		season: createCourseSchema.shape.semester.shape.season,
	}),
})

export const getTeacherSchema = z.object({
	teacherId: z.number(),
})

export const getSchema = z.object({
	teacherId: z.number(),
	course: z.object({
		roomId: createCourseSchema.shape.roomId,
		fieldId: createCourseSchema.shape.fieldId,
		year: createCourseSchema.shape.semester.shape.year,
		season: createCourseSchema.shape.semester.shape.season,
	}),
})

export const getRouteParamsSchema = z.object({
	teacherId: z.number(),
	roomId: z.coerce.number(),
	fieldId: z.coerce.number(),
	year: z.coerce.number(),
	season: z.nativeEnum(Season),
})
