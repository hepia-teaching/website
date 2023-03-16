<template>
	<div data-theme="light" class="min-h-screen bg-base-200 relative">
		<Navbar />
		<NuxtLayout>
			<NuxtLoadingIndicator />
			<NuxtPage />
		</NuxtLayout>
		<div class="absolute right-5 bottom-5 w-[34rem]">
			<Toasts />
		</div>
	</div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
</style>
