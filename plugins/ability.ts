export default defineNuxtPlugin(() => {
	const store = useAuthStore()

	return {
		provide: {
			can: (...args: Parameters<typeof store.ability.can>) =>
				store.ability.can(...args),
			cannot: (...args: Parameters<typeof store.ability.cannot>) =>
				store.ability.cannot(...args),
		},
	}
})
