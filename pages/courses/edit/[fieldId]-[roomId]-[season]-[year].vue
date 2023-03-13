<script setup lang="ts">
import { z } from 'zod'
import { updateSchema, getRouteParamsSchema } from '@/zod/course'
import dayjs from 'dayjs'
const { $trpc } = useNuxtApp()
const params = useParams(getRouteParamsSchema)
const course = await $trpc.course.get.query(params)
const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: updateSchema,
	initialValues: {
		roomId: course.roomId,
		fieldId: course.fieldId,
		year: course.year,
		season: course.season,
		description: course.description,
	},
})
const router = useRouter()
async function submit({
	...values
}: z.infer<typeof updateSchema>) {
	await $trpc.course.update.mutate({
		...values,
	})
	reset()
	router.push(
		`/courses/`
	)
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Edit a Course</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				label="Room ID"
				name="roomId"
				type="number"
				data-testid="roomId"
			/>
			<ZodKit
				label="Field ID"
				name="fieldId"
				type="number"
				data-testid="fieldID"
			/>
			<ZodKit
				label="Year"
				name="year"
				type="number"
				data-testid="year"
			/>
			<ZodKit
				label="Season"
				name="season"
			/>
			<ZodKit
				label="Title of course"
				name="description"
				type="text"
				data-testid="description"
			/>
		</ZodForm>
	</div>
</template>