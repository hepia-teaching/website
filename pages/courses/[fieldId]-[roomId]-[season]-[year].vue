<script setup lang="ts">
import { getRouteParamsSchema } from '@/zod/course'

const params = useParams(getRouteParamsSchema)

const { $trpc } = useNuxtApp()
const { data } = await useAsyncData(() => $trpc.course.get.query(params))
</script>

<template>
	<div>course page</div>
	<pre>{{ JSON.stringify(data, null, 2) }}</pre>
</template>
