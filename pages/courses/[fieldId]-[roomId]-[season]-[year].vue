<script setup lang="ts">
import { getRouteParamsSchema } from '@/zod/course'
import dayjs from 'dayjs'

const { $trpc } = useNuxtApp()
const params = useParams(getRouteParamsSchema)
const course = await $trpc.course.get.query(params)

console.log(course)
</script>

<template>
	<FancyTitle
		>{{ course.field.name }} {{ course.season }} {{ course.year }}</FancyTitle
	>
	<NuxtPage :course="course" />
</template>
