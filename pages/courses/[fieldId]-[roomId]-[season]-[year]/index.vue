<script setup lang="ts">
import InformationCircleIcon from '@heroicons/vue/24/outline/InformationCircleIcon'
const { $trpc, $dayjs } = useNuxtApp()

const props = defineProps<{
	course: Awaited<ReturnType<typeof $trpc.course.get.query>>
}>()

const baseUrl = computed(
	() =>
		`/courses/${props.course.fieldId}-${props.course.roomId}-${props.course.season}-${props.course.year}`
)
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
						{{ $dayjs(assignement.endDate).format('DD-MM-YYYY') }}</span
					>
				</div>
				<div class="btn-group">
					<NuxtLink
						:to="`${baseUrl}/assignements/${assignement.id}/edit`"
						class="btn-outline btn btn-sm"
					>
						Edit
					</NuxtLink>

					<NuxtLink
						:to="`${baseUrl}/assignements/${assignement.id}/delete`"
						class="btn-outline btn btn-error btn-sm"
					>
						Delete
					</NuxtLink>
				</div>
			</li>
			<div
				v-if="props.course.assignements.length === 0"
				class="alert alert-info shadow-lg"
			>
				<div>
					<InformationCircleIcon class="h-6 w-6" />
					<span>There are no assignements</span>
				</div>
			</div>
		</ul>
		<aside>
			<NuxtLink
				:to="`${baseUrl}/assignements/create`"
				class="btn btn-primary"
			>
				Add assignement
			</NuxtLink>
		</aside>
	</div>
</template>
