<script setup lang="ts">
import type { NuxtError } from "#app"
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui"

const props = withDefaults(
   defineProps<{
      id?: string
   }>(),
   {
      id: "almshop-db-sidebar",
   }
)

const defaultSize = 16
const minSize = 12
const maxSize = 24

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

const appStore = useAppStore()
const authStore = useAuthStore()
const userMenuItems: DropdownMenuItem[][] = [
   [
      {
         label: "Profile",
         icon: "lucide:user",
      },
      {
         type: "separator",
      },
      {
         label: "Logout",
         icon: "lucide:log-out",
         color: "error",
         onSelect: async () => {
            try {
               const response = await authStore.logout()
               appStore.notify({
                  title: "Info",
                  description: response.meta.message,
               })
               await navigateTo("/")
            } catch (error) {
               const err = error as NuxtError
               appStore.notify({
                  title: err.statusMessage,
                  description: err.message,
                  color: "error",
               })
            }
         },
      },
   ],
]
</script>

<template>
   <UDashboardSidebar
      :id="props.id"
      resizable
      collapsible
      :default-size="defaultSize"
      :min-size="minSize"
      :max-size="maxSize"
      :ui="{
         header: 'relative',
      }"
   >
      <template #header="{ collapsed }">
         <h1
            class="text-lg tracking-widest uppercase"
            :class="{
               'inline-flex flex-1 justify-center': collapsed,
            }"
         >
            {{
               collapsed ? appConfig.app.title.charAt(0) : appConfig.app.title
            }}
         </h1>
         <div
            class="absolute end-0 top-0 z-10 flex h-full translate-x-1/2 items-center"
         >
            <UDashboardSidebarCollapse
               :icon="
                  collapsed ? 'lucide:chevron-right' : 'lucide:chevron-left'
               "
               variant="outline"
               square
               size="xs"
            />
         </div>
      </template>
      <template #default="{ collapsed }">
         <UNavigationMenu
            :items="items"
            :collapsed="collapsed"
            orientation="vertical"
            as="nav"
         />
      </template>
      <template #footer="{ collapsed }">
         <UDropdownMenu
            :items="userMenuItems"
            :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
         >
            <div
               class="flex w-full cursor-pointer items-center justify-between rounded-lg transition"
               :class="{
                  'hover:bg-elevated px-2.5 py-2': !collapsed,
               }"
            >
               <UUser
                  :name="collapsed ? undefined : authStore.user?.name"
                  :description="collapsed ? undefined : authStore.user?.email"
                  :avatar="{
                     text: authStore.user?.name.charAt(0),
                  }"
               />
               <UIcon
                  v-show="!collapsed"
                  name="lucide:chevron-down"
               />
            </div>
         </UDropdownMenu>
      </template>
   </UDashboardSidebar>
</template>
