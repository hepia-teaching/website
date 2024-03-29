<script setup lang="ts">
import { User } from '@prisma/client'
import { listSchema } from '@/zod/user'
import { subject } from '@casl/ability'

const { $trpc } = useNuxtApp()
const toasts = useToastStore()

const route = useRoute()
const where = listSchema.parse(route.query)

const { data: users, refresh } = await useAsyncData('users', () =>
	$trpc.user.list.query(where)
)

async function onClickDelete(user: User) {
	try {
		await $trpc.user.delete.mutate({
			email: user.email,
		})
		await refresh()
		toasts.success(`Successfully deleted user. (${user.email})`)
	} catch (e) {
		toasts.error(e)
	}
}
</script>

<template>
	<div class="overflow-x-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th></th>
					<th>Email</th>
					<th>Role</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="user in users"
					:key="user.id"
				>
					<th>{{ user.id }}</th>
					<th>{{ user.email }}</th>
					<th>{{ user.role }}</th>
					<th
						v-if="$can('delete', subject('User', user))"
						@click="() => onClickDelete(user)"
					>
						<button>delete</button>
					</th>
					<th>
						<NuxtLink
							:to="`/users/edit/${user.id}`"
							class="btn-outline btn btn-sm"
						>
							Edit
						</NuxtLink>
					</th>
				</tr>
			</tbody>
		</table>
	</div>
</template>
