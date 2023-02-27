<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/room'
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
const {data: users} = await useAsyncData('get_all_students', () =>
	$trpc.user.list.query({role:Role.Student})
	
)

</script>

<template>
	<div class="flex flex-col gap-3">
		<!-- <FancyTitle>Assign Courses to Students</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				label="Name"
				type="text"
				name="number"
			/>
		</ZodForm> -->
		<div v-for="(course, key) in courses" :key="key">{{ course.field.name }}</div>
		<div v-for="(user, key) in users" :key="key">{{ user.email }}</div>
	</div>
</template>
