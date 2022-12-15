<script setup lang="ts">
import { Role, User } from "@prisma/client";
import { createSchema } from "@/zod/user";

const { $trpc } = useNuxtApp();

const { values, errors, handleSubmit } = useForm({
  schema: createSchema,
  initialValues: {
    email: "",
    role: Role.Student,
  },
});

const users = ref<User[]>([]);

onMounted(async () => {
  users.value = await $trpc.user.list.query();
});

const submit = handleSubmit(async (values) => {
  const user = await $trpc.user.create.mutate(values);
  users.value.push(user);
});
</script>

<template>
  <div class="mx-auto w-96 flex flex-col gap-3 h-full mt-5">
    <form
      class="p-3 bg-base-200 rounded-lg shadow-lg flex flex-col gap-3"
      @submit.prevent="submit"
    >
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          class="input input-bordered w-full"
          :class="{ 'input-error': errors.email }"
          type="text"
          v-model="values.email"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Role</span>
        </label>
        <select v-model="values.role" class="select select-bordered w-full">
          <option :value="role" v-for="role in Role">{{ role }}</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary btn-outline">submit</button>
    </form>
    <ul class="text-base-content mt-5">
      <li v-for="user in users">
        <span class="badge badge-outline">{{ user.role }}</span>
        {{ user.email }}
      </li>
    </ul>
  </div>
</template>
