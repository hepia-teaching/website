<script setup lang="ts">
import { z } from 'zod'
import { updateSchema, getRouteParamsSchema } from '@/zod/assignment'
import dayjs from 'dayjs'

const { $trpc } = useNuxtApp()
const params = useParams(getRouteParamsSchema)
const assignement = await $trpc.assignment.get.query(params)

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: updateSchema,
	initialValues: {
		id: assignement.id,
		fieldId: assignement.fieldId,
		roomId: assignement.roomId,
		year: assignement.year,
		season: assignement.season,
		description: assignement.description,
		estimated_time: assignement.estimated_time,
		startDate: dayjs(assignement.startDate).format('YYYY-MM-DD'),
		endDate: assignement.endDate
			? dayjs(assignement.endDate).format('YYYY-MM-DD')
			: undefined,
	},
})

const router = useRouter()

async function submit({
	startDate,
	endDate,
	...values
}: z.infer<typeof updateSchema>) {
	await $trpc.assignment.update.mutate({
		...values,
		startDate: dayjs(startDate).toISOString(),
		endDate: endDate ? dayjs(endDate).toISOString() : undefined,
	})

	reset()
	router.push(
		`/courses/${assignement.fieldId}-${assignement.roomId}-${assignement.season}-${assignement.year}`
	)
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Edit an Assignement</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				type="hidden"
				name="id"
			/>
			<ZodKit
				type="hidden"
				name="roomId"
			/>
			<ZodKit
				type="hidden"
				name="fieldId"
			/>
			<ZodKit
				type="hidden"
				name="year"
			/>
			<ZodKit
				type="hidden"
				name="season"
			/>
			<ZodKit
				label="Start Date"
				name="startDate"
				type="date"
				data-testid="start-date"
			/>
			<ZodKit
				label="End Date"
				name="endDate"
				type="date"
				data-testid="end-date"
			/>
			<ZodKit
				label="Estimated Time"
				name="estimated_time"
				type="number"
				data-testid="estimated-time"
			/>

			<ZodKit
				label="Description"
				name="description"
				type="textarea"
				data-testid="description"
			/>
		</ZodForm>
	</div>
</template>
