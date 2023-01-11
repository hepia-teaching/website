<script setup lang="ts">
const store = useAuthStore()
</script>

<template>
	<template v-if="store.user">
		<HomeAdmin v-if="store.user.role === 'Admin'" />
		<HomeTeacher v-else-if="store.user.role === 'Teacher'" />
		<div v-else>Welcome, {{ store.user.role }}</div>
	</template>
	<HomeAnon v-else />
</template>
