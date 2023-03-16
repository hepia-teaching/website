<script setup lang="ts">
import { Field } from '@prisma/client'
import { subject } from '@casl/ability'

const { $trpc } = useNuxtApp()
const toasts = useToastStore()

const { data: fields, refresh } = await useAsyncData('fields', () =>
	$trpc.field.list.query()
)

async function onClickDelete(field: Field) {
	try {
		await $trpc.field.delete.mutate({
			id: field.id,
		})
		await refresh()
		toasts.success('Successfully deleted field.')
	} catch (e) {
		toasts.error(e)
	}
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<FancyTitle>Fields</FancyTitle>
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
						v-for="field in fields"
						:key="field.id"
					>
						<th>{{ field.id }}</th>
						<th>{{ field.name }}</th>
						<th
							v-if="$can('delete', subject('Field', field))"
							@click="() => onClickDelete(field)"
						>
							<button>delete</button>
						</th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
