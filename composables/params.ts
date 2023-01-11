import { z } from 'zod'

export function useParams<T extends z.AnyZodObject>(schema: T): z.infer<T> {
	const route = useRoute()

	try {
		return schema.parse(route.params)
	} catch (e) {
		throw createError({
			statusCode: 400,
		})
	}
}
