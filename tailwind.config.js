/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./formkit.config.ts'],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui'), require('@formkit/themes/tailwindcss')],
}
