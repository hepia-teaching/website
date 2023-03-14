<script setup lang="ts">
import { z } from 'zod'
import { updateSchema, getRouteParamsSchema } from '@/zod/course'
import dayjs from 'dayjs'
import { label } from '@formkit/inputs';
import test from 'node:test';
const { $trpc } = useNuxtApp()
const params = useParams(getRouteParamsSchema)
const course = await $trpc.course.get.query(params)
const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: updateSchema,
	initialValues: {
		roomId: course.roomId,
		fieldId: course.fieldId,
		semester: {
			year: course.year,
			season: course.season,
		},
		description: course.description,
	},
})

const [{ data: room }, {data: field}, {data: semester} ] = await Promise.all([
	useAsyncData('course', () => $trpc.room.list.query()),
	useAsyncData('field', () => $trpc.field.list.query()),
	useAsyncData('semester', () => $trpc.semester.list.query()),
])

const roomOptions = room.value?.map((room) => ({
	label: room.number,
	value: room.id,
}))
const fieldOptions = field.value?.map((field) => ({
	label: field.name,
	value: field.id,
}))
const semesterOptions = semester.value?.map((semester) => ({
	label: semester.name,
	value: semester,
}))

const router = useRouter()
async function submit({ ...values }: z.infer<typeof updateSchema>) {
	console.log(values)
	await $trpc.course.update.mutate({
		roomId: values.roomId,
		fieldId: values.fieldId,
		// year: values.semester.year,
		semester: values.semester,
		// season: values.semester.season,
		description: values.description,
	})
	reset()
	router.push(`/courses/${course.fieldId}-${course.roomId}-${course.season}-${course.year}`)
}

// const router = useRouter()
// async function submit({ ...values }: z.infer<typeof updateSchema>) {
// 	console.log(values)
// 	await $trpc.course.update.mutate({
// 		roomId: values.roomId,
// 		fieldId: values.fieldId,
// 		year: values.year,
// 		season: values.season,
// 		description: values.description,
// 	})
// 	reset()
// 	router.push(`/courses/`)
// }
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Edit a Course</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				label="Room ID"
				name="roomId"
				type="select"
				
				:options=roomOptions
			/>
			<ZodKit
				label="Field ID"
				name="fieldId"
				type="select"
				:options=fieldOptions
			/>
			<ZodKit
				label="Semester"
				name="semester"
				type="select"
				:options=semesterOptions
			/>
			<ZodKit
				label="Title of course"
				name="description"
				type="text"
			/>
		</ZodForm>
	</div>
</template>
<!-- <ZodKit
label="Year"
name="year"
type="number"
data-testid="year"
/>
<ZodKit
label="Season"
name="season"
type="select"
data-testid="season"
:options=semesterOptions
/> -->