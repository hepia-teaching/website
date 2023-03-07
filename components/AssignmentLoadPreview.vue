<script setup lang="ts">
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
	Colors,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Colors
)

const { $trpc, $dayjs } = useNuxtApp()

type Assignment = Awaited<
	ReturnType<typeof $trpc.assignment.myAssignments.query>
>[0]

const props = defineProps<{
	newAssignment: Pick<Assignment, 'startDate' | 'endDate' | 'estimated_time'>
	others: Assignment[]
}>()

const primaryColor = useCssVar('--p', document.body)
const secondaryColor = useCssVar('--s', document.body)

const startDate = computed(() => $dayjs(props.newAssignment.startDate))
const endDate = computed(() => $dayjs(props.newAssignment.endDate))
const nbDays = computed(() => endDate.value.diff(startDate.value, 'day'))

const workloads = computed(() =>
	Array.from({ length: nbDays.value }).map((_, key) => {
		const otherWorkLoads = props.others.reduce((acc, assignment) => {
			if (
				startDate.value
					.add(key, 'day')
					.isBetween(assignment.startDate, assignment.endDate)
			) {
				const assignmentNbDays = $dayjs(assignment.endDate).diff(
					assignment.startDate,
					'day'
				)
				const assignmentWorkloadPerDay =
					assignment.estimated_time / assignmentNbDays

				acc += assignmentWorkloadPerDay
			}

			return acc
		}, 0)

		const dailyNewWorkload = props.newAssignment.estimated_time / nbDays.value

		return {
			label: startDate.value.add(key + 1, 'day').format('DD MMMM YYYY'),
			otherWorkLoads,
			dailyNewWorkload,
		}
	})
)

const data = computed(() => ({
	labels: workloads.value.map((day) => day.label),
	datasets: [
		{
			label: 'Existing workloads',
			data: workloads.value.map((day) => day.otherWorkLoads),
			backgroundColor: `hsl(${primaryColor.value} / 0.3)`,
			borderColor: `hsl(${primaryColor.value} / 1)`,
			borderWidth: 1,
			stack: 'Stack 0',
		},
		{
			label: "New assignment's workload",
			data: workloads.value.map((day) => day.dailyNewWorkload),
			backgroundColor: `hsl(${secondaryColor.value} / 0.3)`,
			borderColor: `hsl(${secondaryColor.value} / 1)`,
			stack: 'Stack 0',
			borderWidth: 1,
		},
	],
}))

const options = {
	responsive: true,
}
</script>

<template>
	<Bar
		:data="data"
		:options="options"
	/>
</template>
