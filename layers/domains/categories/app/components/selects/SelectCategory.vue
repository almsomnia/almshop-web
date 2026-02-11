<script setup lang="ts">
import type { SelectMenuItem, AcceptableValue } from "#ui/types"

type Option = SelectMenuItem | { label: string; value: number }

const props = withDefaults(
   defineProps<{
      labelKey?: string
      valueKey?: string
      placeholder?: string
      clear?: boolean
   }>(),
   {
      labelKey: "label",
      valueKey: "value",
   }
)

const model = defineModel<AcceptableValue | Option>({ required: false })
const search = defineModel<string | undefined>("search", { required: false })

const items = ref<Option[]>([])

async function fetchItems() {
   const response = await $api<API.Response<API.Pagination<DTO.Category[]>>>(
      `/api/categories`,
      {
         method: "get",
         query: {
            name: search.value,
         },
      }
   )

   const allItems = response.data.items
   const childrenMap = new Map<number, DTO.Category[]>()
   const parents: DTO.Category[] = []

   // O(N) - Group categories in one pass
   for (const item of allItems) {
      if (!item.parentId) {
         parents.push(item)
      } else {
         if (!childrenMap.has(item.parentId)) {
            childrenMap.set(item.parentId, [])
         }
         childrenMap.get(item.parentId)?.push(item)
      }
   }

   items.value = []

   // O(N) - Build flat list for SelectMenu
   for (const parent of parents) {
      items.value.push({
         type: "label",
         label: parent.name,
      })

      const children = childrenMap.get(parent.id) ?? []
      for (const child of children) {
         items.value.push({
            label: child.name,
            value: child.id,
         })
      }
   }
}

onMounted(async () => {
   await fetchItems()
   props.valueKey
})
</script>

<template>
   <USelectMenu
      :items="items"
      v-model="model"
      :value-key="props.valueKey"
      :label-key="props.labelKey"
      :placeholder="props.placeholder"
      v-model:search-term="search"
      :clear="props.clear"
      class="w-full"
      :ui="{
         itemLabel: 'ms-2'
      }"
   />
</template>
