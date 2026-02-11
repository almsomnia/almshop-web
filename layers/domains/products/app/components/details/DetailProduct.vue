<script setup lang="ts">
const props = defineProps<{
   data: DTO.Product
}>()
</script>

<template>
   <div class="grid gap-4 md:grid-cols-2">
      <div class="flex flex-col">
         <span class="text-muted text-xs font-semibold"> Product Name </span>
         <span class="text-sm">
            {{ props.data.name }}
         </span>
      </div>
      <div class="flex flex-col">
         <span class="text-muted text-xs font-semibold"> Category </span>
         <span class="text-sm">
            {{ props.data.category?.name ?? "-" }}
         </span>
      </div>
      <div class="col-span-full flex flex-col">
         <span class="text-muted text-xs font-semibold"> Description </span>
         <span class="text-sm">
            {{ props.data.description ?? "-" }}
         </span>
      </div>
      <div class="flex flex-col">
         <span class="text-muted text-xs font-semibold"> Price </span>
         <span class="text-sm">
            {{ $formatCurrency(props.data.price) }}
         </span>
      </div>
      <div class="flex flex-col">
         <span class="text-muted text-xs font-semibold"> Stock </span>
         <span class="text-sm">
            {{ props.data.stock }}
         </span>
      </div>
   </div>
</template>
