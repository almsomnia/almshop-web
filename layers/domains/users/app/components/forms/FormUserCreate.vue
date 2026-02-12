<script setup lang="ts">
const props = withDefaults(
   defineProps<{
      loading: Ref<boolean>
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [data: InferSchema<typeof $userSchema, "create">]
}>()

const schema = $userSchema().create
const state = reactive<Partial<InferFlatSchema<typeof schema>>>({
   name: undefined,
   email: undefined,
   role: undefined,
   password: undefined,
   passwordConfirmation: undefined,
})

function onSubmit(data: InferFlatSchema<typeof schema>) {
   emit("submit", data)
}
</script>

<template>
   <FormUserBase
      v-model="state"
      :schema="schema"
      :loading="props.loading"
      @submit="onSubmit"
   >
      <template #extensions="{ loading }">
         <UFormField
            name="password"
            label="Password"
            required
         >
            <UInput
               v-model="state.password"
               type="password"
               :loading="loading"
            />
         </UFormField>
         <UFormField
            name="passwordConfirmation"
            label="Password Confirmation"
            required
         >
            <UInput
               v-model="state.passwordConfirmation"
               type="password"
               :loading="loading"
            />
         </UFormField>
      </template>
   </FormUserBase>
</template>
