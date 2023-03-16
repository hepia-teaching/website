<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/semester'
import { Season } from '@prisma/client'


const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
})

const { $trpc } = useNuxtApp()
const toasts = useToastStore()

async function submit(values: z.infer<typeof createSchema>) {
	try {
		await $trpc.semester.create.mutate(values)
		reset()
		toasts.success("Successfully created semester.")
	}
	catch(e){
		toasts.error(e)
	}
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Create semester</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit label="Year" type="number" name="year" />
			<ZodKit label="Season" type="select" name="season" :options="Season" />
		</ZodForm>
	</div>
</template>
