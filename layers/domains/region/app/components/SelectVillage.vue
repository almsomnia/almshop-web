<script setup lang="ts">
import type { SelectMenuItem, AcceptableValue } from "#ui/types"

type Option = SelectMenuItem | { label: string; value: string }

const props = withDefaults(
   defineProps<{
      districtCode: string
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
   if (!props.districtCode) return

   const response = await $api<API.Response<DTO.Village[]>>(
      `/api/villages/${props.districtCode}`,
      {
         method: "get",
      }
   )

   items.value = response.data.map((item) => {
      return {
         label: item.name,
         value: item.code,
      }
   })
}

watch(
   () => props.districtCode,
   (value) => {
      if (!value) {
         items.value = []
         model.value = null
         return
      }
      fetchItems()
   }, {
      immediate: true
   }
)
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
