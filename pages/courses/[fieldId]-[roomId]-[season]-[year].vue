<script setup lang="ts">
import { getRouteParamsSchema } from '@/zod/course'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const { $trpc } = useNuxtApp()
const params = useParams(getRouteParamsSchema)

const { data: course } = await useAsyncData('course', () =>
	$trpc.course.get.query(params)
)

if (!course.value) {
	setResponseStatus(404)
}
</script>

<template>
	<div
		v-if="course"
		class="flex flex-col gap-3"
	>
		<FancyTitle
			>{{ course.field.name }} {{ course.season }} {{ course.year }}</FancyTitle
		>
		<NuxtPage :course="course" />
	</div>
	<div
		v-else
		class="alert alert-error shadow-lg"
	>
		<div>
			<ExclamationTriangleIcon class="h-6 w-6" />
			<span>Course not found</span>
		</div>
	</div>
</template>
