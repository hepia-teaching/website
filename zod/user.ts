import { z } from 'zod'
import { Role } from '@prisma/client'

const email = z.string().email()

export const createSchema = z.object({
	email,
	role: z.nativeEnum(Role),
})

export const deleteSchema = z.object({
	email,
})
