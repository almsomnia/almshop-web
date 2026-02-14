<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"

const props = withDefaults(
   defineProps<{
      productId: number
      loading?: Ref<boolean>
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [e: InferFlatSchema<typeof schema>]
}>()

const loading = computed(() => unref(props.loading))
const schema = $productSchema().files
const state = reactive<InferFlatSchema<typeof schema>>({
   files: [],
})

async function onSubmit(
   event: FormSubmitEvent<InferFlatSchema<typeof schema>>
) {
   emit("submit", event.data)
}
</script>

<template>
   <UForm
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="space-y-4"
   >
      <UFormField
         name="files"
         label="Product Images"
         required
      >
         <UFileUpload
            v-model="state.files"
            multiple
            accept="image/*"
            layout="list"
            label="Drop your files here"
            description="JPG, PNG, SVG, or GIF (max. 2MB per file)"
         />
      </UFormField>

      <div class="flex items-center">
         <slot name="actions">
            <UButton
               type="submit"
               label="Upload Files"
               icon="lucide:upload"
               class="ms-auto"
               :loading="loading"
            />
         </slot>
      </div>
   </UForm>
</template>
