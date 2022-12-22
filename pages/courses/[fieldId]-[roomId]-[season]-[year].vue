<script setup lang="ts">
import { getRouteParamsSchema } from '@/zod/course'

const { $trpc } = useNuxtApp()
const params = useParams(getRouteParamsSchema)
const course = await $trpc.course.get.query(params)
</script>

<template>
	<FancyTitle
		>{{ course.field.name }} {{ course.season }} {{ course.year }}</FancyTitle
	>
	<div>course page</div>
	<pre>{{ JSON.stringify(course, null, 2) }}</pre>
</template>
