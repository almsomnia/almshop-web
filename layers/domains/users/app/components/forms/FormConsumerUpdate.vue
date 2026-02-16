<script setup lang="ts">
const props = withDefaults(
   defineProps<{
      data: DTO.Consumer
      loading?: Ref<boolean>
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [data: InferSchema<typeof $consumerSchema, "update">]
}>()

const schema = $consumerSchema().update
const state = reactive<Partial<InferFlatSchema<typeof schema>>>({
   name: undefined,
   email: undefined,
   dob: undefined,
   gender: undefined,
   phoneNumber: undefined,
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

onMounted(() => {
   if (props.data) {
      state.name = props.data.user?.name
      state.email = props.data.user?.email
      state.dob = new Date(props.data?.dob)
      state.gender = props.data.gender
      state.phoneNumber = props.data.phoneNumber
   }
})
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
      </template>
   </FormUserBase>
</template>
