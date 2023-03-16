import { z } from 'zod'
import { Season } from '@prisma/client'

export const createSchema = z.object({
	year: z.coerce.number().min(2000).max(3000),
	season: z.nativeEnum(Season),
})

export const deleteSchema = z.object({
	year: createSchema.shape.year,
	season: createSchema.shape.season,
})
