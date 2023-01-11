import { Season } from '@prisma/client'
import { z } from 'zod'
import { createSchema as createSemesterSchema } from './semester'

const roomId = z.number()
const fieldId = z.number()
const description = z.string().nullish()

export const createSchema = z.object({
	roomId,
	fieldId,
	description,
	semester: createSemesterSchema,
})

export const getSchema = z.object({
	roomId,
	fieldId,
	year: z.number(),
	season: z.nativeEnum(Season),
})

export const getRouteParamsSchema = z.object({
	roomId: z.coerce.number(),
	fieldId: z.coerce.number(),
	year: z.coerce.number(),
	season: z.nativeEnum(Season),
})
