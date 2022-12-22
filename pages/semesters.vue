<script setup lang="ts">
import { z } from 'zod'
import { createSchema } from '@/zod/semester'
import { Season } from '@prisma/client'

const { ZodForm, ZodKit, reset } = useZodFormKit({
	schema: createSchema,
})

const { $trpc, $toast } = useNuxtApp()

const { data: semesters, refresh } = await useAsyncData('semesters', () =>
	$trpc.semester.list.query()
)

async function submit(values: z.infer<typeof createSchema>) {
	try {
		await $trpc.semester.create.mutate(values)
		await refresh()
		reset()
	} catch {
		$toast.add('oops')
	}
}
</script>

<template>
	<div class="mx-auto mt-5 flex h-full w-96 flex-col gap-3">
		<FancyTitle>Semesters</FancyTitle>
		<ZodForm @submit="submit">
			<ZodKit
				type="number"
				name="year"
				:plugins="[castNumber]"
			/>

			<ZodKit
				type="select"
				name="season"
				:options="Season"
			/>
		</ZodForm>
		<ul>
			<li
				v-for="semester in semesters"
				:key="`${semester.year}_${semester.season}`"
			>
				{{ semester.name }}
			</li>
		</ul>
	</div>
</template>
