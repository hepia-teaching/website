import { z } from 'zod'
import { Role } from '@prisma/client'

export const createSchema = z.object({
	email: z.string().email(),
	role: z.nativeEnum(Role),
})
