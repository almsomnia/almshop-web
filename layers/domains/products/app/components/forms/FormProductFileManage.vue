<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types"

const props = withDefaults(
   defineProps<{
      data?: DTO.File[]
      loading?: Ref<boolean>
   }>(),
   {
      data: () => [],
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   "submit:update": [data: InferFlatSchema<typeof schema>]
   "submit:delete": [ids: number[]]
}>()

const schema = $productSchema().files
const state = reactive<InferFlatSchema<typeof schema>>({
   files: [],
})

const deleteMode = shallowRef(false)
const filePreview = shallowRef<DTO.File>()

const selectedToBeDeleted = reactive<Record<string, boolean>>({})

const loading = computed(() => unref(props.loading))

onMounted(() => {
   if (props.data) {
      filePreview.value = props.data[0]
   }
})

const formRef = useTemplateRef("form")

async function onSubmit() {
   if (deleteMode.value) {
      onDeleteSubmit()
   } else {
      await formRef.value?.submit()
   }
}

function onUpdateSubmit(e: FormSubmitEvent<InferFlatSchema<typeof schema>>) {
   emit("submit:update", e.data)
}

function onDeleteSubmit() {
   const deletedIds = Object.keys(selectedToBeDeleted)
      .filter((key) => selectedToBeDeleted[key])
      .map(Number)
   emit("submit:delete", deletedIds)
}
</script>

<template>
   <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="flex flex-col gap-4"
      @submit="onUpdateSubmit"
   >
      <div class="flex items-center">
         <span
            class="me-2 text-sm transition"
            :class="[deleteMode ? 'text-dimmed' : 'text-default']"
         >
            Update
         </span>
         <USwitch
            v-model="deleteMode"
            color="error"
         />
         <span
            class="ms-2 text-sm transition"
            :class="[deleteMode ? 'text-error' : 'text-dimmed']"
         >
            Delete
         </span>
      </div>
      <div v-show="!deleteMode">
         <UFileUpload
            v-model="state.files"
            multiple
            accept="image/*"
            layout="list"
            label="Drop your files here"
            description="JPG, PNG, SVG, or GIF (max. 2MB per file)"
         />
      </div>
      <div
         v-show="deleteMode"
         class="flex flex-col"
      >
         <div
            class="ms-auto aspect-square h-auto w-full shrink-0 basis-xs rounded-xl"
         >
            <img
               v-if="filePreview"
               :src="$resolveStorageUrl(filePreview.key)"
               class="aspect-square h-full w-full rounded-xl object-cover object-center"
            />
         </div>
         <div class="mt-2 flex items-center gap-2 overflow-x-auto">
            <template
               v-for="file in props.data"
               :key="file.id"
            >
               <div
                  class="relative aspect-square size-24 shrink-0 cursor-pointer overflow-hidden rounded-lg"
                  @click.stop="filePreview = file"
               >
                  <UCheckbox
                     class="absolute end-1 top-1 z-5"
                     v-model="selectedToBeDeleted[file.id]"
                  />
                  <img
                     :src="$resolveStorageUrl(file.key)"
                     class="aspect-square h-full w-full object-cover object-center transition-opacity"
                     :class="[
                        file.id === filePreview?.id
                           ? 'opacity-100'
                           : 'opacity-25 hover:opacity-75',
                     ]"
                  />
               </div>
            </template>
         </div>
      </div>
      <div class="flex items-center">
         <UButton
            @click="onSubmit"
            label="Submit"
            icon="lucide:check"
            class="ms-auto"
            :loading="loading"
         />
      </div>
   </UForm>
</template>
