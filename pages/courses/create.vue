<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/course'

const { $trpc } = useNuxtApp()

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
})

const [{ data: rooms }, { data: fields }, { data: semesters }] =
	await Promise.all([
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
	reset()
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Create a course</FancyTitle>
		<ZodForm
			v-if="$can('create', 'Course')"
			@submit="submit"
		>
			<ZodKit
				label="Room"
				name="roomId"
				type="select"
				:options="roomsOptions"
			/>

			<ZodKit
				label="Field"
				name="fieldId"
				type="select"
				:options="fieldsOptions"
			/>

			<ZodKit
				label="Semester"
				name="semester"
				type="select"
				:options="semestersOptions"
			/>

            <ZodKit
				label="Description"
				name="description"
				type="textarea"
			/>
		</ZodForm>
	</div>
</template>
