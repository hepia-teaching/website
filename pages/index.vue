<script setup lang="ts">
const store = useAuthStore()
</script>

<template>
	<Suspense>
		<template #fallback>Loading...</template>
		<template v-if="store.user">
			<LazyHomeAdmin v-if="store.user.role === 'Admin'" />
			<LazyHomeTeacher v-else-if="store.user.role === 'Teacher'" />
			<div v-else>Welcome, {{ store.user.role }}</div>
		</template>
		<LazyHomeAnon v-else />
	</Suspense>
</template>
