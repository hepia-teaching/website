<script setup lang="ts">
import { dataToEsm } from '@rollup/pluginutils';

const { $trpc } = useNuxtApp()
const toasts = useToastStore()

const { data: courses } = await useAsyncData('my-courses', () =>
	$trpc.course.myCourses.query()
)

courses.value = [];

</script>

<template>
	<div class="flex flex-col gap-3">
		<div class="divider">My Courses</div>
		<div
			v-if="courses && courses.length > 0"
			class="grid grid-cols-2"
		>
			<NuxtLink
				v-for="(course, key) in courses"
				:key="key"
				:to="`/courses/${course.fieldId}-${course.roomId}-${course.season}-${course.year}`"
				class="card bg-base-100 shadow-xl m-3"
			>
				<div class="card-body">
					<h2 class="card-title">{{ course.field.name }}</h2>
				</div>
			</NuxtLink>
		</div>
		<div
			v-else
			class="alert alert-info shadow-lg"
		>
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="h-6 w-6 flex-shrink-0 stroke-white"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<span class="text-slate-100">You don't have any courses</span>
			</div>
		</div>
	</div>
</template>
