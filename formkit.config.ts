import { createConfig } from '@formkit/core'
import { generateClasses } from '@formkit/themes'

export default createConfig({
	config: {
		classes: generateClasses({
			text: {
				outer: 'mb-5',
				input: 'input input-bordered w-full',
			},
			select: {
				outer: 'mb-5',
				input: 'select select-bordered w-full',
			},
			button: {
				input: 'btn btn-primary',
			},
		}),
	},
})
