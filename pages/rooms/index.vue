<script setup lang="ts">
import { Room } from '@prisma/client'
import { subject } from '@casl/ability'

const { $trpc } = useNuxtApp()

const { data: rooms, refresh } = await useAsyncData('rooms', () =>
	$trpc.room.list.query()
)

async function onClickDelete(room: Room) {
	await $trpc.room.delete.mutate({
		id: room.id,
	})
	await refresh()
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Rooms</FancyTitle>
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th></th>
						<th>Name</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="room in rooms"
						:key="room.id"
					>
						<th>{{ room.id }}</th>
						<th>{{ room.number }}</th>
						<th
							v-if="$can('delete', subject('Room', room))"
							@click="() => onClickDelete(room)"
						>
							<button>delete</button>
						</th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
