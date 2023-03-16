<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/room'

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
})

const { $trpc } = useNuxtApp()
const toasts = useToastStore()

async function submit(values: z.infer<typeof createSchema>) {
	try {
		await $trpc.room.create.mutate(values)
		reset()
		toasts.success("Successfully added room.")
	}
	catch (e){
		toasts.error(e)
	}
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Create room</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit label="Name" type="text" name="number" />
		</ZodForm>
	</div>
</template>
