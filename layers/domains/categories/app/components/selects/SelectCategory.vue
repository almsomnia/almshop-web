<script setup lang="ts">
import type { SelectMenuItem, AcceptableValue } from "#ui/types"

type Option = SelectMenuItem | { label: string; value: number }

const props = withDefaults(
   defineProps<{
      labelKey?: string
      valueKey?: string
      placeholder?: string
      clear?: boolean
      parentSelectable?: boolean
      disabled?: number[]
   }>(),
   {
      labelKey: "label",
      valueKey: "value",
      parentSelectable: false,
      disabled: () => [],
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
   const roots: DTO.Category[] = []

   for (const item of allItems) {
      if (!item.parentId) {
         roots.push(item)
      } else {
         if (!childrenMap.has(item.parentId)) {
            childrenMap.set(item.parentId, [])
         }
         childrenMap.get(item.parentId)?.push(item)
      }
   }

   const flattened: Option[] = []

   const pushItems = (nodes: DTO.Category[], depth: number) => {
      for (const node of nodes) {
         const hasChildren = (childrenMap.get(node.id)?.length ?? 0) > 0
         const isDisabled = props.disabled.includes(node.id)

         if (depth === 0 && !props.parentSelectable && hasChildren) {
            flattened.push({
               type: "label",
               label: node.name,
            })
         } else {
            flattened.push({
               label: node.name,
               value: node.id,
               disabled: isDisabled,
               // Use space for indentation
               class: depth > 0 ? `ps-${depth * 4}` : undefined,
            })
         }

         const children = childrenMap.get(node.id) ?? []
         if (children.length > 0) {
            pushItems(children, depth + 1)
         }
      }
   }

   pushItems(roots, 0)
   items.value = flattened
}

onMounted(async () => {
   await fetchItems()
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
   />
</template>
