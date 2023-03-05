import {
	h,
	VNode,
	RendererNode,
	RendererElement,
	ComponentOptionsMixin,
} from 'vue'
import { z } from 'zod'
import { FormKit } from '@formkit/vue'
import { FormKitNode } from '@formkit/core'
import { reset as formkitReset } from '@formkit/core'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

export function useZodFormKit<T extends z.ZodObject<any, any, any>>({
	schema,
	initialValues,
}: {
	schema: T
	initialValues?: Partial<z.infer<T>>
}) {
	type FormKitProps = InstanceType<typeof FormKit>['$props']
	// type FormKitEmits = InstanceType<typeof FormKit>['$emit']
	type ZodFormProps = Omit<FormKitProps, 'type'>

	const uuid = uuidv4()

	function reset() {
		formkitReset(uuid)
	}

	const ZodForm = defineComponent<
		ZodFormProps,
		() => VNode<
			RendererNode,
			RendererElement,
			{
				[key: string]: any
			}
		>,
		unknown,
		{},
		{},
		ComponentOptionsMixin,
		ComponentOptionsMixin,
		{
			submit: (_data: z.infer<T>, _node?: FormKitNode | undefined) => true
		}
	>({
		setup(props, { slots, emit }) {
			return () =>
				h(
					FormKit,
					{
						type: 'form',
						id: uuid,
						onSubmit: props.onSubmit,
						onSubmitRaw: (e, node) => {
							const result = schema.safeParse(node?.value)

							if (result.success) {
								props.onSubmit?.(result.data, node)
							} else {
								// emit('submit-invalid', node)
							}
						},
					} as FormKitProps,
					slots
				)
		},
	})

	type ZodKitProps = Omit<
		InstanceType<typeof FormKit>['$props'],
		'name' | 'validation' | 'validation-rules' | 'value'
	> & {
		name: keyof z.infer<T>
	}

	const ZodKit = defineComponent<ZodKitProps>({
		setup(props, { slots }) {
			const errors = ref<string[] | undefined>()

			function zod(node: FormKitNode): boolean {
				const result = schema
					.pick({
						[node.name]: true,
					})
					.safeParse({
						[node.name]: node.value,
					})

				if (!result.success) {
					errors.value = result.error.flatten().fieldErrors[node.name]
				} else {
					errors.value = undefined
				}

				return result.success
			}

			function onNode(node: FormKitNode) {
				if (initialValues?.[node.name]) {
					if((initialValues[node.name] as any) instanceof Date){
						// If its a date, this bastards only works with strings and not Date objects
						node.input(dayjs(initialValues[node.name]).format("YYYY-MM-DD"), false)
					}
					else{
						node.input(initialValues[node.name], false)
					}
				}

			}

			return () =>
				h(
					FormKit,
					{
						type: props.type,
						name: props.name,
						label: props.label,
						validation: '+zod',
						validationRules: { zod },
						validationMessages: {
							zod: () => errors.value?.[0] ?? 'invalid',
						},
						onNode,
					} as FormKitProps,
					slots
				)
		},
	})

	return { ZodForm, ZodKit, reset } as {
		ZodForm: typeof ZodForm & {
			new(): {
				$slots: {
					default: (option: {
						value: { [key in keyof z.infer<T>]: unknown }
					}) => VNode[]
				}
			}
		}
		ZodKit: typeof ZodKit
		reset: () => void
	}
}
