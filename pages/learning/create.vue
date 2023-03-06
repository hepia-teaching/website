<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/learning'
import { Role } from '@prisma/client'

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
})

const { $trpc } = useNuxtApp()

async function submit(values: z.infer<typeof createSchema>) {
	try {
		const studentIds = values.studentId
		let data: any = []
		studentIds.forEach((studentId) => {
			data.push({
				roomId: values.course.roomId,
				fieldId: values.course.fieldId,
				year: values.course.year,
				season: values.course.season,
				studentId: studentId,
			})
		})
		await $trpc.learning.create.mutate(data)
		reset()
	} catch {
		alert('error')
	}
}

const [{ data: courses }, { data: students }] = await Promise.all([
	useAsyncData('courses', () => $trpc.course.list.query()),
	useAsyncData('students', () =>
		$trpc.user.list.query({
			role: Role.Student,
		})
	),
])

const coursesOptions = courses.value?.map((course) => ({
	label: course.field.name || `${course.description}`,
	value: {
		roomId: course.roomId,
		fieldId: course.fieldId,
		year: course.year,
		season: course.season,
	},
}))

const studentsOptions = students.value?.map((student) => ({
	label: student.email,
	value: student.id,
}))
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Assign Courses to Students</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				label="Course"
				type="select"
				name="course"
				:options="coursesOptions"
			/>
			<ZodKit
				label="Students"
				type="checkbox"
				name="studentId"
				validation="required|min:1"
				:options="studentsOptions"
			/>
		</ZodForm>
	</div>
</template>
