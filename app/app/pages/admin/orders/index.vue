<script setup lang="ts">
import type { NuxtError } from "#app"
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui"
import type { Row } from "@tanstack/vue-table"

definePageMeta({
   pageName: "Orders",
   pageIcon: "lucide:shopping-cart",
   pageOrder: 4,
})

const query = reactive<API.Query>({
   page: 1,
   perPage: 10
})

const { data, pending, refresh } = useApi(`/api/orders`, {
   key: "orders",
   method: "get",
   query,
   transform: (res) => res.data,
   watch: false
})

watchExcludable(
   () => query,
   () => refresh(),
)

const columns: TableColumn<DTO.Order>[] = [
   {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => `#${row.original.id}`
   },
   {
      header: "User",
      cell: ({ row }) => h("div", {}, [
         h("div", { class: "font-semibold" }, row.original.user.name),
         h("div", { class: "text-xs" }, row.original.user.email)
      ])
   },
   {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => h(
         resolveComponent("UBadge"),
         {
            label: row.original.status,
            variant: "subtle"
         }
      )
   },
   {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => $formatCurrency(row.original.totalPrice)
   },
   {
      id: "actions",
      meta: {
         class: {
            td: "text-right"
         },
      },
      cell: ({ row }) => {
         return h(
            resolveComponent("UDropdownMenu"),
            {
               content: {
                  align: "end"
               },
               items: getRowItems(row),
               "aria-label": "Actions dropdown"
            },
            () => h(resolveComponent("UButton"), {
               icon: "lucide:ellipsis-vertical",
               color: "neutral",
               variant: "ghost",
            })
         )
      }
   }
]

const appStore = useAppStore()
function getRowItems(row: Row<DTO.Order>): DropdownMenuItem[] {
   return [
      {
         type: "label",
         label: "Actions"
      },
      {
         label: "Detail",
         icon: "lucide:eye",
         onSelect: (e) => {
            navigateTo(`/admin/orders/${row.original.id}`)
         },
      },
   ]
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
      />
   </div>
</template>
