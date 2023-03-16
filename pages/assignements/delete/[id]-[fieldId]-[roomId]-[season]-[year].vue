<script setup lang="ts">
import { z } from 'zod'
import { deleteSchema, getRouteParamsSchema } from '@/zod/assignment'
import dayjs from 'dayjs'
import toast from '~~/plugins/toast'

const { $trpc } = useNuxtApp()
const toasts = useToastStore()
const params = useParams(getRouteParamsSchema)
const assignement = await $trpc.assignment.get.query(params)

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: deleteSchema,
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
}: z.infer<typeof deleteSchema>) {
	try {
		await $trpc.assignment.delete.mutate({
			...values,
			startDate: dayjs(startDate).toISOString(),
			endDate: endDate ? dayjs(endDate).toISOString() : undefined,
		})
		reset()
		router.push(
			`/courses/${values.fieldId}-${values.roomId}-${values.season}-${values.year}`
		)
		toasts.success('Successfully deleted assignment')
	} catch (e) {
		toasts.error(e)
	}
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Please confirm the deletion</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				label="ID"
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
				disabled="true"
			/>
			<ZodKit
				label="End Date"
				name="endDate"
				type="date"
				disabled="true"
			/>
			<ZodKit
				label="Estimated Time"
				name="estimated_time"
				type="number"
				disabled="true"
			/>
			<ZodKit
				label="Description"
				name="description"
				type="textarea"
				disabled="true"
			/>
			<NuxtLink
				:to="`/courses/${assignement.fieldId}-${assignement.roomId}-${assignement.season}-${assignement.year}`"
				class="btn-outline btn-error btn-md btn mb-3 w-full"
			>
				Cancel
			</NuxtLink>
		</ZodForm>
	</div>
</template>
