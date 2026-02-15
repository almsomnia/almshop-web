<script setup lang="ts">
import type { NuxtError } from "#app"
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui"
import type { Row } from "@tanstack/vue-table"

type CategoryData = DTO.Category & { children: CategoryData[] }

definePageMeta({
   pageName: "Categories",
   pageIcon: "lucide:folder",
   pageOrder: 2,
})

const appStore = useAppStore()

const query = reactive<API.Query<{ name: string }>>({
   name: undefined,
})

const { data, pending, refresh } = useApi(`/api/categories`, {
   key: "categories",
   method: "get",
   query,
   transform: (res) => {
      const { items } = res.data
      const map = new Map<number, CategoryData>()
      const roots: CategoryData[] = []

      for (const item of items) {
         map.set(item.id, { ...item, children: [] })
      }

      for (const item of items) {
         const node = map.get(item.id)!
         if (item.parentId && map.has(item.parentId)) {
            map.get(item.parentId)!.children.push(node)
         } else {
            roots.push(node)
         }
      }

      return roots
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
      header: "Name",
      cell: ({ row }) => {
         return h(
            "div",
            {
               class: "flex items-center gap-4",
               style: {
                  paddingLeft: `${row.depth * 1.15}rem`,
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
               row.original.name,
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
         onSelect: () => openForm(row.original),
      },
      {
         type: "separator",
      },
      {
         label: "Delete",
         icon: "lucide:trash",
         color: "error",
         onSelect: () => {
            appStore.showDialog(
               "Delete Category",
               h(resolveComponent("AppConfirmationPrompt"), {
                  prompt: `Are you sure you want to delete "${row.original.name}"?`,
                  positiveButtonProps: {
                     label: "Delete",
                     color: "error",
                     icon: "lucide:trash",
                     variant: "solid",
                  },
                  negativeButtonProps: {
                     label: "Cancel",
                     color: "neutral",
                     variant: "outline",
                  },
                  onPositive: async () => {
                     try {
                        const response = await $api<API.Response<DTO.Category>>(
                           `/api/categories/${row.original.id}`,
                           {
                              method: "delete",
                           }
                        )
                        appStore.notify({
                           title: "Success",
                           description: response.meta.message,
                        })
                        appStore.closeDialog()
                        refresh()
                     } catch (error) {
                        const err = error as NuxtError
                        appStore.notify({
                           title: err.statusMessage,
                           description: err.message,
                           color: "error",
                        })
                     }
                  },
                  onNegative: () => {
                     appStore.closeDialog()
                  },
               })
            )
         },
      },
   ]
}

function getSubRows(row: CategoryData) {
   return row.children
}

const tableExpanded = ref<Record<number, boolean>>({})

const formLoading = shallowRef(false)

function openForm(data?: DTO.Category) {
   const title = data ? "Edit Category" : "New Category"

   appStore.showDialog(
      title,
      h(resolveComponent("FormCategory"), {
         loading: formLoading,
         data: data,
         onSubmit: async (
            values: InferSchema<typeof $categorySchema, "create">
         ) => {
            try {
               formLoading.value = true

               const apiHandler = () =>
                  data?.id
                     ? $api(`/api/categories/${data.id}`, {
                          method: "patch",
                          body: values,
                       })
                     : $api(`/api/categories`, {
                          method: "post",
                          body: values,
                       })

               const response = await apiHandler()
               appStore.notify({
                  title: "Success",
                  description: response.meta.message,
               })

               appStore.closeDialog()
               refresh()
            } catch (error) {
               const err = error as NuxtError
               appStore.notify({
                  title: err.statusMessage,
                  description: err.message,
                  color: "error",
               })
            } finally {
               formLoading.value = false
            }
         },
      })
   )
}
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
         <UButton
            label="New Category"
            icon="lucide:plus"
            color="primary"
            variant="solid"
            class="ms-auto"
            @click="() => openForm()"
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
      />
   </div>
</template>
