<script setup lang="ts">
const store = useAuthStore()

definePageMeta({
	layout: false,
})
</script>

<template>
	<NuxtLayout :name="store.user?.role === 'Student' ? 'full' : 'default'">
		<template v-if="store.user">
			<HomeAdmin v-if="store.user.role === 'Admin'" />
			<HomeTeacher v-else-if="store.user.role === 'Teacher'" />
			<HomeStudent v-else-if="store.user.role === 'Student'" />
			<div v-else>Welcome, {{ store.user.role }}</div>
		</template>
		<HomeAnon v-else />
	</NuxtLayout>
</template>
