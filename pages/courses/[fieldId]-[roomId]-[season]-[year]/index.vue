<script setup lang="ts">
import { getRouteParamsSchema } from '@/zod/course'
import dayjs from 'dayjs'

const { $trpc } = useNuxtApp()

const props = defineProps<{
	course: Awaited<ReturnType<typeof $trpc.course.get.query>>
}>()
</script>

<template>
	<div class="flex gap-3">
		<ul class="flex flex-grow flex-col gap-1">
			<li
				v-for="assignement in props.course.assignements"
				:key="assignement.id"
				class="flex items-center rounded border border-base-content bg-base-100 p-5"
			>
				<div class="flex flex-grow flex-col gap-1">
					<span class="text-xl font-bold">{{ assignement.description }}</span>
					<span
						>Due date:
						{{ dayjs(assignement.endDate).format('DD-MM-YYYY') }}</span
					>
				</div>
				<div class="btn-group">
					<NuxtLink
						:to="`/assignements/edit/${assignement.id}-${assignement.fieldId}-${assignement.roomId}-${assignement.season}-${assignement.year}`"
						class="btn-outline btn btn-sm"
					>
						Edit
					</NuxtLink>
					<button class="btn-outline btn btn-error btn-sm">Delete</button>
				</div>
			</li>
		</ul>
		<aside>
			<NuxtLink
				to="/assignements/create"
				class="btn btn-primary"
			>
				Add assignement
			</NuxtLink>
		</aside>
	</div>
</template>
