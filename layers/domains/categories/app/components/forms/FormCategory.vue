<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"

const props = withDefaults(
   defineProps<{
      loading?: Ref<boolean>
      data?: DTO.Category
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [data: InferSchema<typeof $categorySchema, "create">]
}>()

const schema = $categorySchema().create
const state = reactive<Partial<InferFlatSchema<typeof schema>>>({
   name: undefined,
   parentId: undefined,
})

const loading = computed(() => props.loading.value)

function onSubmit(e: FormSubmitEvent<InferFlatSchema<typeof schema>>) {
   emit("submit", e.data)
}

const selectCategoryExclude = computed(() => {
   if (!props.data) return []
   return [props.data.id]
})

onMounted(() => {
   if (props.data) {
      state.name = props.data.name
      state.parentId = props.data.parentId
   }
})
</script>

<template>
   <UForm
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="grid gap-4"
   >
      <UFormField
         name="name"
         label="Name"
         required
      >
         <UInput
            v-model="state.name"
            maxlength="255"
            placeholder="min 3 characters"
            :loading="loading"
         />
      </UFormField>
      <UFormField
         name="parentId"
         label="Parent Category"
      >
         <SelectCategory
            v-model="state.parentId"
            :loading="loading"
            parent-selectable
            :disabled="selectCategoryExclude"
            clear
         />
      </UFormField>
      <div class="mt-2 flex items-center">
         <UButton
            type="submit"
            label="Submit"
            icon="lucide:check"
            class="ms-auto"
            :loading="loading"
         />
      </div>
   </UForm>
</template>
