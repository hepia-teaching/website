import { z } from 'zod'
import { createSchema as createSemesterSchema } from './semester'

export const createSchema = z.object({
	roomId: z.number(),
	fieldId: z.number(),
	description: z.string().nullish(),
	semester: createSemesterSchema,
})
