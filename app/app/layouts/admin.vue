<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const appConfig = useAppConfig()

const items: NavigationMenuItem[][] = [
   [
      {
         label: "Dashboard",
         icon: "lucide:house",
         to: "/admin",
      },
      {
         label: "Products",
         icon: "lucide:package",
         to: "/admin/products",
      },
   ],
]

const authStore = useAuthStore()
</script>

<template>
   <UDashboardGroup unit="rem">
      <UDashboardSidebar
         id="almshop-db-sidebar"
         resizable
         collapsible
         :default-size="16"
         :min-size="12"
         :max-size="24"
      >
         <template #header="{ collapsed }">
            <h1
               class="w-16 text-lg tracking-widest uppercase"
               :class="{
                  'inline-flex flex-1 justify-center': collapsed,
               }"
            >
               {{
                  collapsed
                     ? appConfig.app.title.charAt(0)
                     : appConfig.app.title
               }}
            </h1>
         </template>
         <template #default="{ collapsed }">
            <UNavigationMenu
               :items="items"
               :collapsed="collapsed"
               orientation="vertical"
            />
         </template>
         <template #footer="{ collapsed }">
            <UUser
               :name="collapsed ? undefined : authStore.user?.name"
               :description="collapsed ? undefined : authStore.user?.email"
               :avatar="{
                  text: authStore.user?.name.charAt(0),
               }"
            />
         </template>
      </UDashboardSidebar>
      <UDashboardPanel id="almshop-db-panel">
         <template #header>
            <UDashboardNavbar>
               <template #left>
                  <UDashboardSidebarCollapse />
               </template>
               <template #right>
                  <UColorModeButton />
               </template>
            </UDashboardNavbar>
         </template>
         <template #body>
            <slot />
         </template>
      </UDashboardPanel>
   </UDashboardGroup>
</template>
