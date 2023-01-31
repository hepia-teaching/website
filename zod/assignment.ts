import { Season } from '@prisma/client'
import { z } from 'zod'
// REMOVE LATER import { createSchema as createSemesterSchema } from './semester'
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
	id:z.number(),
	course: createCourseSchema,
	startDate: z.coerce.date(),
	endDate: z.coerce.date(),
	description,
	estimate_time: z.coerce.number().min(0),
})

export const deleteSchemaAssignement = z.object({
	id:z.number(),
	course: createCourseSchema,
	startDate: z.coerce.date(),
	endDate: z.coerce.date(),
	description,
	estimate_time: z.coerce.number().min(0),
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
