<script setup lang="ts">
import type { NuxtError } from "#app"
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

const { data, pending, refresh } = useFetch(`/api/products`, {
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
            navigateTo(`/admin/products/${row.original.id}`)
         },
      },
      {
         label: "Edit",
         icon: "lucide:edit",
         onSelect: () => openForm(row.original),
      },
      {
         label: "Files",
         icon: "lucide:file",
         onSelect: () => {
            appStore.showDialog(
               "Manage Product Files",
               h(resolveComponent("FormProductFile"), {
                  productId: row.original.id,
                  onSubmit: async (
                     values: InferSchema<typeof $productSchema, "files">
                  ) => {
                     try {
                        const formData = new FormData()
                        values.files.forEach((file) => {
                           formData.append("files", file)
                        })

                        const response = await $api<API.Response<unknown>>(
                           `/api/products/${row.original.id}/files`,
                           {
                              method: "post",
                              body: formData,
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
               })
            )
         },
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
               "Delete Product",
               h(resolveComponent("AppConfirmationPrompt"), {
                  prompt: `Are you sure you want to delete "${row.original.name}"?`,
                  positiveButtonProps: {
                     label: "Delete",
                     color: "error",
                     icon: "lucide:trash",
                     variant: "solid",
                  },
                  onPositive: async () => {
                     try {
                        await $api<API.Response<boolean>>(
                           `/api/products/${row.original.id}`,
                           {
                              method: "delete",
                           }
                        )
                        appStore.notify({
                           title: "Success",
                           description: "Product deleted successfully",
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

const formLoading = shallowRef(false)

function openForm(data?: DTO.Product) {
   appStore.showDialog(
      data ? "Edit Product" : "New Product",
      h(
         resolveComponent("FormProductGeneral"),
         {
            loading: formLoading,
            data,
            onSubmit: async (
               values: InferSchema<typeof $productSchema, "create">
            ) => {
               try {
                  formLoading.value = true

                  const apiHandler = () =>
                     data
                        ? $api<API.Response<DTO.Product>>(
                             `/api/products/${data.id}`,
                             {
                                method: "patch",
                                body: values,
                             }
                          )
                        : $api<API.Response<DTO.Product>>(`/api/products`, {
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
                  class="max-w-48"
               />
               <UButton
                  label="New Product"
                  icon="lucide:plus"
                  class="ms-auto"
                  @click="navigateTo(`/admin/products/create`)"
               />
            </div>
         </template>
      </AppDataTable>
   </div>
</template>
