<script setup lang="ts">
const store = useAuthStore()
</script>

<template>
	<pre>{{ JSON.stringify(store.user, null, 2) }}</pre>
</template>
