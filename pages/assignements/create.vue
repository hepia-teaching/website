<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/assignment'

const { $trpc, $dayjs } = useNuxtApp()
const router = useRouter()
const courses = await $trpc.course.list.query()

const coursesOptions = courses.map((course) => ({
	label: course.description || `${course.field.name}`,
	value: {
		roomId: course.roomId,
		fieldId: course.fieldId,
		semester: {
			year: course.year,
			season: course.season,
		},
	},
}))

let defaultCourse = coursesOptions[0]?.value

if (!defaultCourse) {
	throw new Error("There's no courses")
}

const selectedCourse = ref(defaultCourse)
const selectedStartDate = ref($dayjs.utc().startOf('day').format('YYYY-MM-DD'))
const selectedEndDate = ref(
	$dayjs.utc().startOf('day').add(7, 'day').format('YYYY-MM-DD')
)

watch(selectedCourse, () => refreshNuxtData('workload'))
watch(selectedStartDate, () => refreshNuxtData('workload'))
watch(selectedEndDate, () => refreshNuxtData('workload'))

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
	initialValues: {
		course: {
			roomId: defaultCourse.roomId,
			fieldId: defaultCourse.fieldId,
			semester: defaultCourse.semester,
		},
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
	await $trpc.assignment.create.mutate(values)
	reset()
	router.push(
		`/courses/${values.course.fieldId}-${values.course.roomId}-${values.course.semester.season}-${values.course.semester.year}`
	)
}

const { data, error } = await useAsyncData('workload', () =>
	$trpc.assignment.workloadAssignments.query({
		roomId: selectedCourse.value.roomId,
		fieldId: selectedCourse.value.fieldId,
		year: selectedCourse.value.semester.year,
		season: selectedCourse.value.semester.season,
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

watchEffect(() => console.log(error.value))
</script>

<template>
	<main class="flex flex-col gap-3">
		<div class="flex flex-col gap-3">
			<FancyTitle>Create a new Assignment</FancyTitle>
			<ZodForm @submit="submit">
				<ZodKit
					v-model="selectedCourse"
					label="Course"
					type="select"
					name="course"
					:options="coursesOptions"
					data-testid="course"
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
		<aside>
			<template v-if="data">
				<AssignmentLoadPreview
					:new-assignment="{
						startDate: selectedStartDate,
						endDate: selectedEndDate,
					}"
					:others="data"
				/>
			</template>
		</aside>
	</main>
</template>
