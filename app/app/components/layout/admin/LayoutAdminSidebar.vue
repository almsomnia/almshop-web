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

const items = computed<NavigationMenuItem[][]>(() => {
   const menuMap = new Map<string, NavigationMenuItem>()

   // Create items for all routes first
   adminRoutes.forEach((route) => {
      menuMap.set(route.path, {
         label: (route.meta.pageName as string) ?? route.path,
         to: route.path,
         icon: route.meta.pageIcon as string,
         children: [] as NavigationMenuItem[],
      })
   })

   const roots: NavigationMenuItem[] = []

   adminRoutes.forEach((route) => {
      const item = menuMap.get(route.path)!
      const pathParts = route.path.split("/").filter(Boolean)

      let foundParent = false
      // Look for the closest parent in the menuMap (deeper than /admin)
      for (let i = pathParts.length - 1; i >= 2; i--) {
         const potentialParentPath = "/" + pathParts.slice(0, i).join("/")
         if (
            menuMap.has(potentialParentPath)
            && potentialParentPath !== route.path
         ) {
            menuMap.get(potentialParentPath)!.children!.push(item)
            foundParent = true
            break
         }
      }

      if (!foundParent) {
         roots.push(item)
      }
   })

   // Cleanup empty children arrays
   const formatMenu = (
      menuItems: NavigationMenuItem[]
   ): NavigationMenuItem[] => {
      return menuItems.map((item) => {
         const newItem = { ...item }
         if (newItem.children && newItem.children.length > 0) {
            newItem.children = formatMenu(newItem.children)
         } else {
            delete newItem.children
         }
         return newItem
      })
   }

   return [formatMenu(roots)]
})

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
