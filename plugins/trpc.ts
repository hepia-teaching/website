import { httpBatchLink, createTRPCProxyClient, loggerLink } from '@trpc/client'
import type { AppRouter } from '@/server/trpc/routers'

export default defineNuxtPlugin(() => {
	const headers = useRequestHeaders()

	const client = createTRPCProxyClient<AppRouter>({
		links: [
			loggerLink({
				enabled: (opts) =>
					process.env.NODE_ENV === 'development' ||
					(opts.direction === 'down' && opts.result instanceof Error),
			}),
			httpBatchLink({
				url: '/api/trpc',

				headers() {
					return headers
				},

				/**
				 * Replace regular `fetch` with a `$fetch` from nuxt
				 *
				 * During server-side rendering, calling $fetch to fetch your internal API routes
				 * will directly call the relevant function (emulating the request),
				 * saving an additional API call.
				 *
				 * @see https://nuxt.com/docs/api/utils/dollarfetch
				 */
				fetch: (input, options) =>
					globalThis.$fetch
						.raw(input.toString(), {
							...options,
							credentials: 'include',
						})
						// .catch((e) => {
						//   //   if (e instanceof RTCError && e.) return e.response;
						//   throw e;
						// })
						.then((response) => ({
							...response,
							json: () => Promise.resolve(response._data),
						})),
			}),
		],
	})

	return {
		provide: {
			trpc: client,
		},
	}
})
