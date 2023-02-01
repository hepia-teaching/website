<script setup lang="ts">
import { z } from 'zod'
import { deleteSchemaAssignement, getRouteParamsSchema } from '@/zod/assignment'

const { $trpc } = useNuxtApp()
const params = useParams(getRouteParamsSchema)
const assignement = await $trpc.assignements.get.query(params)

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: deleteSchemaAssignement,
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

async function submit(values: z.infer<typeof deleteSchemaAssignement>) {
	await $trpc.assignements.delete.mutate(values)
	reset()
	router.push(
		`/courses/${values.course.fieldId}-${values.course.roomId}-${values.course.semester.season}-${values.course.semester.year}`
	)
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Please confirm the deletion</FancyTitle>
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
				disabled="true"
				:options="coursesOptions"
				:selected="assignement.course"
			/>
			<ZodKit
				label="Start Date"
				name="startDate"
				type="date"
				disabled="true"
				:value="assignement.startDate"
			/>
			<ZodKit
				label="End Date"
				name="endDate"
				type="date"
				disabled="true"
				:value="assignement.endDate"
			/>
			<ZodKit
				label="Estimated Time"
				name="estimate_time"
				type="number"
				disabled="true"
				:value="assignement.estimated_time"
			/>

			<ZodKit
				label="Description"
				name="description"
				type="textarea"
				disabled="true"
				:value="assignement.description"
			/>
			<NuxtLink
				:to="`/courses/${assignement.fieldId}-${assignement.roomId}-${assignement.season}-${assignement.year}`"
				class="btn-outline btn-error btn-md btn"
			>
				Cancel
			</NuxtLink>
		</ZodForm>
	</div>
</template>
