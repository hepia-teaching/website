<script setup lang="ts">
import { z } from 'zod'
import { Role } from '@prisma/client'
import { createSchema } from '@/zod/teaching'
import mod from 'zod/lib';

const { ZodForm, ZodKit, reset } = useZodFormKit({
    schema: createSchema,
})

const { $trpc } = useNuxtApp()
const toasts = useToastStore()

const [{ data: teachers }] = await Promise.all([
    useAsyncData('teachers', () =>
        $trpc.user.list.query({
            role: Role.Teacher,
        })
    ),
])

const teachersOptions = teachers.value?.map((teacher) => ({
    label: teacher.email,
    value: teacher.id,
}))

async function submit(values: z.infer<typeof createSchema>) {
    try {
        await $trpc.teaching.delete.mutate(values)
        reset()
        toasts.success('Successfully deleted teaching')
        updateSecondOptions()
        state.selectedFirstOption.teacherId = model.teacherSelected
    } catch (e) {
        toasts.error(e)
    }
}

interface Test2 {
    teacherId: number
}

interface Test {
    selectedFirstOption: Test2
    secondOptions: any
}

let model = reactive({
    teacherSelected: teachersOptions ? teachersOptions[0].value : 0,
    courseSelected: {
        roomId: 0,
        fieldId: 0,
        year: 0,
        season: '',
    }
})

const test = teachersOptions ? teachersOptions[0].value : 0

const [{ data: coursesinit }] = await Promise.all([
    useAsyncData('courses', () =>
        $trpc.teaching.listMyCourses.query({ teacherId: test })),
])

model.courseSelected = coursesinit.value !== null ? coursesinit.value[0] : model.courseSelected

const state: Test = reactive({
    selectedFirstOption: { teacherId: model.teacherSelected },
    secondOptions: coursesinit?.value?.map((course) => ({
        label: course.course.description || course.course.field.name,
        value: {
            roomId: course.roomId,
            fieldId: course.fieldId,
            year: course.year,
            season: course.season,
        },
    })),
})

const updateSecondOptions = async () => {
    const [{ data: courses }] = await Promise.all([
        useAsyncData('courses', () =>
            $trpc.teaching.listMyCourses.query(state.selectedFirstOption)),
    ])
    state.secondOptions = courses?.value?.map((course) => ({
        label: course.course.description || course.course.field.name,
        value: {
            roomId: course.roomId,
            fieldId: course.fieldId,
            year: course.year,
            season: course.season,
        },
    }))
    model.courseSelected = state.secondOptions.length !== 0 ? state.secondOptions[0].value : undefined
}

const changeValueFirstOption = (value: any) => {
    state.selectedFirstOption.teacherId = value
    model.teacherSelected = value
}

const computedCoursesOptions = computed(() => {
    return state.secondOptions
})

</script>

<template>
    <div class="flex flex-col gap-3">
        <FancyTitle>Unassign course</FancyTitle>
        <ZodForm @submit="submit">
            <ZodKit v-model="model.teacherSelected" label="Teacher" type="select" name="teacherId"
                :options="teachersOptions" @change="changeValueFirstOption(model.teacherSelected), updateSecondOptions()" />
            <ZodKit v-model="model.courseSelected" label="Course" type="select" name="course"
                :options="computedCoursesOptions" />
        </ZodForm>
    </div>
</template>
