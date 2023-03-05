<script setup lang="ts">
import dayjs from 'dayjs'

const { $trpc } = useNuxtApp()
const { data } = await useAsyncData('my-assignments', () =>
	$trpc.assignment.myAssignments.query()
)
const total_hours = computed(() =>
	data.value?.reduce(
		(previous, current) => previous + current.estimated_time,
		0
	)
)

const isToday = true

</script>

<template>
	<div class="grid grid-cols-6">
		<div class="col-span-4">
			<FancyTitle class="p-10">To-Do List</FancyTitle>
			<div class="grid grid-cols-1 gap-3 max-h-screen mb-32" v-if="data && data.length > 0" data-testid="assignments">
				<NuxtLink v-for="(assignment, key) in data" :key="key" :to="`/courses/`" class="card bg-base-100 shadow-xl">
					<StudentAssignmentCard :assignment="assignment"></StudentAssignmentCard>
				</NuxtLink>
			</div>
			<div class="card sticky bottom-0 bg-primary">
				<div class="card-body" v-if="data && data.length > 0">
					<div class="grid grid-cols-2">
						<h2 class="card-title text-base-100 w-64 flex-1 text-2xl">Total ce mois :</h2>
						<div class="text-right text-base-100  font-bold">{{ total_hours }}h</div>
					</div>
				</div>
			</div>
		</div>
		<div class="divider divider-horizontal col-span-1 mx-auto"></div>
		<div class="col-span-1 mx-auto">
			<div class="sticky top-0">
				<div>ESPACE CALENDRIER</div>
				<a href="/">
					<button class="btn-primary btn-lg btn m-2">Modifier la charge</button>
				</a>
				<a href="/">
					<button class="btn-primary btn-lg btn m-2">S'abonner à un cours</button>
				</a>
			</div>
		</div>
	</div>
</template>
