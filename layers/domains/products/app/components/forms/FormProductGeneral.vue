<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"

const props = withDefaults(
   defineProps<{
      loading?: Ref<boolean>
      data?: DTO.Product
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [data: InferSchema<typeof $productSchema, "create">]
}>()

const schema = $productSchema().create
const state = reactive<Partial<InferFlatSchema<typeof schema>>>({
   name: undefined,
   description: undefined,
   categoryId: undefined,
   price: undefined,
   stock: undefined,
})

const loading = computed(() => props.loading.value)

function onSubmit(e: FormSubmitEvent<InferFlatSchema<typeof schema>>) {
   emit("submit", e.data)
}

onMounted(() => {
   if (props.data) {
      state.name = props.data.name
      state.description = props.data.description
      state.categoryId = props.data.categoryId
      state.price = props.data.price
      state.stock = props.data.stock
   }
})
</script>

<template>
   <UForm
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="grid grid-cols-2 gap-4"
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
         name="categoryId"
         label="Category"
      >
         <slot
            name="category-selector"
            :model-value="state.categoryId"
            :on-update:model-value="
               (val: typeof state.categoryId) => (state.categoryId = val)
            "
            :loading="loading"
         />
      </UFormField>
      <UFormField
         name="description"
         label="Description"
         class="col-span-full"
      >
         <UTextarea
            v-model="state.description"
            autoresize
            :rows="2"
            :loading="loading"
         />
      </UFormField>
      <UFormField
         name="price"
         label="Price"
         required
      >
         <UFieldGroup class="w-full">
            <UBadge
               variant="subtle"
               color="neutral"
               label="Rp"
            />
            <UInputNumber
               v-model="state.price"
               :min="0"
               :decrement="false"
               :increment="false"
            />
         </UFieldGroup>
      </UFormField>
      <UFormField
         name="stock"
         label="Stock"
         required
      >
         <UInputNumber
            v-model="state.stock"
            :min="0"
            :decrement="false"
            :increment="false"
         />
      </UFormField>
      <div class="col-span-full mt-2 flex items-center">
         <slot name="actions">
            <UButton
               type="submit"
               label="Submit"
               icon="lucide:check"
               class="ms-auto"
               :loading="loading"
            />
         </slot>
      </div>
   </UForm>
</template>
