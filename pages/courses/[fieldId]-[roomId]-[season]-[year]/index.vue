<script setup lang="ts">
import { z } from 'zod'
import { Assignements } from '@prisma/client';
import { deleteSchemaAssignement } from '@/zod/assignment'
import dayjs from 'dayjs'
import { subject } from '@casl/ability'

const { $trpc } = useNuxtApp()

const router = useRouter();

const { ZodForm, ZodKit,reset } = useZodFormKit({
	schema: deleteSchemaAssignement,
})


const props = defineProps<{
	course: Awaited<ReturnType<typeof $trpc.course.get.query>>
}>()

function onClickDeleteAssignement(idAssignement: number) {
	props.course.assignements.forEach((assignement, id) => {
		if (assignement.id == idAssignement) {
			console.log("We have to remove this assignement:");
			console.log(assignement);
			props.course.assignements.splice(id, 1);
		}
	});
}
</script>

<template>
	<div class="flex gap-3">
		<ul class="flex flex-grow flex-col gap-1">
			<li v-for="assignement in props.course.assignements" :key="assignement.id"
				class="flex items-center rounded border border-base-content bg-base-100 p-5">
				<div class="flex flex-grow flex-col gap-1">
					<span class="text-xl font-bold">{{ assignement.description }}</span>
					<span>Due date:
						{{ dayjs(assignement.endDate).format('DD-MM-YYYY') }}</span>
				</div>
				<div class="btn-group">
					<NuxtLink
						:to="`/assignements/edit/${assignement.id}-${assignement.fieldId}-${assignement.roomId}-${assignement.season}-${assignement.year}`"
						class="btn-outline btn btn-sm"
					>
						Edit
					</NuxtLink>
					<!-- 
						v-if="$can('delete', subject('Assignements', assignement))"
						<button
						@click="onClickDeleteAssignement(assignement.id)"
						class="btn-outline btn btn-error btn-sm">Delete</button> -->
					<NuxtLink 
						:to="`/assignements/delete/${assignement.id}-${assignement.fieldId}-${assignement.roomId}-${assignement.season}-${assignement.year}`"
						class="btn-outline btn btn-error btn-sm">
						Delete
					</NuxtLink>
				</div>
			</li>
		</ul>
		<aside>
			<NuxtLink
				to="/assignements/create"
				class="btn btn-primary"
			>
				Add assignement
			</NuxtLink>
		</aside>
	</div>
</template>
