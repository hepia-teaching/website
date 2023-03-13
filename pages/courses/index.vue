<script setup lang="ts">
import { Course } from '@prisma/client'
import { subject } from '@casl/ability'

const { $trpc } = useNuxtApp()

const { data: courses } = await useAsyncData('courses', () =>
	$trpc.course.list.query()
)

async function onClickDelete(course: Course) {
	// await $trpc.field.delete.mutate({
	// 	id: field.id,
	// })
	// await refresh()
}
async function onClickEdit(course: Course) {
	// await $trpc.field.delete.mutate({
	// 	id: field.id,
	// })
	// await refresh()
}
async function onClickRedirect(course: Course) {}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Courses</FancyTitle>
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th>Field</th>
						<th>Semester</th>
						<th>Room</th>
						<th></th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(course, key) in courses"
						:key="key"
					>
						<th>{{ course.field.name }}</th>
						<th>{{ course.season }} {{ course.year }}</th>
						<th>{{ course.room.number }}</th>
						<th>
							<NuxtLink
								:to="`/courses/delete/${course.fieldId}-${course.roomId}-${course.season}-${course.year}`"
								class="btn-outline btn btn-sm"
								>
								Delete
							</NuxtLink>
						</th>
						<th>
							<NuxtLink
								:to="`/courses/edit/${course.fieldId}-${course.roomId}-${course.season}-${course.year}`"
								class="btn-outline btn btn-sm"
								>
								Edit
							</NuxtLink>
						</th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
