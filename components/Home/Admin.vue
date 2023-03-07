<script setup lang="ts">
import { Role } from '@prisma/client'

const actions = [
	{ to: '/courses/create', text: 'Add a course' },
	{ to: `/users/create?role=${Role.Teacher}`, text: 'Add a teacher' },
	{ to: `/users/create?role=${Role.Student}`, text: 'Add a student' },
	{ to: '/teaching/create', text: 'Assign a course' },
	{ to: `/users/create?role=${Role.Student}`, text: 'Add a semester' },
	{ to: `/fields/create`, text: 'Add a field' },
	{ to: `/rooms/create`, text: 'Add a room' },
	{ to: `/learning/create`, text: 'Assign students' },
]

const listings = [
	{ to: `/users?role=${Role.Teacher}`, text: 'Teachers' },
	{ to: `/users?role=${Role.Student}`, text: 'Students' },
	{ to: `/rooms`, text: 'Rooms' },
	{ to: '/courses', text: 'Courses' },
	{ to: `/users?role=${Role.Student}`, text: 'Semesters' },
	{ to: '/fields', text: 'Fields' },
]
</script>

<template>
	<div class="mx-auto flex h-full flex-col gap-3">
		<div class="divider">Actions</div>
		<div class="grid grid-cols-2 gap-3">
			<NuxtLink
				v-for="{ to, text } in actions"
				:key="to"
				:to="to"
				class="card bg-base-100 shadow-xl"
			>
				<div class="card-body">
					<h2
						class="card-title"
						data-testid="text"
					>
						{{ text }}
					</h2>
				</div>
			</NuxtLink>
		</div>
		<div class="divider">Listing</div>
		<div class="grid grid-cols-2 gap-3">
			<NuxtLink
				v-for="{ to, text } in listings"
				:key="to"
				:to="to"
				class="card bg-base-100 shadow-xl"
			>
				<div class="card-body">
					<h2 class="card-title">{{ text }}</h2>
				</div>
			</NuxtLink>
		</div>
	</div>
</template>
