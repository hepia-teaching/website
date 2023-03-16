<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/course'
import toast from '~~/plugins/toast'

const { $trpc } = useNuxtApp()
const toasts = useToastStore()

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
	try {
		await $trpc.course.create.mutate(values)
		reset()
		toasts.success('Successfully added course.')
	} catch (e) {
		toasts.error(e)
	}
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
				data-testid="room"
				:options="roomsOptions"
			/>

			<ZodKit
				label="Field"
				name="fieldId"
				type="select"
				data-testid="field"
				:options="fieldsOptions"
			/>

			<ZodKit
				label="Semester"
				name="semester"
				type="select"
				data-testid="semester"
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
