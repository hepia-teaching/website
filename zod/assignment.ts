import { Season } from '@prisma/client'
import { z } from 'zod'
import { createSchema as createCourseSchema } from './course'

const roomId = z.number()
const fieldId = z.number()
const description = z.string()
const id = z.coerce.number()

export const createSchema = z.object({
	course: createCourseSchema,
	startDate: z.coerce.date(),
	endDate: z.coerce.date(),
	description,
	estimate_time: z.coerce.number().min(0),
})

export const updateSchema = z.object({
	id: z.number(),
	roomId: createCourseSchema.shape.roomId,
	fieldId: createCourseSchema.shape.fieldId,
	year: createCourseSchema.shape.semester.shape.year,
	season: createCourseSchema.shape.semester.shape.season,
	startDate: z.string(),
	endDate: z.string().optional(),
	description,
	estimated_time: z.coerce.number().min(0),
})

export const deleteSchema = z.object({
	id: z.number(),
	roomId: createCourseSchema.shape.roomId,
	fieldId: createCourseSchema.shape.fieldId,
	year: createCourseSchema.shape.semester.shape.year,
	season: createCourseSchema.shape.semester.shape.season,
	startDate: z.string(),
	endDate: z.string().optional(),
	description,
	estimated_time: z.coerce.number().min(0),
})

export const getSchema = z.object({
	id,
	roomId,
	fieldId,
	year: z.number(),
	season: z.nativeEnum(Season),
})

export const getRouteParamsSchema = z.object({
	id,
	roomId: z.coerce.number(),
	fieldId: z.coerce.number(),
	year: z.coerce.number(),
	season: z.nativeEnum(Season),
})

export const workloadAssignmentsSchema = z.object({
	roomId: createCourseSchema.shape.roomId,
	fieldId: createCourseSchema.shape.fieldId,
	year: createCourseSchema.shape.semester.shape.year,
	season: createCourseSchema.shape.semester.shape.season,
	startDate: z.string(),
	endDate: z.string(),
})
