<script setup lang="ts">
const store = useAuthStore()
const router = useRouter()

await store.logout()
router.replace('/')
</script>

<template>
	<div>Logging out...</div>
</template>
