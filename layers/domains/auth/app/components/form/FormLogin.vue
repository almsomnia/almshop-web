<script setup lang="ts">
const schema = $authSchema().login
const state = reactive<Partial<InferFlatSchema<typeof schema>>>({
   email: undefined,
   password: undefined,
})
</script>

<template>
   <UForm
      :schema="schema"
      :state="state"
      class="flex flex-col gap-2"
      @submit="console.log"
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
