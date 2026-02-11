<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui"
import type { Row } from "@tanstack/vue-table"

type CategoryData = DTO.Category & { children: DTO.Category[] }

definePageMeta({
   pageName: "Categories",
   pageIcon: "lucide:folder",
   pageOrder: 2,
})

const query = reactive<API.Query<{ name: string }>>({
   name: undefined,
})

const { data, pending, refresh } = useApi(`/api/categories`, {
   key: "categories",
   method: "get",
   query,
   transform: (res) => {
      const { items } = res.data
      const childrenMap = new Map<number, DTO.Category[]>()
      const parents: CategoryData[] = []

      for (const item of items) {
         if (!item.parentId) {
            parents.push({ ...item, children: [] })
         } else {
            if (!childrenMap.has(item.parentId)) {
               childrenMap.set(item.parentId, [])
            }
            childrenMap.get(item.parentId)?.push(item)
         }
      }

      for (const parent of parents) {
         parent.children = childrenMap.get(parent.id) ?? []
      }

      return parents
   },
   watch: false,
})

watchExcludable(
   () => query,
   () => refresh(),
   { exclude: ["name"] }
)

watchDebounced(
   () => query.name,
   () => refresh(),
   { debounce: 800, maxWait: 1000 }
)

const columns: TableColumn<CategoryData>[] = [
   {
      header: "#",
      cell: ({ row }) => {
         return h(
            "div",
            {
               class: "flex items-center gap-4",
               style: {
                  paddingLeft: `${row.depth * 1.5}rem`,
               },
            },
            [
               h(resolveComponent("UButton"), {
                  color: "neutral",
                  variant: "outline",
                  square: true,
                  size: "xs",
                  icon: row.getIsExpanded() ? "lucide:minus" : "lucide:plus",
                  class: !row.getCanExpand() && "invisible",
                  onClick: row.getToggleExpandedHandler(),
               }),
               row.original.name
            ]
         )
      },
   },
   {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) => $formatDate(row.original.createdAt),
   },
   {
      id: "actions",
      meta: {
         class: {
            td: "text-right",
         },
      },
      cell: ({ row }) => {
         return h(
            resolveComponent("UDropdownMenu"),
            {
               content: {
                  align: "end",
               },
               items: getRowItems(row),
               "aria-label": "Actions dropdown",
            },
            () =>
               h(resolveComponent("UButton"), {
                  icon: "i-lucide-ellipsis-vertical",
                  color: "neutral",
                  variant: "ghost",
                  "aria-label": "Actions dropdown",
               })
         )
      },
   },
]

function getRowItems(row: Row<CategoryData>): DropdownMenuItem[] {
   return [
      {
         label: "Edit",
         icon: "lucide:edit",
      },
      {
         type: "separator",
      },
      {
         label: "Delete",
         icon: "lucide:trash",
         color: "error",
      },
   ]
}

function getSubRows(row: CategoryData) {
   return row.children as CategoryData[]
}

const tableExpanded = ref<Record<number, boolean>>({})
</script>

<template>
   <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
         <UInput
            v-model="query.name"
            placeholder="Search..."
            icon="lucide:search"
            class="max-w-3xs"
         />
      </div>
      <UTable
         :data="data"
         :columns="columns"
         :loading="pending"
         :get-sub-rows="getSubRows"
         v-model:expanded="tableExpanded"
         :ui="{
            base: 'border-separate border-spacing-0',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            tr: 'group',
            td: 'empty:p-0 group-has-[td:not(:empty)]:border-b border-default',
         }"
      ></UTable>
   </div>
</template>
