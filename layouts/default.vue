<template>
	<Navbar />
	<main class="container mx-auto grid grid-cols-12 py-3">
		<div
			id="aside-left"
			class="col-span-3"
		></div>
		<div class="col-span-6">
			<slot />
		</div>
	</main>
</template>
