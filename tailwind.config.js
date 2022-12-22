/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./formkit.config.ts'],
	theme: {
		extend: {},
		fontFamily: {
			sans: 'Quicksand, Helvetica, Arial, sans-serif',
		},
	},
	plugins: [require('daisyui'), require('@formkit/themes/tailwindcss')],
}
