<script setup lang="ts">
const props = defineProps<{
   data?: DTO.User
}>()

const emit = defineEmits<{
   submit: [data: InferSchema<typeof $userSchema, "update">]
}>()

const schema = $userSchema().update
const state = reactive<Partial<InferFlatSchema<typeof schema>>>({
   name: undefined,
   email: undefined,
   role: undefined,
})

function onSubmit(data: InferFlatSchema<typeof schema>) {
   emit("submit", data)
}

onMounted(() => {
   if (props.data) {
      state.name = props.data.name
      state.email = props.data.email
      state.role = props.data.role as typeof state.role
   }
})
</script>

<template>
   <FormUserBase
      v-model="state"
      :schema="schema"
      @submit="onSubmit"
   />
</template>
