<script setup lang="ts">
import { propsToAttrMap } from '@vue/shared'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
const { $trpc } = useNuxtApp()
dayjs.extend(isBetween)

type Assignment = Awaited<
	ReturnType<typeof $trpc.assignment.myAssignments.query>
>[0]

const props = defineProps<{
	newAssignment: Pick<Assignment, 'startDate' | 'endDate'>
	others: Assignment[]
}>()

const startDate = computed(() => dayjs(props.newAssignment.startDate))
const endDate = computed(() => dayjs(props.newAssignment.endDate))
const nbDays = computed(() => endDate.value.diff(startDate.value, 'day'))
const workloadPerDay = computed(() =>
	Array.from({ length: nbDays.value }).map((_, key) => {
		return props.others.reduce((acc, assignment) => {
			if (
				startDate.value
					.add(key, 'day')
					.isBetween(assignment.startDate, assignment.endDate)
			) {
				const assignmentNbDays = dayjs(assignment.endDate).diff(
					assignment.startDate,
					'day'
				)
				const assignmentWorkloadPerDay =
					assignment.estimated_time / assignmentNbDays

				acc += assignmentWorkloadPerDay
			}

			return acc
		}, 0)
	})
)
</script>

<template>
	<div class="flex w-full items-stretch justify-between gap-3">
		<span v-for="(hours, key) in workloadPerDay">
			<div
				class="card rounded-box grid flex-grow place-items-center gap-2 bg-base-300 p-3 text-center"
			>
				<h1 class="text-3xl font-bold">{{ hours.toFixed(2) }}h</h1>
				<p class="font-light text-gray-400">
					{{ startDate.add(key + 1, 'day').format('dddd, DD MMMM YYYY') }}
				</p>
			</div>
			<div class="divider divider-horizontal"></div>
		</span>
	</div>
</template>
