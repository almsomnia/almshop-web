<script setup lang="ts">
import type { FormSubmitEvent, StepperItem } from "#ui/types"
import FormProductGeneral from "./FormProductGeneral.vue"
import FormProductFile from "./FormProductFile.vue"

type CategorySelectorProps = {
   modelValue: number | null | undefined
   "onUpdate:modelValue": (value: number | null | undefined) => void
}

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
   "submit:general": [data: InferSchema<typeof $productSchema, "create">]
   "submit:files": [data: InferSchema<typeof $productSchema, "files">]
}>()

const slots = defineSlots<{
   "category-selector"(slotProps: CategorySelectorProps): any
}>()

const currentStep = shallowRef(0)
const stepperItem = computed<StepperItem[]>(() => [
   {
      value: 0,
      title: "General Information",
      content: "",
      description: "Basic product details",
      icon: "lucide:info",
      component: h(
         FormProductGeneral,
         {
            loading: props.loading,
            data: props.data,
            onSubmit: (
               values: InferSchema<typeof $productSchema, "create">
            ) => {
               emit("submit:general", values)
            },
         },
         {
            "category-selector": (slotProps: CategorySelectorProps) =>
               slots["category-selector"]?.({
                  modelValue: slotProps.modelValue,
                  "onUpdate:modelValue": slotProps["onUpdate:modelValue"],
               }),
            actions: h(resolveComponent("UButton"), {
               class: "ms-auto",
               type: "submit",
               label: "Next",
               trailingIcon: "lucide:arrow-right",
            }),
         }
      ),
   },
   {
      value: 1,
      title: "Product Images",
      description: "Product images",
      icon: "lucide:image",
      disabled: !props.data,
      component: h(
         FormProductFile,
         {
            productId: props.data?.id ?? 0,
            loading: props.loading,
            onSubmit: (values: InferSchema<typeof $productSchema, "files">) => {
               emit("submit:files", values)
            },
         },
         {
            actions: [
               h(resolveComponent("UButton"), {
                  label: "Previous",
                  leadingIcon: "lucide:arrow-left",
                  variant: "soft",
                  color: "neutral",
                  onClick: () => currentStep.value--,
               }),
               h(resolveComponent("UButton"), {
                  label: "Submit",
                  type: "submit",
                  icon: "lucide:check",
                  class: "ms-auto",
               }),
            ],
         }
      ),
   },
])

defineExpose({
   currentStep: currentStep.value,
   next: () => currentStep.value++,
   prev: () => currentStep.value--,
   setCurrentStep: (step: number) => (currentStep.value = step),
   minStep: 0,
   maxStep: stepperItem.value.length - 1,
})
</script>

<template>
   <UStepper
      linear
      :items="stepperItem"
      v-model="currentStep"
   >
      <template #content="{ item }">
         <UContainer>
            <component :is="item.component" />
         </UContainer>
      </template>
   </UStepper>
</template>
