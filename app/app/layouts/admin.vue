<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const appConfig = useAppConfig()

const router = useRouter()
const adminRoutes = router
   .getRoutes()
   .filter((item) => item.path.startsWith("/admin"))
   .filter((item) => !item.meta.hideOnSidebar)
   .sort((a, b) => (a.meta.pageOrder ?? 0) - (b.meta.pageOrder ?? 0))

const items: NavigationMenuItem[][] = [
   adminRoutes.map((route) => {
      return {
         label: route.meta.pageName,
         to: route.path,
         icon: route.meta.pageIcon,
      }
   }),
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
