<script setup lang="ts">
import type { NuxtError } from "#app"
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui"
import type { Row } from "@tanstack/vue-table"

definePageMeta({
   pageName: "Admins",
   pageOrder: 3,
   parent: {
      pageName: "Users",
      pageIcon: "lucide:users",
      pageOrder: 3,
   },
})

const appStore = useAppStore()
const authStore = useAuthStore()

const query = reactive<API.Query<{ name: string; role: string }>>({
   page: 1,
   perPage: 10,
   name: "",
   role: undefined,
})

const { data, pending, refresh } = useApi(`/api/admins`, {
   key: "admins",
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

const columns: TableColumn<DTO.Admin>[] = [
   {
      accessorKey: "user.name",
      header: "Name",
   },
   {
      accessorKey: "user.email",
      header: "Email",
   },
   {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) =>
         $formatDate(row.original.createdAt, "DD MMM YYYY HH:mm"),
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

function getRowItems(row: Row<DTO.Admin>): DropdownMenuItem[] {
   return [
      {
         type: "label",
         label: "Actions",
      },
      {
         label: "Detail",
         icon: "lucide:eye",
      },
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
         disabled: authStore.user?.id === row.original.user?.id,
         onSelect: () => {
            appStore.showDialog(
               "Delete Admin",
               h(resolveComponent("AppConfirmationPrompt"), {
                  prompt: `Are you sure you want to delete "${row.original.user?.name}"?`,
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
                        const response = await $api(
                           `/api/users/${row.original.user?.id}`,
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

const formLoading = shallowRef(false)

function openForm(data?: DTO.Admin) {
   const title = data ? "Edit Admin" : "Create Admin"

   const formSubmitHandler = async (
      apiHandler: () => Promise<API.Response<DTO.Admin>>
   ) => {
      try {
         formLoading.value = true
         const res = await apiHandler()
         appStore.notify({
            title: "Success",
            description: res.meta.message,
         })
         appStore.closeDialog()
         refresh()
      } catch (error) {
         const err = error as NuxtError
         appStore.notify({
            title: "Error",
            description: err.message,
            color: "error",
         })
      } finally {
         formLoading.value = false
      }
   }

   const component = data
      ? h(resolveComponent("FormAdminUpdate"), {
           data,
           loading: formLoading,
           onSubmit: async (
              values: InferSchema<typeof $adminSchema, "update">
           ) => {
              await formSubmitHandler(() =>
                 $api(`/api/admins/${data.id}`, {
                    method: "patch",
                    body: values,
                 })
              )
           },
        })
      : h(resolveComponent("FormAdminCreate"), {
           loading: formLoading,
           onSubmit: async (
              values: InferSchema<typeof $adminSchema, "create">
           ) => {
              await formSubmitHandler(() =>
                 $api(`/api/admins`, {
                    method: "post",
                    body: values,
                 })
              )
           },
        })

   appStore.showDialog(title, component)
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
               <UButton
                  label="New Admin"
                  icon="lucide:plus"
                  color="primary"
                  class="ms-auto"
                  @click="() => openForm()"
               />
            </div>
         </template>
      </AppDataTable>
   </div>
</template>
