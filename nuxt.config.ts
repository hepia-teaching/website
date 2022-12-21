// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxtjs/tailwindcss',
		'@formkit/nuxt',
		'@vueuse/nuxt',
		[
			'@pinia/nuxt',
			{
				autoImports: [
					// automatically imports `defineStore`
					'defineStore', // import { defineStore } from 'pinia'
					// automatically imports `defineStore` as `definePiniaStore`
					['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
				],
			},
		],
	],
	vite: {
		resolve: {
			alias: {
				// yuck https://github.com/prisma/prisma/issues/12504#issuecomment-1285883083
				'.prisma/client/index-browser':
					'./node_modules/.prisma/client/index-browser.js',
			},
		},
	},
	build: {
		transpile: [/trpc-nuxt/],
	},
	imports: {
		dirs: ['stores'],
	},
})
