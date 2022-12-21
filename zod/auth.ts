import { z } from 'zod'
import { createSchema } from './user'

export const loginSchema = z.object({
	email: createSchema.shape.email,
})
