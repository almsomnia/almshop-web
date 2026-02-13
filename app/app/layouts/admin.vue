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
            <UPageHeader
               :title="route.meta.pageName"
               :ui="{
                  root: 'border-b-0 py-4'
               }"
            />
            <slot />
         </template>
      </UDashboardPanel>
   </UDashboardGroup>
</template>
