<script setup lang="ts">
const store = useAuthStore()

const items = computed(() => {
	if (!store.loggedIn) {
		return [
			{
				to: '/',
				text: 'Login',
			},
			{
				to: '/users/create',
				text: 'Signup',
			},
		]
	}

	return [
		{
			to: '/',
			text: 'Home',
		},
		{
			to: '/me',
			text: 'Me',
		},
		{
			to: '/logout',
			text: 'Logout',
		},
	]
})
</script>

<template>
	<div class="navbar border-b bg-base-100">
		<div class="flex flex-1 items-center gap-3">
			<NuxtLink
				to="/"
				class="btn-ghost btn text-xl normal-case"
				>Hepia</NuxtLink
			>
			<div
				v-if="store.user"
				class="badge-info badge-outline badge"
				data-testid="navbar-role"
			>
				{{ store.user.role }}
			</div>
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
