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
</script>

<template>
	<div class="grid grid-cols-6">
		<div class="col-span-4">
			<FancyTitle>Liste des rendus et échéances</FancyTitle>
			<div class="divider" />
			<div
				class="grid grid-cols-1 gap-3"
				v-if="data && data.length > 0"
				data-testid="assignments"
			>
				<NuxtLink
					v-for="(assignment, key) in data"
					:key="key"
					:to="`/courses/`"
					class="card bg-base-100 shadow-xl"
				>
					<div class="card-body">
						<h2 class="card-title w-64 text-2xl">
							{{ assignment.description }}
						</h2>
						<div class="grid grid-cols-2">
							<div>{{ assignment.course.description }}</div>
							<div class="text-right">{{ assignment.estimated_time }}h</div>
						</div>
						<div>
							Échéance: {{ dayjs(assignment.endDate).format('DD-MM-YYYY') }}
						</div>
					</div>
				</NuxtLink>
			</div>
			<div class="card sticky bottom-0 bg-orange-400">
				<div
					class="card-body"
					v-if="data && data.length > 0"
				>
					<div class="grid grid-cols-2">
						<h2 class="card-title w-64 flex-1 text-2xl">Total ce mois :</h2>
						<div class="text-right">{{ total_hours }}h</div>
					</div>
				</div>
			</div>
		</div>
		<div class="divider divider-horizontal col-span-1 mx-auto"></div>
		<div class="col-span-1 mx-auto">
			<div>ESPACE CALENDRIER</div>
			<a href="/">
				<button class="btn-primary btn-lg btn">Modifier la charge</button>
			</a>
			<a href="/">
				<button class="btn-primary btn-lg btn">S'abonner à un cours</button>
			</a>
		</div>
	</div>
</template>
