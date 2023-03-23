<script setup lang="ts">
import { z } from 'zod'
import { deleteSchema, getRouteParamsSchema } from '@/zod/assignment'

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
	},
})

const router = useRouter()

async function submit(values: z.infer<typeof deleteSchema>) {
	try {
		await $trpc.assignment.delete.mutate(values)
		reset()
		router.push(
			`/courses/${values.fieldId}-${values.roomId}-${values.season}-${values.year}`
		)
		toasts.success('Successfully deleted assignment')
		refreshNuxtData('course')
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
			<NuxtLink
				:to="`/courses/${assignement.fieldId}-${assignement.roomId}-${assignement.season}-${assignement.year}`"
				class="btn-outline btn-error btn-md btn mb-3 w-full"
			>
				Cancel
			</NuxtLink>
		</ZodForm>
	</div>
</template>
