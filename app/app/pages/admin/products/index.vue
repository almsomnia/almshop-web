<script setup lang="ts">
import type { NuxtError } from "#app";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui"
import type { Row } from "@tanstack/vue-table"

definePageMeta({
   pageName: "Products",
   pageIcon: "lucide:package",
   pageOrder: 1,
})

const query = reactive<API.Query<{ name: string; categoryId: number }>>({
   page: 1,
   perPage: 10,
   name: "",
   categoryId: undefined,
})

const { data, pending, refresh } = useApi(`/api/products`, {
   key: "products",
   method: "get",
   query,
   transform: (res) => res.data,
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

const columns: TableColumn<DTO.Product>[] = [
   {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => `#${row.original.id}`,
   },
   {
      accessorKey: "name",
      header: "Name",
   },
   {
      accessorKey: "category.name",
      header: "Category",
   },
   {
      accessorKey: "price",
      header: "Price",
      meta: {
         class: {
            td: "text-right",
            th: "text-right",
         },
      },
      cell: ({ row }) => $formatCurrency(row.original.price),
   },
   {
      accessorKey: "stock",
      header: "Stock",
      meta: {
         class: {
            td: "text-right",
            th: "text-right",
         },
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

const appStore = useAppStore()
function getRowItems(row: Row<DTO.Product>): DropdownMenuItem[] {
   return [
      {
         type: "label",
         label: "Actions",
      },
      {
         label: "Detail",
         icon: "lucide:eye",
         onSelect: (e) => {
            appStore.showDialog(
               "Product Detail",
               h(resolveComponent("DetailProduct"), {
                  data: row.original,
               })
            )
         },
      },
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

const formLoading = shallowRef(false)

function openForm() {
   appStore.showDialog(
      "New Product",
      h(
         resolveComponent("FormProduct"),
         {
            loading: formLoading,
            onSubmit: async (values: InferSchema<typeof $productSchema, "create">) => {
               try {
                  formLoading.value = true
                  const response = await $api<API.Response<DTO.Product>>(`/api/products`, {
                     method: "post",
                     body: values,
                  })
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
            }
         },
         {
            "category-selector": (slotProps: {
               modelValue: number | undefined
               "onUpdate:modelValue": (val: number | undefined) => void
               loading?: boolean
            }) =>
               h(resolveComponent("SelectCategory"), {
                  modelValue: slotProps.modelValue,
                  "onUpdate:modelValue": slotProps["onUpdate:modelValue"],
                  clear: true,
                  loading: slotProps.loading,
                  placeholder: "Category",
               }),
         }
      )
   )
}
</script>

<template>
   <div>
      <AppDataTable
         :data="data?.items ?? []"
         :columns="columns"
         :total="data?.total ?? 0"
         :from="data?.from ?? 0"
         :to="data?.to ?? 0"
         v-model:page="query.page"
         v-model:per-page="query.perPage"
         :loading="pending"
      >
         <template #header>
            <div class="flex items-center gap-2">
               <UInput
                  v-model="query.name"
                  placeholder="Search..."
                  icon="lucide:search"
                  class="max-w-3xs"
               />
               <SelectCategory
                  v-model="query.categoryId"
                  clear
                  placeholder="Category"
                  class="max-w-3xs"
               />
               <UButton
                  label="New Product"
                  icon="lucide:plus"
                  class="ms-auto"
                  @click="() => openForm()"
               />
            </div>
         </template>
      </AppDataTable>
   </div>
</template>
