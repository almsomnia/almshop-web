<script setup lang="ts">
const { data: products } = useApi(`/api/products`, {
   method: "get",
})
</script>

<template>
   <div class="grid grid-cols-3 gap-4">
      <UCard v-for="item in products?.data.items">
         {{ item.name }}
      </UCard>
   </div>
</template>
