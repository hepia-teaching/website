<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/assignment'
import dayjs from 'dayjs'
const { $trpc } = useNuxtApp()

const router = useRouter()
const courses = await $trpc.course.list.query()

const coursesOptions = courses.map((course) => ({
	label: course.description || `${course.field.name}`,
	value: {
		roomId: course.roomId,
		fieldId: course.fieldId,
		semester: {
			year: course.year,
			season: course.season,
		},
	},
}))

let defaultCourse = coursesOptions[0].value

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
	initialValues: {
		course: {
			roomId: defaultCourse.roomId,
			fieldId: defaultCourse.fieldId,
			semester: defaultCourse.semester,
		},
		startDate: dayjs().toDate(),
		endDate: dayjs().add(7, 'day').toDate(),
	},
})

//let classAssignments = await $trpc.assignment.workloadAssignments.query(defaultCourse.roomId, defaultCourse.fieldId, defaultCourse.semester.year, defaultCourse. )

async function submit(values: z.infer<typeof createSchema>) {
	await $trpc.assignment.create.mutate(values)
	reset()
	router.push(
		`/courses/${values.course.fieldId}-${values.course.roomId}-${values.course.semester.season}-${values.course.semester.year}`
	)
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Create a new Assignment</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				label="Course"
				type="select"
				name="course"
				:options="coursesOptions"
				data-testid="course"
			/>
			<ZodKit
				label="Start Date"
				name="startDate"
				type="date"
				data-testid="start-date"
			/>
			<ZodKit
				label="End Date"
				name="endDate"
				type="date"
				data-testid="end-date"
			/>
			<ZodKit
				label="Estimated Time"
				name="estimate_time"
				type="number"
				data-testid="estimated-time"
			/>
			<ZodKit
				label="Title of assignment"
				name="description"
				type="text"
				data-testid="description"
			/>
		</ZodForm>
	</div>
</template>
