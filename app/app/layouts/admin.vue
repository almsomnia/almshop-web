<script setup lang="ts">
const route = useRoute()
</script>

<template>
   <UDashboardGroup unit="rem">
      <LayoutAdminSidebar />
      <UDashboardPanel id="almshop-db-panel">
         <template #header>
            <LayoutAdminNavbar />
         </template>
         <template #body>
            <slot />
         </template>
      </UDashboardPanel>
   </UDashboardGroup>
</template>
