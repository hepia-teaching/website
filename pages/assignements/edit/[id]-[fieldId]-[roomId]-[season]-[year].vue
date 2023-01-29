<script setup lang="ts">
import { z } from 'zod'
import { updateSchema, getRouteParamsSchema } from '@/zod/assignment'

const { $trpc } = useNuxtApp()
const params = useParams(getRouteParamsSchema)
const assignement = await $trpc.assignment.get.query(params)

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: updateSchema,
})

const router = useRouter()

const [{ data: courses }] = await Promise.all([
	useAsyncData(() => $trpc.course.list.query()),
])

const coursesOptions = courses.value
	?.map((course) => ({
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
	.filter((course) => {
		return course.value.fieldId == assignement.course.fieldId
	})

async function submit(values: z.infer<typeof updateSchema>) {
	await $trpc.assignment.update.mutate(values)
	reset()
	router.push(
		`/courses/${values.course.fieldId}-${values.course.roomId}-${values.course.semester.season}-${values.course.semester.year}`
	)
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Edit an Assignement</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				label="ID"
				type="hidden"
				name="id"
				:value="assignement.id"
			/>
			<ZodKit
				label="Course"
				type="select"
				name="course"
				:options="coursesOptions"
				:selected="assignement.course"
				data-testid="course"
			/>
			<ZodKit
				label="Start Date"
				name="startDate"
				type="date"
				:value="new Date(assignement.startDate).toISOString().substring(0, 10)"
				data-testid="start-date"
			/>
			<ZodKit
				label="End Date"
				name="endDate"
				type="date"
				:value="
					new Date(assignement.endDate || 0).toISOString().substring(0, 10)
				"
				data-testid="end-date"
			/>
			<ZodKit
				label="Estimated Time"
				name="estimate_time"
				type="number"
				:value="assignement.estimated_time"
				data-testid="estimated-time"
			/>

			<ZodKit
				label="Description"
				name="description"
				type="textarea"
				:value="assignement.description"
				data-testid="description"
			/>
		</ZodForm>
	</div>
</template>
