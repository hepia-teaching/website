import { httpBatchLink, createTRPCProxyClient } from "@trpc/client"
import type { AppRouter } from "@/server/trpc/routers"

export default defineNuxtPlugin(() => {
	const client = createTRPCProxyClient<AppRouter>({
		links: [
			httpBatchLink({
				url: "/api/trpc",

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
						.raw(input.toString(), options)
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
