<script setup lang="ts">
import { propsToAttrMap } from '@vue/shared';
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';
const { $trpc } = useNuxtApp()
dayjs.extend(isBetween)

type Assignment = Awaited<
	ReturnType<typeof $trpc.assignment.myAssignments.query>
>[0]

const props = defineProps<{ newAssignment: Assignment, others: Assignment[] }>()
let startDate = dayjs(props.newAssignment.startDate)
let endDate = dayjs(props.newAssignment.endDate)
let nbDays = endDate.diff(startDate, "day")

let workloadPerDay = Array.from({ length: nbDays }).map((_, key) => {
	return props.others.reduce((acc, assignment) => {
		if (startDate.add(key, "day").isBetween(assignment.startDate, assignment.endDate)) {
			let assignmentNbDays = dayjs(assignment.endDate).diff(assignment.startDate, "day")
			let assignmentWorkloadPerDay = assignment.estimated_time / assignmentNbDays

			acc += assignmentWorkloadPerDay
		}

		return acc
	}, 0)
});

</script>

<template>
	<div class="flex gap-3 items-stretch justify-between w-full">
		<span v-for="(hours, key) in workloadPerDay">
			<div class="text-center p-3 gap-2 grid flex-grow card bg-base-300 rounded-box place-items-center">
				<h1 class="text-3xl font-bold">{{ hours.toFixed(2) }}h</h1>
				<p class="font-light text-gray-400">{{ startDate.add(key+1, "day").format("dddd, DD MMMM YYYY") }}</p>
			</div>
			<div class="divider divider-horizontal"></div>
		</span>
	</div>
</template>