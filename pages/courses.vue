<script setup lang="ts">
import { createSchema } from '@/zod/course'
import { z } from 'zod'

const { $trpc } = useNuxtApp()

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
})

const [
	{ data: courses, refresh },
	{ data: rooms },
	{ data: fields },
	{ data: semesters },
] = await Promise.all([
	useAsyncData(() => $trpc.course.list.query()),
	useAsyncData(() => $trpc.room.list.query()),
	useAsyncData(() => $trpc.field.list.query()),
	useAsyncData(() => $trpc.semester.list.query()),
])

const roomsOptions = rooms.value?.map((room) => ({
	label: room.number,
	value: room.id,
}))

const fieldsOptions = fields.value?.map((field) => ({
	label: field.name,
	value: field.id,
}))

const semestersOptions = semesters.value?.map((semester) => ({
	label: semester.name,
	value: { year: semester.year, season: semester.season },
}))

async function submit(values: z.infer<typeof createSchema>) {
	await $trpc.course.create.mutate(values)
	await refresh()
	reset()
}
</script>

<template>
	<ul class="mx-auto mt-5 flex h-full w-96 flex-col gap-3">
		<FancyTitle>Courses</FancyTitle>
		<ZodForm
			v-if="$can('create', 'Course')"
			@submit="submit"
		>
			<ZodKit
				name="roomId"
				type="select"
				:options="roomsOptions"
			/>

			<ZodKit
				name="fieldId"
				type="select"
				:options="fieldsOptions"
			/>

			<ZodKit
				name="semester"
				type="select"
				:options="semestersOptions"
			/>
		</ZodForm>
		<li
			class="flex flex-col gap-3"
			v-for="(course, key) in courses"
			:key="key"
		>
			<div class="card w-96 bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">
						{{ course.description ?? `${course.field.name}` }}
					</h2>
					<div class="card-actions justify-end">
						<button class="btn-primary btn">View</button>
					</div>
				</div>
			</div>
		</li>
	</ul>
</template>
