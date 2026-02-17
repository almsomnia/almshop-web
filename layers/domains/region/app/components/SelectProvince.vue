<script setup lang="ts">
import type { SelectMenuItem, AcceptableValue } from "#ui/types"

type Option = SelectMenuItem | { label: string, value: string }

const props = withDefaults(
   defineProps<{
      labelKey?: string
      valueKey?: string
      placeholder?: string
      clear?: boolean
      disabled?: boolean
   }>(),
   {
      labelKey: "label",
      valueKey: "value",
   }
)

const model = defineModel<AcceptableValue | Option>({ required: false })

const items = ref<Option[]>([])

async function fetchItems() {
   const response = await $api<API.Response<DTO.Province[]>>(`/api/provinces`, {
      method: "get",
   })

   items.value = response.data.map((item) => {
      return {
         label: item.name,
         value: item.code,
      }
   })
}

onMounted(() => {
   fetchItems()
})
</script>

<template>
   <USelectMenu
      :items="items"
      v-model="model"
      :value-key="props.valueKey"
      :label-key="props.labelKey"
      :placeholder="props.placeholder"
      :clear="props.clear"
      :disabled="props.disabled"
      class="w-full"
   />
</template>
