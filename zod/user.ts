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

export const listSchema = z
	.object({
		role: 	z.nativeEnum(Role),
	})
	.partial()
	.optional()
export const getRouteParamsSchema = z.object({
	id: z.coerce.number(),
})
export const updateSchema = z.object({
	id: z.coerce.number(),
	email,
	role: z.nativeEnum(Role),
})
export const getSchema = z.object({
	email,
	role: z.nativeEnum(Role),
})