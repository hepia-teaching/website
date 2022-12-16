import { z } from 'zod'
import { reactiveComputed, toReactive } from '@vueuse/core'

export function useForm<T extends z.ZodObject<z.ZodRawShape>>({
	schema,
	initialValues,
}: {
	schema: T
	initialValues: Partial<z.infer<T>> | undefined
}): {
	values: z.infer<T>
	errors: Partial<{ [key in keyof z.infer<T>]: string | null }>
	handleSubmit: (cb: (values: z.infer<T>) => void) => () => void
	reset: () => void
} {
	function getInitialValues() {
		return Object.keys(schema.keyof().Enum).reduce((previous, current) => {
			return {
				...previous,
				[current]: initialValues?.[current],
			}
		}, {})
	}

	const values = ref(getInitialValues())
	const result = ref<ReturnType<typeof schema.safeParse> | null>()

	function safeParse(data: any) {
		return schema.safeParse(data)
	}

	watch(
		values,
		(data) => {
			result.value = safeParse(data)
		},
		{ deep: true, immediate: false }
	)

	function getMessages(key: string): string | null {
		if (result.value == null) return null
		if (result.value.success) return null
		return (
			result.value.error.issues
				.filter((issue) => issue.path.includes(key))
				.map((issue) => issue.message)[0] ?? null
		)
	}

	return {
		values: toReactive(values),
		errors: reactiveComputed(
			() =>
				Object.keys(schema.keyof().Enum).reduce((previous, current) => {
					return {
						...previous,
						[current]: getMessages(current),
					}
				}, {}) satisfies Partial<{
					[key in keyof z.infer<T>]: string
				}>
		),
		handleSubmit: (cb) => {
			return () => {
				result.value = safeParse(values.value)
				if (result.value.success) cb(result.value.data)
			}
		},
		reset: () => (values.value = getInitialValues()),
	}
}
