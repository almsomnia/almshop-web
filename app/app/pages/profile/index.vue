<script setup lang="ts">
import type { NuxtError } from "#app"
import type { BreadcrumbItem, NavigationMenuItem } from "#ui/types"

definePageMeta({
   middleware: ["auth-pages"],
})

const appStore = useAppStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const { data: addresses, refresh: fetchAddresses } = useApi(`/api/addresses`, {
   method: "get",
   transform: (res) => res.data,
   default: () => [],
   immediate: false,
})

const { data: orders, refresh: fetchOrders } = useApi(`/api/orders`, {
   method: "get",
   transform: (res) => res.data.items,
   default: () => [],
   immediate: false,
})

const breadcrumbItems: BreadcrumbItem[] = [
   {
      label: "Home",
      to: "/",
   },
   {
      label: "Profile",
      to: "/profile",
   },
]

const sections = computed(() => [
   {
      key: 1,
      label: "User Information",
      icon: "lucide:user",
   },
   {
      key: 2,
      label: "Addresses",
      icon: "lucide:map-pin",
      actions: [
         h(resolveComponent("UButton"), {
            label: "Add Address",
            icon: "lucide:plus",
            onClick: () => openAddressForm(),
         }),
      ],
   },
   {
      key: 3,
      label: "Orders",
      icon: "lucide:package",
   },
])

const selectedSection = shallowRef(1)
const currentSection = computed(() =>
   sections.value.find((section) => section.key == selectedSection.value)
)

const tabItems = computed<NavigationMenuItem[][]>(() => {
   return [
      sections.value.map((item) => {
         return {
            ...item,
            active: selectedSection.value == item.key,
            onSelect: () => {
               selectedSection.value = item.key
            },
         }
      }),
   ]
})

watch(selectedSection, async (value) => {
   if (value == 2) {
      if (addresses.value.length > 0) return
      await fetchAddresses()
   } else if (value == 3) {
      if (orders.value.length > 0) return
      await fetchOrders()
   }
})

type RegionSelectorProp = {
   modelValue: string | null
   "onUpdate:modelValue": (value: string | null) => void
   loading: boolean
   disabled: boolean
}

function openAddressForm(data?: DTO.Address) {
   const apiHandler = data
      ? (values: InferSchema<typeof $addressSchema, "base">) =>
           $api(`/api/addresses/${data.id}`, {
              method: "patch",
              body: values,
           })
      : (values: InferSchema<typeof $addressSchema, "base">) =>
           $api(`/api/addresses`, {
              method: "post",
              body: values,
           })

   const form = h(
      resolveComponent("FormAddress"),
      {
         consumerId: user.value?.referenceId,
         data,
         onSubmit: async (
            values: InferSchema<typeof $addressSchema, "base">
         ) => {
            try {
               const response = await apiHandler(values)
               appStore.notify({
                  title: "Success",
                  description: response.meta.message,
               })
               appStore.closeDialog()
               await fetchAddresses()
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
      {
         "province-selector": (slotProps: RegionSelectorProp) =>
            h(resolveComponent("SelectProvince"), {
               modelValue: slotProps.modelValue,
               "onUpdate:modelValue": slotProps["onUpdate:modelValue"],
               clear: true,
               loading: slotProps.loading,
               disabled: slotProps.disabled,
            }),
         "regency-selector": (
            slotProps: RegionSelectorProp & { provinceCode: string | null }
         ) =>
            h(resolveComponent("SelectRegency"), {
               modelValue: slotProps.modelValue,
               "onUpdate:modelValue": slotProps["onUpdate:modelValue"],
               provinceCode: slotProps.provinceCode,
               clear: true,
               loading: slotProps.loading,
               disabled: slotProps.disabled,
            }),
         "district-selector": (
            slotProps: RegionSelectorProp & { regencyCode: string | null }
         ) =>
            h(resolveComponent("SelectDistrict"), {
               modelValue: slotProps.modelValue,
               "onUpdate:modelValue": slotProps["onUpdate:modelValue"],
               regencyCode: slotProps.regencyCode,
               clear: true,
               loading: slotProps.loading,
               disabled: slotProps.disabled,
            }),
         "village-selector": (
            slotProps: RegionSelectorProp & { districtCode: string | null }
         ) =>
            h(resolveComponent("SelectVillage"), {
               modelValue: slotProps.modelValue,
               "onUpdate:modelValue": slotProps["onUpdate:modelValue"],
               districtCode: slotProps.districtCode,
               clear: true,
               loading: slotProps.loading,
               disabled: slotProps.disabled,
            }),
      }
   )
   appStore.showDialog("Address Form", form)
}

function deleteAddress(data: DTO.Address) {
   appStore.showDialog(
      "Confirm Delete",
      h(resolveComponent("AppConfirmationPrompt"), {
         prompt: "Are you sure you want to delete this address?",
         positiveButtonProps: {
            label: "Delete",
            color: "error",
            icon: "lucide:trash",
         },
         onPositive: async () => {
            try {
               await $api(`/api/addresses/${data.id}`, {
                  method: "delete",
               })
               await fetchAddresses()
               appStore.notify({
                  title: "Success",
                  description: "Address deleted successfully",
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
      })
   )
}

async function setAddressAsDefault(data: DTO.Address) {
   try {
      await $api(`/api/addresses/${data.id}`, {
         method: "patch",
         body: {
            isDefault: true,
         },
      })
      await fetchAddresses()
      appStore.notify({
         title: "Success",
         description: "Address set as default successfully",
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
}

const route = useRoute()
onMounted(() => {
   if (route.query.tab) {
      selectedSection.value = Number(route.query.tab)
   }
})
</script>

<template>
   <div>
      <UPageHeader title="Profile">
         <template #headline>
            <UBreadcrumb :items="breadcrumbItems" />
         </template>
      </UPageHeader>
      <ClientOnly>
         <div class="grid grid-cols-4 items-start gap-8">
            <UCard class="sticky top-[calc(var(--ui-header-height)+1rem)]">
               <template #header>
                  <div class="flex items-center gap-4">
                     <UAvatar
                        :text="user?.name.charAt(0)"
                        size="2xl"
                     />
                     <div>
                        <p class="font-semibold">{{ user?.name }}</p>
                        <p class="text-muted text-sm">{{ user?.email }}</p>
                     </div>
                  </div>
               </template>
               <UNavigationMenu
                  :items="tabItems"
                  orientation="vertical"
               />
            </UCard>
            <div class="col-span-3">
               <div class="mb-4 flex items-center">
                  <h2 class="text-2xl font-semibold tracking-tight">
                     {{ currentSection?.label }}
                  </h2>
                  <div
                     v-if="currentSection?.actions"
                     class="ms-auto"
                  >
                     <component
                        v-for="(action, index) in currentSection.actions"
                        :key="index"
                        :is="action"
                        class="ms-2 first:ms-0"
                     />
                  </div>
               </div>
               <ConsumerProfile
                  v-if="user && selectedSection == 1"
                  :user="user"
               >
                  <template #actions:after-image>
                     <div class="space-y-2">
                        <UButton
                           label="Upload Image"
                           icon="lucide:upload"
                           block
                        />
                        <p class="text-muted text-center text-xs">
                           JPG, PNG, WEBP (max. 2MB)
                        </p>
                     </div>
                     <USeparator class="mt-8" />
                     <UButton
                        label="Change Password"
                        color="neutral"
                        variant="outline"
                        icon="lucide:lock"
                        block
                     />
                  </template>
               </ConsumerProfile>
               <div
                  v-if="selectedSection == 2"
                  class="divide-default flex flex-col divide-y"
               >
                  <div
                     v-for="address in addresses"
                     :key="address.id"
                     class="px-2 py-4 transition"
                  >
                     <DetailAddress :data="address">
                        <template #actions="{ item }">
                           <UTooltip text="Update">
                              <UButton
                                 icon="lucide:edit"
                                 size="xs"
                                 variant="ghost"
                                 color="neutral"
                                 class="ms-2"
                                 @click="openAddressForm(item)"
                              />
                           </UTooltip>
                           <UTooltip text="Delete">
                              <UButton
                                 icon="lucide:trash"
                                 size="xs"
                                 variant="ghost"
                                 color="error"
                                 class="ms-2"
                                 :disabled="item.isDefault"
                                 @click="deleteAddress(item)"
                              />
                           </UTooltip>
                           <USeparator
                              orientation="vertical"
                              class="mx-4 h-6"
                           />
                           <UBadge
                              v-if="item.isDefault"
                              label="Default Address"
                              variant="subtle"
                           />
                           <UButton
                              v-else
                              label="Set as Default"
                              variant="outline"
                              color="neutral"
                              @click="setAddressAsDefault(item)"
                           />
                        </template>
                     </DetailAddress>
                  </div>
               </div>
               <div
                  v-if="selectedSection === 3"
                  class="divide-default flex flex-col divide-y"
               >
                  <div
                     v-for="order in orders"
                     :key="order.id"
                     class="px-2 py-4"
                  >
                     <ListOrderItem :data="order">
                        <template #actions="{ item }">
                           <UTooltip text="Detail">
                              <UButton
                                 color="neutral"
                                 icon="lucide:eye"
                                 variant="ghost"
                              />
                           </UTooltip>
                        </template>
                     </ListOrderItem>
                  </div>
               </div>
            </div>
         </div>
      </ClientOnly>
   </div>
</template>
