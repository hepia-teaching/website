export default defineNuxtPlugin(() => {
	function add(message: string) {
		alert(message)
	}

	return {
		provide: {
			toast: {
				add,
			},
		},
	}
})
