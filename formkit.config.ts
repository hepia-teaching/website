import { createConfig } from '@formkit/core'
import { generateClasses } from '@formkit/themes'

export default createConfig({
	config: {
		classes: generateClasses({
			text: {
				outer: 'mb-5',
				input: 'input input-bordered w-full formkit-invalid:input-error',
				label: 'formkit-invalid:text-error',
			},
			select: {
				outer: 'mb-5',
				input: 'select select-bordered w-full',
			},
			number: {
				outer: 'mb-5',
				input: 'input input-bordered w-full',
			},
			textarea: {
				outer: 'mb-5',
				input: 'textarea textarea-bordered w-full',
			},
			submit: {
				outer: 'mb-5',
				input: 'btn btn-outline w-full',
			},
		}),
	},
})
