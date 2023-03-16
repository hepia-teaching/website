<script setup lang="ts">
import { z } from 'zod'
import { Role } from '@prisma/client'
import { createSchema } from '@/zod/teaching'

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
})

const { $trpc } = useNuxtApp()
const toasts = useToastStore()


const [{ data: courses }, { data: teachers }] = await Promise.all([
	useAsyncData('courses', () => $trpc.course.list.query()),
	useAsyncData('teachers', () =>
		$trpc.user.list.query({
			role: Role.Teacher,
		})
	),
])

const coursesOptions = courses.value?.map((course) => ({
	label: course.description || `${course.field.name}`,
	value: {
		roomId: course.roomId,
		fieldId: course.fieldId,
		year: course.year,
		season: course.season,
	},
}))

const teachersOptions = teachers.value?.map((teacher) => ({
	label: teacher.email,
	value: teacher.id,
}))

async function submit(values: z.infer<typeof createSchema>) {
	try {
		await $trpc.teaching.create.mutate(values)
		reset()
		toasts.success("Successfully added teaching.")
	} catch (e){
		toasts.error(e)
	}
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Assign course</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				label="Teacher"
				type="select"
				name="teacherId"
				:options="teachersOptions"
			/>
			<ZodKit
				label="Course"
				type="select"
				name="course"
				:options="coursesOptions"
			/>
		</ZodForm>
	</div>
</template>
