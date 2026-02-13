<script setup lang="ts">
const { items } = useBreadcrumb()
</script>

<template>
   <UDashboardNavbar as="header">
      <template #left>
         <UBreadcrumb :items="items" />
      </template>
      <template #right>
         <UColorModeButton />
      </template>
   </UDashboardNavbar>
</template>
