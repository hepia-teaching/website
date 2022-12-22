<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/room'

const { ZodForm, ZodKit } = useZodFormKit({
	schema: createSchema,
})

const { $trpc } = useNuxtApp()

const { data: rooms, refresh } = await useAsyncData('rooms', () =>
	$trpc.room.list.query()
)

async function submit(values: z.infer<typeof createSchema>) {
	await $trpc.room.create.mutate(values)
	await refresh()
}
</script>

<template>
	<div class="mx-auto mt-5 flex h-full w-96 flex-col gap-3">
		<FancyTitle>Rooms</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				type="text"
				name="number"
			/>
		</ZodForm>

		<ul>
			<li
				v-for="room in rooms"
				:key="room.id"
			>
				{{ room.number }}
			</li>
		</ul>
	</div>
</template>
