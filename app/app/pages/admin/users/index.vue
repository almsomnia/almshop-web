<script setup lang="ts">
import type { NuxtError } from "#app"
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui"
import type { Row } from "@tanstack/vue-table"

definePageMeta({
   pageName: "Users",
   pageIcon: "lucide:users",
   pageOrder: 3,
})

const appStore = useAppStore()

const query = reactive<API.Query<{ name: string; role: string }>>({
   page: 1,
   perPage: 10,
   name: "",
   role: undefined,
})

const { data, pending, refresh } = useApi(`/api/users`, {
   key: "users",
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

const columns: TableColumn<DTO.User>[] = [
   {
      accessorKey: "name",
      header: "Name",
   },
   {
      accessorKey: "email",
      header: "Email",
   },
   {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) =>
         h(resolveComponent("UBadge"), {
            color: row.original.role == "admin" ? "primary" : "secondary",
            variant: "subtle",
            class: "capitalize",
            label: row.original.role,
         }),
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

function getRowItems(row: Row<DTO.User>): DropdownMenuItem[] {
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
                        const response = await $api(
                           `/api/users/${row.original.id}`,
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

const roleItems: string[] = ["admin", "consumer"]

const formLoading = shallowRef(false)

function openForm(data?: DTO.User) {
   const title = data ? "Edit User" : "Create User"

   const formSubmitHandler = async (
      apiHandler: () => Promise<API.Response<DTO.User>>
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
      ? h(resolveComponent("FormUserUpdate"), {
           data,
           loading: formLoading,
           onSubmit: async (
              values: InferSchema<typeof $userSchema, "update">
           ) => {
              await formSubmitHandler(() =>
                 $api(`/api/users/${data.id}`, {
                    method: "patch",
                    body: values,
                 })
              )
           },
        })
      : h(resolveComponent("FormUserCreate"), {
           loading: formLoading,
           onSubmit: async (
              values: InferSchema<typeof $userSchema, "create">
           ) => {
              await formSubmitHandler(() =>
                 $api(`/api/users`, {
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
               <USelectMenu
                  v-model="query.role"
                  :items="roleItems"
                  placeholder="Role"
                  clear
                  class="max-w-48"
                  :ui="{
                     itemLabel: 'capitalize',
                     base: 'capitalize',
                  }"
               />
               <UButton
                  label="Create"
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
