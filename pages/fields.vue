<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/field'

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
})

const { $trpc } = useNuxtApp()

const { data: fields, refresh } = await useAsyncData('fields', () =>
	$trpc.field.list.query()
)

async function submit(values: z.infer<typeof createSchema>) {
	await $trpc.field.create.mutate(values)
	await refresh()
	reset()
}
</script>

<template>
	<div class="mx-auto mt-5 flex h-full w-96 flex-col gap-3">
		<FancyTitle>Fields</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				type="text"
				name="name"
			/>
		</ZodForm>

		<ul>
			<li
				v-for="(field, key) in fields"
				:key="key"
			>
				{{ field.name }}
			</li>
		</ul>
	</div>
</template>
