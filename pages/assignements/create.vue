<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/assignment'
import { Season } from '@prisma/client'

const { $trpc } = useNuxtApp()

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
})

const router = useRouter()

const [{ data: courses }] = await Promise.all([
	useAsyncData(() => $trpc.course.list.query()),
])

const coursesOptions = courses.value?.map((course) => ({
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

async function submit(values: z.infer<typeof createSchema>) {
	await $trpc.assignements.create.mutate(values)
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
			/>
			<ZodKit
				label="Start Date"
				name="startDate"
				type="date"
			/>
			<ZodKit
				label="End Date"
				name="endDate"
				type="date"
			/>
			<ZodKit
				label="Estimated Time"
				name="estimate_time"
				type="number"
			/>

			<ZodKit
				label="Description"
				name="description"
				type="textarea"
			/>
		</ZodForm>
	</div>
</template>
