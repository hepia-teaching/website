<script setup lang="ts">
import dayjs from 'dayjs'
const { $trpc } = useNuxtApp()

type Assignment = Awaited<ReturnType<typeof $trpc.assignment.myAssignments.query>>[0]

const props = defineProps<{ assignment: Assignment }>()

const isToday = computed(() => dayjs().isSame(props.assignment.endDate, "day"));

</script>

<template>
    <div
        class="card lg:card-side bg-base-100 shadow-sm transition ease-in-out hover:scale-105 hover:shadow-xl duration-200">
        <span v-if="isToday" id="today"></span>
        <div class="m-5 rounded-full h-20 w-20 flex flex-col items-center justify-center"
            :class="{ 'bg-primary': isToday }">
            <h3 class="text-sm font-light" :class="{ 'bg-primary text-base-300': isToday }">{{
                dayjs(assignment.endDate).format('ddd') }}</h3>
            <h3 class="text-2xl font-bold" :class="{ 'bg-primary text-base-100': isToday }">{{
                dayjs(assignment.endDate).format('D') }}</h3>
        </div>
        <div class="card-body">
            <h2 class="card-title">{{ assignment.description }}</h2>

            <div>{{ assignment.course.field.name }}</div>
        </div>
        <div class="flex flex-col items-center justify-center m-10">
            <p class="font-medium">{{ assignment.estimated_time }}h</p>
        </div>
    </div>
</template>
