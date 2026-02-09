<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"

const emit = defineEmits<{
   submit: [data: InferSchema<typeof $authSchema, "login">]
}>()

const schema = $authSchema().login
const state = reactive<Partial<InferFlatSchema<typeof schema>>>({
   email: undefined,
   password: undefined,
})

function onSubmit(e: FormSubmitEvent<InferFlatSchema<typeof schema>>) {
   emit("submit", e.data)
}
</script>

<template>
   <UForm
      :schema="schema"
      :state="state"
      class="flex flex-col gap-2"
      @submit="onSubmit"
   >
      <UFormField name="email">
         <UInput
            v-model="state.email"
            type="email"
            placeholder="Email"
            icon="lucide:mail"
         />
      </UFormField>
      <UFormField name="password">
         <UInput
            v-model="state.password"
            type="password"
            placeholder="Password"
            icon="lucide:lock"
         />
      </UFormField>
      <div class="flex items-center justify-end">
         <UButton
            type="submit"
            label="Login"
            icon="lucide:log-in"
         />
      </div>
   </UForm>
</template>
