<script setup lang="ts">
const props = withDefaults(
   defineProps<{
      data: DTO.Admin
      loading?: Ref<boolean>
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [data: InferSchema<typeof $adminSchema, "update">]
}>()

const schema = $adminSchema().update
const state = reactive<Partial<InferFlatSchema<typeof schema>>>({
   name: undefined,
   email: undefined,
})

function onSubmit(data: InferFlatSchema<typeof schema>) {
   emit("submit", data)
}

onMounted(() => {
   if (props.data) {
      state.name = props.data.user?.name
      state.email = props.data.user?.email
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
