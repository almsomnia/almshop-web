<script setup lang="ts" generic="T">
import type { TableColumn } from "#ui/types"

const props = withDefaults(
   defineProps<{
      data: T[]
      columns: TableColumn<T>[]
      total: number
      from?: number
      to?: number
      loading?: boolean
   }>(),
   {
      total: 0,
      from: 0,
      to: 0,
      loading: false,
   }
)

const page = defineModel<number>("page", { required: false, default: 1 })
const perPage = defineModel<number>("perPage", { required: false, default: 10 })
</script>

<template>
   <div class="flex flex-col gap-4">
      <slot name="header" />
      <UTable
         :data="data"
         :columns="columns"
         :loading="props.loading"
         :ui="{
            base: 'border-b border-default',
         }"
      >
         <template #empty>
            <UEmpty
               title="No data"
               icon="lucide:x"
               variant="naked"
            />
         </template>
      </UTable>
      <slot name="footer">
         <div class="flex items-center justify-between">
            <span class="text-muted text-xs">
               {{ props.from }} - {{ props.to }} of {{ props.total }} data
            </span>
            <div class="flex items-center gap-2.5">
               <USelect
                  v-model="perPage"
                  :items="[5, 10, 25, 50, 100]"
               >
                  <template #item-label="{ item }">
                     {{ item }} per page
                  </template>
                  <template #default="{ modelValue }">
                     {{ modelValue }} per page
                  </template>
               </USelect>
               <UPagination
                  v-model:page="page"
                  :items-per-page="perPage"
                  :total="props.total"
                  :sibling-count="1"
               />
            </div>
         </div>
      </slot>
   </div>
</template>
