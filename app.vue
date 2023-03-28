<template>
	<div
		data-theme="light"
		class="relative min-h-[200vh] bg-base-200"
	>
		<Navbar />
		<NuxtLayout>
			<NuxtLoadingIndicator />
			<NuxtPage />
		</NuxtLayout>
		<div class="fixed right-5 bottom-5 w-[34rem]">
			<Toasts />
		</div>
	</div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
</style>
