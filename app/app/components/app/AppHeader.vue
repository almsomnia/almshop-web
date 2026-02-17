<script setup lang="ts">
import type { NuxtError } from "#app"
import type { NavigationMenuItem, DropdownMenuItem } from "#ui/types"
import { breakpointsTailwind } from "@vueuse/core"

const appStore = useAppStore()
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

const cartStore = useCartStore()

const userMenuItems = computed<DropdownMenuItem[]>(() => [
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
      to: "/logout",
      color: "error",
      onSelect: async () => {
         try {
            const response = await authStore.logout()
            appStore.notify({
               title: "Info",
               description: response.meta.message,
            })
            cartStore.$reset()
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
])

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
               <UPopover arrow>
                  <UChip
                     inset
                     size="3xl"
                     :text="cartStore.items.length"
                     :show="cartStore.items.length > 0"
                  >
                     <UButton
                        v-show="!!cartStore.cart"
                        icon="lucide:shopping-cart"
                        variant="ghost"
                        color="neutral"
                     />
                  </UChip>
                  <template #content>
                     <div class="divide-default min-w-sm divide-y">
                        <div
                           class="border-default flex items-center border-b px-4 py-2"
                        >
                           <span class="font-semibold">Cart</span>
                           <NuxtLink
                              to="/cart"
                              class="text-muted hover:text-highlighted ms-auto text-xs font-medium transition hover:underline"
                           >
                              See All
                           </NuxtLink>
                        </div>
                        <div
                           v-if="cartStore.items.length > 0"
                           class="max-h-64 space-y-1 overflow-y-auto p-2"
                        >
                           <NuxtLink
                              v-for="item in cartStore.items"
                              :key="item.id"
                              class="hover:bg-primary/5 flex items-center rounded-lg p-2 text-sm"
                              :to="`/products/${item.product.id}`"
                           >
                              <img
                                 v-if="item.product.thumbnail"
                                 :src="
                                    $resolveStorageUrl(
                                       item.product.thumbnail.key
                                    )
                                 "
                                 class="size-12 rounded-xl object-cover object-center"
                              />
                              <div
                                 v-else
                                 class="bg-muted flex size-12 items-center justify-center rounded-xl"
                              >
                                 <UIcon
                                    name="lucide:image"
                                    class="size-6"
                                 />
                              </div>
                              <div class="ms-2 flex-1">
                                 <p class="truncate font-medium">
                                    {{ item.product.name }}
                                 </p>
                                 <p class="text-muted truncate text-sm">
                                    {{ item.quantity }} x
                                    {{ $formatCurrency(item.product.price) }}
                                 </p>
                              </div>
                           </NuxtLink>
                        </div>
                        <UEmpty
                           v-else
                           variant="naked"
                           title="Your cart is empty"
                           icon="lucide:shopping-cart"
                           :actions="[
                              {
                                 label: 'Start Shopping',
                                 icon: 'lucide:shopping-cart',
                                 variant: 'soft',
                                 to: '/products',
                              },
                           ]"
                        />
                     </div>
                  </template>
               </UPopover>
               <UColorModeButton />
               <USeparator
                  class="mx-2 h-6"
                  orientation="vertical"
               />
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
                  <UDropdownMenu :items="userMenuItems">
                     <UUser
                        :name="authStore.user.name"
                        :description="authStore.user.email"
                        class="hover:bg-elevated cursor-pointer rounded-md px-2.5 py-1"
                     />
                  </UDropdownMenu>
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
