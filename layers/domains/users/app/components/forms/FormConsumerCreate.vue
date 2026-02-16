<script setup lang="ts">
const props = withDefaults(
   defineProps<{
      loading?: Ref<boolean>
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [data: InferSchema<typeof $consumerSchema, "create">]
}>()

const schema = $consumerSchema().create
const state = reactive<Partial<InferFlatSchema<typeof schema>>>({
   name: undefined,
   email: undefined,
   dob: undefined,
   gender: undefined,
   phoneNumber: undefined,
   password: undefined,
   passwordConfirmation: undefined,
})

const dayjs = useDayjs()
const dateModel = computed({
   get: () => {
      if (!state.dob) return undefined
      return dayjs(state.dob)
   },
   set: (value) => {
      if (!value) {
         state.dob = undefined
         return
      }
      state.dob = value.toDate()
   },
})

function onSubmit(data: InferFlatSchema<typeof schema>) {
   emit("submit", data)
}
</script>

<template>
   <FormUserBase
      v-model="state"
      :schema="schema"
      @submit="onSubmit"
   >
      <template #extensions="{ loading }">
         <UFormField
            name="dob"
            label="Date of Birth"
            required
         >
            <DatePicker v-model="dateModel" />
         </UFormField>
         <UFormField
            name="gender"
            label="Gender"
            required
         >
            <!-- prettier-ignore-attribute v-model  -->
            <USelectMenu
               v-model="(state.gender as boolean | undefined)"
               :items="[
                  { label: 'Male', value: true },
                  { label: 'Female', value: false },
               ]"
               value-key="value"
               clear
               :loading="loading"
            />
         </UFormField>
         <UFormField
            name="phoneNumber"
            label="Phone Number"
            required
         >
            <UInput
               v-model="state.phoneNumber"
               :loading="loading"
               v-numeric
            />
         </UFormField>
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
