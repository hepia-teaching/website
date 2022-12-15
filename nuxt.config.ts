// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxtjs/tailwindcss'],
	vite: {
		resolve: {
			alias: {
				// yuck https://github.com/prisma/prisma/issues/12504#issuecomment-1285883083
				'.prisma/client/index-browser':
					'./node_modules/.prisma/client/index-browser.js',
			},
		},
	},
})
