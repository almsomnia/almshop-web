<script setup lang="ts">
const props = defineProps<{
   data: DTO.Product
}>()
</script>

<template>
   <div class="grid md:grid-cols-2 gap-4">
      <div class="flex flex-col">
         <span class="text-xs font-semibold text-muted">
            Product Name
         </span>
         <span class="text-sm">
            {{ props.data.name }}
         </span>
      </div>
      <div class="flex flex-col">
         <span class="text-xs font-semibold text-muted">
            Category
         </span>
         <span class="text-sm">
            {{ props.data.category.name }}
         </span>
      </div>
      <div class="flex flex-col">
         <span class="text-xs font-semibold text-muted">
            Price
         </span>
         <span class="text-sm">
            {{ $formatCurrency(props.data.price) }}
         </span>
      </div>
      <div class="flex flex-col">
         <span class="text-xs font-semibold text-muted">
            Stock
         </span>
         <span class="text-sm">
            {{ props.data.stock }}
         </span>
      </div>
   </div>
</template>
