<script setup lang="ts">
import type { NuxtError } from "#app"
import type { BreadcrumbItem } from "#ui/types"

definePageMeta({
   middleware: ["auth-pages"],
   pageName: "Cart",
})

type CartItem = DTO.Cart.Detail & {
   selected: boolean
}

const cartStore = useCartStore()
const appStore = useAppStore()
const authStore = useAuthStore()
const cartItems = ref<CartItem[]>([])

const selectedItems = computed(() => {
   return cartItems.value.filter((item) => item.selected)
})

const totalPrice = computed(() => {
   return selectedItems.value.reduce((acc, item) => {
      return acc + item.product.price * item.quantity
   }, 0)
})

const { wishlist, toggleWishlist } = useWishlist()
function isWishlisted(id: number) {
   return wishlist.value.includes(id)
}

const breadcrumbItems: BreadcrumbItem[] = [
   {
      label: "Home",
      to: "/",
   },
   {
      label: "Cart",
      to: "/cart",
   },
]

watch(
   () => cartStore.items,
   (value) => {
      cartItems.value = value.map((item) => {
         return {
            ...item,
            selected: false,
         }
      })
   },
   {
      immediate: true,
   }
)

const rootCheckboxValue = computed({
   get: () => {
      const items = cartItems.value
      if (items.length === 0) return false

      const selectedCount = items.filter((item) => item.selected).length

      if (selectedCount === 0) return false
      if (selectedCount === items.length) return true
      return "indeterminate"
   },
   set: (value) => {
      const isChecked = !!value
      cartItems.value.forEach((item) => (item.selected = isChecked))
   },
})

async function removeItemFromCart(id: number) {
   try {
      await cartStore.removeItemFromCart(id)
      appStore.notify({
         title: "Item removed",
         description: "The item has been removed from your cart.",
      })
   } catch (error) {
      const err = error as NuxtError
      appStore.notify({
         title: err.statusMessage,
         description: err.message,
         color: "error",
      })
   }
}

async function deleteItems() {
   appStore.showDialog(
      `Delete ${selectedItems.value.length} items`,
      h(resolveComponent("AppConfirmationPrompt"), {
         prompt: "The selected products will be deleted from your cart.",
         positiveButtonProps: {
            label: "Delete items",
            color: "error",
         },
         onPositive: async () => {
            try {
               const ids = selectedItems.value.map((item) => item.id)
               await cartStore.removeItemFromCart(...ids)
               appStore.notify({
                  title: "Items deleted",
                  description:
                     "All selected items have been removed from your cart.",
               })
               appStore.closeDialog()
            } catch (error) {
               const err = error as NuxtError
               appStore.notify({
                  title: err.statusMessage,
                  description: err.message,
                  color: "error",
               })
            }
         },
         onNegative: () => {
            appStore.closeDialog()
         },
      })
   )
}

const { data: addresses } = useApi(`/api/addresses`, {
   server: false,
   method: "get",
   transform: (res) => {
      selectedAddress.value = res.data.find((address) => address.isDefault)
      return res.data
   },
})
const selectedAddress = shallowRef<DTO.Address>()

async function checkout() {
   try {
      if (!authStore.user) {
         navigateTo("/login")
         return
      }

      if (!selectedAddress.value) {
         appStore.notify({
            title: "No address selected",
            description: "Please select an address to checkout.",
            color: "error",
         })
         return
      }

      const payload: InferSchema<typeof $orderSchema, "base"> = {
         userId: authStore.user.id,
         addressId: selectedAddress.value.id,
         items: selectedItems.value.map((item) => {
            return {
               productId: item.productId,
               quantity: item.quantity,
            }
         }),
      }

      const response = await $api(`/api/orders`, {
         method: "post",
         body: payload,
      })

      appStore.notify({
         title: "Order created",
         description: response.meta.message,
      })

      navigateTo(`/profile?tab=3`)
      cartStore.fetchCart()
   } catch (error) {
      const err = error as NuxtError
      appStore.notify({
         title: err.statusMessage,
         description: err.message,
         color: "error",
      })
   }
}
</script>

<template>
   <div>
      <ClientOnly>
         <UPageHeader title="Cart">
            <template #headline>
               <UBreadcrumb :items="breadcrumbItems" />
            </template>
         </UPageHeader>
         <div class="grid grid-cols-3 items-start gap-8 *:w-full">
            <div class="col-span-2">
               <template v-if="cartStore.items.length > 0">
                  <div class="mb-6 flex items-center px-2">
                     <UCheckbox
                        v-model="rootCheckboxValue"
                        label="Select All"
                     />
                     <UButton
                        color="error"
                        variant="ghost"
                        icon="lucide:trash"
                        label="Delete"
                        class="ms-auto"
                        :disabled="!rootCheckboxValue"
                        @click="deleteItems"
                     />
                  </div>
                  <div class="divide-default divide-y">
                     <div
                        v-for="item in cartItems"
                        :key="item.id"
                        class="p-4"
                     >
                        <div class="flex gap-4">
                           <UCheckbox
                              class="mt-0.5"
                              v-model="item.selected"
                           />
                           <div
                              class="bg-elevated dark:bg-muted aspect-square size-16 overflow-hidden rounded-lg"
                           >
                              <img
                                 v-if="item.product.thumbnail"
                                 :src="
                                    $resolveStorageUrl(
                                       item.product.thumbnail.key
                                    )
                                 "
                                 :alt="item.product.name"
                                 class="h-full w-full object-cover object-center transition-transform"
                              />
                              <div
                                 v-else
                                 class="group flex h-full w-full items-center justify-center"
                              >
                                 <UIcon
                                    name="lucide:image"
                                    class="text-muted size-6"
                                 />
                              </div>
                           </div>
                           <div class="flex flex-1">
                              <div class="flex-1">
                                 <NuxtLink
                                    :to="`/products/${item.product.id}`"
                                    class="inline-block"
                                 >
                                    <h3 class="line-clamp-2 hover:underline">
                                       {{ item.product.name }}
                                    </h3>
                                 </NuxtLink>
                              </div>
                              <div class="ms-4">
                                 <p
                                    class="mb-1.5 text-end leading-relaxed font-semibold"
                                 >
                                    {{ $formatCurrency(item.product.price) }}
                                 </p>
                                 <div
                                    class="flex items-center justify-end gap-1"
                                 >
                                    <UButton
                                       variant="ghost"
                                       color="neutral"
                                       :icon="
                                          isWishlisted(item.product.id)
                                             ? 'mdi:heart'
                                             : 'lucide:heart'
                                       "
                                       @click="toggleWishlist(item.product.id)"
                                    />
                                    <UButton
                                       variant="ghost"
                                       color="error"
                                       icon="lucide:trash"
                                       @click="removeItemFromCart(item.id)"
                                    />
                                    <UInputNumber
                                       v-model="item.quantity"
                                       :min="1"
                                       :max="item.product.stock"
                                       class="ms-2 max-w-24"
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </template>
               <UEmpty
                  v-else
                  title="Your cart is empty"
                  description="Fill your cart with your favorite items."
                  icon="heroicons:shopping-cart"
                  :actions="[
                     {
                        label: 'Shop Now',
                        color: 'primary',
                        icon: 'heroicons:shopping-cart',
                        to: '/products',
                     },
                  ]"
               />
            </div>
            <div class="sticky top-24">
               <UCard class="mb-4">
                  <template #header>
                     <h2 class="font-semibold">Delivery Address</h2>
                  </template>
                  <DetailAddress
                     v-if="selectedAddress"
                     :data="selectedAddress"
                  >
                     <template #actions>
                        <UPopover>
                           <UButton
                              label="Change Address"
                              size="sm"
                              variant="outline"
                              icon="lucide:edit"
                           />
                           <template #content>
                              <div
                                 class="max-h-128 space-y-1 overflow-y-auto p-4"
                              >
                                 <DetailAddress
                                    v-for="address in addresses"
                                    :key="address.id"
                                    :data="address"
                                    class="cursor-pointer rounded-lg p-4 transition"
                                    :class="[
                                       selectedAddress?.id == address.id
                                          ? 'bg-accented/75'
                                          : 'hover:bg-muted',
                                    ]"
                                    @click="selectedAddress = address"
                                 >
                                    <template #actions>
                                       <UIcon
                                          name="lucide:check"
                                          v-show="
                                             selectedAddress?.id == address.id
                                          "
                                       />
                                    </template>
                                 </DetailAddress>
                              </div>
                           </template>
                        </UPopover>
                     </template>
                  </DetailAddress>
               </UCard>
               <UCard>
                  <template #header>
                     <h2 class="font-semibold">Order Summary</h2>
                  </template>
                  <div
                     v-if="selectedItems.length > 0"
                     class="space-y-2"
                  >
                     <div
                        v-for="item in selectedItems"
                        :key="item.id"
                        class="flex items-baseline gap-2"
                     >
                        <div class="">
                           <p class="text-sm font-medium">
                              {{ item.product.name }}
                           </p>
                           <p class="text-muted text-sm">
                              {{ item.quantity }} &times;
                              {{ $formatCurrency(item.product.price) }}
                           </p>
                        </div>
                        <div class="ms-auto">
                           <p class="text-sm font-medium">
                              {{
                                 $formatCurrency(
                                    item.product.price * item.quantity
                                 )
                              }}
                           </p>
                        </div>
                     </div>
                  </div>
                  <UEmpty
                     v-else
                     title="No items selected"
                     description="Select items from the cart to checkout."
                     icon="lucide:x"
                     variant="naked"
                  />
                  <template #footer>
                     <div class="flex items-baseline">
                        <p class="text-sm">Total</p>
                        <p class="ms-auto font-semibold">
                           {{ $formatCurrency(totalPrice) }}
                        </p>
                     </div>
                     <UButton
                        label="Checkout"
                        icon="lucide:shopping-cart"
                        color="primary"
                        block
                        class="mt-4"
                        :disabled="selectedItems.length === 0"
                        @click="checkout"
                     />
                  </template>
               </UCard>
            </div>
         </div>
      </ClientOnly>
   </div>
</template>
