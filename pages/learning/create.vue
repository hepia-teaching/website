<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/learning'
import { Role } from '@prisma/client';

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
})


const { $trpc } = useNuxtApp()

// async function submit(values: z.infer<typeof createSchema>) {
// 	await $trpc.course.list.query
// 	reset()
// }

const {data: courses} = await useAsyncData('get_all_courses', () =>
	$trpc.course.list.query()
	
)
const {data: students} = await useAsyncData('get_all_students', () =>
	$trpc.user.list.query({role:Role.Student})
	
)

async function submit(values: z.infer<typeof createSchema>) {
	try {
		await $trpc.learning.create.mutate(values)
		reset()
	} catch {
		alert('error')
	}
}

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
	<FancyTitle>Assign Courses to Students</FancyTitle>
	<ZodForm>
		<ZodKit
				label="Course"
				type="select"
				name="course"
				:options="coursesOptions"
			/>
		<ZodKit
				v-model="value"
				label="Students"
				type="checkbox"
				name="course"
				:options="studentsOptions"
			/>
		</ZodForm>
		
		<!-- <div v-for="(course, key) in courses" :key="key">{{ course.field.name }}</div> -->
		<!-- <div v-for="(user, key) in students" :key="key"> <input type="checkbox" id={{user.id.toString}}> {{ user.email }}</div> -->



</template>
