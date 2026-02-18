<script setup lang="ts">
import type { NuxtError } from "#app"
import type { BreadcrumbItem, NavigationMenuItem } from "#ui/types"

definePageMeta({
   middleware: ["auth-pages"],
})

const appStore = useAppStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const addresses = ref<DTO.Address[]>([])
async function fetchAddresses() {
   try {
      const response = await $api<API.Response<DTO.Address[]>>(
         `/api/addresses`,
         {
            method: "get",
         }
      )
      addresses.value = response.data
   } catch (error) {
      const err = error as NuxtError
      appStore.notify({
         title: err.statusMessage,
         description: err.message,
         color: "error",
      })
   }
}

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
               <ConsumerAddresses
                  v-if="addresses && selectedSection == 2"
                  :data="addresses"
               />
            </div>
         </div>
      </ClientOnly>
   </div>
</template>
