<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/field'

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
})

const { $trpc } = useNuxtApp()

async function submit(values: z.infer<typeof createSchema>) {
	await $trpc.field.create.mutate(values)
	reset()
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Create field</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				label="Name"
				type="text"
				name="name"
			/>
		</ZodForm>
	</div>
</template>
