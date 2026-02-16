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
   type MenuItem = NavigationMenuItem & { order: number }

   const menuMap = new Map<string, MenuItem>()
   const virtualParents = new Map<string, MenuItem>()
   const routesByPageName = new Map<string, (typeof adminRoutes)[0]>()

   adminRoutes.forEach((route) => {
      if (route.meta.pageName) {
         routesByPageName.set(route.meta.pageName as string, route)
      }

      menuMap.set(route.path, {
         label: (route.meta.pageName as string) ?? route.path,
         to: route.path,
         icon: route.meta.pageIcon as string,
         children: [] as NavigationMenuItem[],
         order: (route.meta.pageOrder as number) ?? 0,
      })
   })

   const roots: MenuItem[] = []

   adminRoutes.forEach((route) => {
      const item = menuMap.get(route.path)!
      const meta = route.meta as any
      let parentItem: MenuItem | undefined

      // 1. Group by meta.parent
      if (meta.parent) {
         const pName = meta.parent.pageName
         const pRoute = routesByPageName.get(pName)
         if (pRoute && pRoute.path !== route.path) {
            parentItem = menuMap.get(pRoute.path)
         } else if (pName !== meta.pageName) {
            if (!virtualParents.has(pName)) {
               const vp: MenuItem = {
                  label: pName,
                  icon: meta.parent.pageIcon,
                  children: [] as NavigationMenuItem[],
                  order: meta.parent.pageOrder ?? 0,
               }
               virtualParents.set(pName, vp)
               roots.push(vp)
            }

            parentItem = virtualParents.get(pName)
         }
      }

      // 2. Fallback to path-based nesting
      if (!parentItem) {
         const pathParts = route.path.split("/").filter(Boolean)
         for (let i = pathParts.length - 1; i >= 2; i--) {
            const potentialParentPath = "/" + pathParts.slice(0, i).join("/")
            if (
               menuMap.has(potentialParentPath)
               && potentialParentPath !== route.path
            ) {
               parentItem = menuMap.get(potentialParentPath)
               break
            }
         }
      }

      if (parentItem) {
         parentItem.children!.push(item)
      } else {
         // Check if already added as virtual parent
         if (!virtualParents.has((meta.pageName as string) ?? "")) {
            roots.push(item)
         }
      }
   })

   const formatMenu = (menuItems: MenuItem[]): NavigationMenuItem[] => {
      return menuItems
         .sort((a, b) => a.order - b.order)
         .map((item) => {
            const { order: _, ...rest } = item
            if (rest.children && rest.children.length > 0) {
               rest.children = formatMenu(rest.children as MenuItem[])
            } else {
               delete rest.children
            }
            return rest
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
