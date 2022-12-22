import { z } from 'zod'

export const createSchema = z.object({
	name: z.string(),
})

export const deleteSchema = z.object({
	id: z.number(),
})
