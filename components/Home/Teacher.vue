<script setup lang="ts">
const { $trpc } = useNuxtApp()

const { data: courses } = await useAsyncData('my-courses', () =>
	$trpc.course.myCourses.query()
)
</script>

<template>
	<div class="mx-auto mt-5 flex h-full w-96 flex-col gap-3">
		<FancyTitle>Actions</FancyTitle>
		<div
			v-if="courses && courses.length > 0"
			class="grid grid-cols-2"
		>
			<div
				v-for="(course, key) in courses"
				:key="key"
			>
				{{ JSON.stringify(course, null, 2) }}
			</div>
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
					class="h-6 w-6 flex-shrink-0 stroke-current"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<span>You don't have any courses</span>
			</div>
		</div>
	</div>
</template>
