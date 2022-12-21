<script setup lang="ts">
const store = useAuthStore()

const items = computed(() => {
	let items = [{ to: '/', text: 'Home' }]

	if (store.loggedIn) {
		items = [
			...items,
			{
				to: '/me',
				text: 'Me',
			},
			{
				to: '/logout',
				text: 'Logout',
			},
		]
	} else {
		items = [
			...items,
			{
				to: '/login',
				text: 'Login',
			},
			{
				to: '/signup',
				text: 'Signup',
			},
		]
	}

	return items
})
</script>

<template>
	<div class="navbar bg-base-100">
		<div class="flex-1">
			<NuxtLink
				to="/"
				class="btn-ghost btn text-xl normal-case"
				>daisyUI</NuxtLink
			>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				<li
					v-for="item in items"
					:key="item.to"
				>
					<NuxtLink :to="item.to">{{ item.text }}</NuxtLink>
				</li>
			</ul>
		</div>
	</div>
</template>
