<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/assignment'

definePageMeta({
	layout: 'full',
})

const props = defineProps<{
	course: Awaited<ReturnType<typeof $trpc.course.get.query>>
}>()

const { $trpc, $dayjs } = useNuxtApp()
const router = useRouter()
const toasts = useToastStore()

const selectedEstimatedTime = ref(10)
const selectedStartDate = ref($dayjs.utc().startOf('day').format('YYYY-MM-DD'))
const selectedEndDate = ref(
	$dayjs.utc().startOf('day').add(7, 'day').format('YYYY-MM-DD')
)

watch(selectedStartDate, () => refreshNuxtData('workload'))
watch(selectedEndDate, () => refreshNuxtData('workload'))

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
	initialValues: {
		course: {
			roomId: props.course.roomId,
			fieldId: props.course.fieldId,
			semester: {
				year: props.course.year,
				season: props.course.season,
			},
		},
		estimate_time: selectedEstimatedTime.value,
		startDate: $dayjs
			.utc(selectedStartDate.value, 'YYYY-MM-DD')
			.startOf('day')
			.toDate(),
		endDate: $dayjs
			.utc(selectedEndDate.value, 'YYYY-MM-DD')
			.startOf('day')
			.toDate(),
	},
})

async function submit(values: z.infer<typeof createSchema>) {
	try {
		await $trpc.assignment.create.mutate(values)
		reset()
		router.push(
			`/courses/${values.course.fieldId}-${values.course.roomId}-${values.course.semester.season}-${values.course.semester.year}`
		)
		toasts.success('Successfully added assignment.')
		refreshNuxtData('course')
	} catch (e) {
		toasts.error(e)
	}
}

const { data } = await useAsyncData('workload', () =>
	$trpc.assignment.workloadAssignments.query({
		roomId: props.course.roomId,
		fieldId: props.course.fieldId,
		year: props.course.year,
		season: props.course.season,
		startDate: $dayjs
			.utc(selectedStartDate.value, 'YYYY-MM-DD')
			.startOf('day')
			.toISOString(),
		endDate: $dayjs
			.utc(selectedEndDate.value, 'YYYY-MM-DD')
			.startOf('day')
			.toISOString(),
	})
)
</script>

<template>
	<main class="md container mx-auto grid grid-cols-2 gap-3">
		<div class="col-span-2">
			<FancyTitle>Create a new Assignment</FancyTitle>
		</div>
		<div class="col-span-2 flex flex-col gap-3 lg:col-span-1">
			<ZodForm @submit="submit">
				<ZodKit
					name="course"
					type="hidden"
				/>
				<ZodKit
					v-model="selectedStartDate"
					:max="selectedEndDate"
					label="Start Date"
					name="startDate"
					type="date"
					data-testid="start-date"
				/>
				<ZodKit
					v-model="selectedEndDate"
					:min="selectedStartDate"
					label="End Date"
					name="endDate"
					type="date"
					data-testid="end-date"
				/>
				<ZodKit
					v-model="selectedEstimatedTime"
					:min="0"
					label="Estimated Time"
					name="estimate_time"
					type="number"
					data-testid="estimated-time"
				/>
				<ZodKit
					label="Title of assignment"
					name="description"
					type="text"
					data-testid="description"
				/>
			</ZodForm>
		</div>
		<aside
			class="col-span-2 flex flex-col items-center justify-center lg:col-span-1"
		>
			<template v-if="data">
				<ClientOnly>
					<template #fallback>
						<p>Loading chart...</p>
					</template>

					<AssignmentLoadPreview
						:new-assignment="{
							startDate: selectedStartDate,
							endDate: selectedEndDate,
							estimated_time: selectedEstimatedTime,
						}"
						:others="data"
					/>
				</ClientOnly>
			</template>
		</aside>
	</main>
</template>
