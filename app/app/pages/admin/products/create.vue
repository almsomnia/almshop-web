<script setup lang="ts">
import type { NuxtError } from "#app"

definePageMeta({
   pageName: "Create Product",
   hideOnSidebar: true,
})

const appStore = useAppStore()
const formProduct = useTemplateRef("formProduct")

const product = shallowRef<DTO.Product>()

async function onGeneralSubmit(
   values: InferSchema<typeof $productSchema, "create">
) {
   try {
      const response = await $api<API.Response<DTO.Product>>(`/api/products`, {
         method: "post",
         body: values,
      })
      product.value = response.data
      appStore.notify({
         title: "Success",
         description: response.meta.message,
      })
      formProduct.value?.next()
   } catch (error) {
      const err = error as NuxtError
      appStore.notify({
         title: err.statusMessage,
         description: err.message,
         color: "error",
      })
   }
}

async function onFilesSubmit(
   values: InferSchema<typeof $productSchema, "files">
) {
   try {
      const formData = new FormData()
      values.files.forEach((file) => {
         formData.append("files", file)
      })

      const response = await $api<API.Response<DTO.Product>>(
         `/api/products/${product.value?.id}/files`,
         {
            method: "post",
            body: formData,
         }
      )
      appStore.notify({
         title: "Success",
         description: response.meta.message,
      })
      navigateTo("/admin/products")
   } catch (error) {
      const err = error as NuxtError
      appStore.notify({
         title: err.statusMessage,
         description: err.message,
         color: "error",
      })
   }
}
</script>

<template>
   <FormProduct
      ref="formProduct"
      @submit:general="onGeneralSubmit"
      @submit:files="onFilesSubmit"
   >
      <template #category-selector="slotProps">
         <SelectCategory
            :model-value="slotProps.modelValue"
            @update:model-value="slotProps['onUpdate:modelValue']"
            clear
         />
      </template>
   </FormProduct>
</template>
