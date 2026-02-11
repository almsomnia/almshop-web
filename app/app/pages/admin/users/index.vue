<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui"
import type { Row } from "@tanstack/vue-table"

definePageMeta({
   pageName: "Users",
   pageIcon: "lucide:users",
   pageOrder: 3,
})

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

const roleItems: string[] = ["admin", "consumer"]
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
                  class="max-w-3xs"
                  :ui="{
                     itemLabel: 'capitalize',
                     base: 'capitalize',
                  }"
               />
            </div>
         </template>
      </AppDataTable>
   </div>
</template>
