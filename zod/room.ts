import { z } from 'zod'

export const createSchema = z.object({
	number: z.string(),
})
