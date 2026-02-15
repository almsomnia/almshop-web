<script setup lang="ts">
import type { NavigationMenuItem } from "#ui/types"
import { breakpointsTailwind } from "@vueuse/core"

const authStore = useAuthStore()
const appConfig = useAppConfig()
const appTitle = computed<string>(() => (appConfig.app as any).title)

const isMounted = shallowRef(false)

const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanMd = computed(() => {
   if (!isMounted.value) return true
   return breakpoints.greater("md").value
})

const menuItems: NavigationMenuItem[] = [
   {
      label: "Shop All",
      to: "/products",
   },
   {
      label: "Categories",
      to: "/categories",
   },
   {
      label: "About",
      to: "/about",
   },
]

onMounted(() => {
   isMounted.value = true
})
</script>

<template>
   <UHeader
      :title="appTitle"
      :ui="{
         title: 'uppercase tracking-widest font-medium',
      }"
   >
      <template #right>
         <ClientOnly>
            <template v-if="largerThanMd">
               <UColorModeButton />
               <template v-if="!authStore.user">
                  <UButton
                     label="Login"
                     icon="lucide:log-in"
                     variant="outline"
                     color="neutral"
                     @click="navigateTo(`/login`)"
                  />
                  <UButton
                     label="Register"
                     icon="lucide:user-plus"
                  />
               </template>
               <template v-else>
                  <UUser
                     :name="authStore.user.name"
                     :description="authStore.user.email"
                  />
               </template>
            </template>
         </ClientOnly>
      </template>
      <UNavigationMenu
         :items="menuItems"
         variant="link"
      />
      <template #body>
         <UNavigationMenu
            :items="menuItems"
            orientation="vertical"
         />
      </template>
   </UHeader>
</template>
