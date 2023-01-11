import { z } from 'zod'

export const createSchema = z.object({
	number: z.string(),
})

export const deleteSchema = z.object({
	id: z.number(),
})
