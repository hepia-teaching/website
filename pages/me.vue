<script setup lang="ts">
const { $trpc } = useNuxtApp()
const { data: me, error } = useAsyncData(() => $trpc.auth.me.query())
</script>

<template>
	<div v-if="error">{{ error.message }}</div>
	<pre v-else>{{ JSON.stringify(me, null, 2) }}</pre>
</template>
