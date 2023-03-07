<script setup lang="ts">
import { Semester } from '@prisma/client'
import { subject } from '@casl/ability'

const { $trpc } = useNuxtApp()

const { data: semesters, refresh } = await useAsyncData('semesters', () =>
	$trpc.semester.list.query()
)

async function onClickDelete(semester: Semester) {
	await $trpc.semester.delete.mutate({
		year: semester.year,
		season: semester.season
	})
	await refresh()
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Semesters</FancyTitle>
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th>Year</th>
						<th>Name</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="semester in semesters" :key="semester.name"
					>
						<th>{{ semester.year }}</th>
						<th>{{ semester.season }}</th>
						<th
							v-if="$can('delete', subject('Semester', semester))"
							@click="() => onClickDelete(semester)"
						>
							<button>delete</button>
						</th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
