<script setup lang="ts">
import type { BreadcrumbItem, NavigationMenuItem } from "#ui/types"

definePageMeta({
   middleware: ["auth-pages"],
})

const authStore = useAuthStore()

const user = computed(() => authStore.user)
const consumer = computed(() =>
   user.value?.referenceType === "consumer"
      ? (user.value.reference as DTO.Consumer)
      : null
)

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

const sections = [
   {
      key: 1,
      label: "User Information",
      icon: "lucide:user",
   },
   {
      key: 2,
      label: "Addresses",
      icon: "lucide:map-pin",
   },
   {
      key: 3,
      label: "Orders",
      icon: "lucide:package",
   },
]

const selectedSection = shallowRef(1)
const currentSection = computed(() =>
   sections.find((section) => section.key == selectedSection.value)
)

const tabItems = computed<NavigationMenuItem[][]>(() => {
   return [
      sections.map((item) => {
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
</script>

<template>
   <div>
      <UPageHeader title="Profile">
         <template #headline>
            <UBreadcrumb :items="breadcrumbItems" />
         </template>
      </UPageHeader>
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
            <h2 class="mb-4 text-2xl font-semibold tracking-tight">
               {{ currentSection?.label }}
            </h2>
            <template v-if="selectedSection == 1">
               <div class="grid grid-cols-4 gap-8">
                  <div class="space-y-4">
                     <div
                        class="bg-elevated dark:bg-muted aspect-square h-auto w-full overflow-hidden rounded-xl"
                     >
                        <img
                           v-if="consumer?.profileImage"
                           :src="$resolveStorageUrl(consumer.profileImage)"
                           class="h-full w-full object-cover object-center"
                        />
                        <div
                           v-else
                           class="flex h-full w-full items-center justify-center"
                        >
                           <UIcon
                              name="lucide:user"
                              class="text-muted size-12"
                           />
                        </div>
                     </div>
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
                  </div>
                  <div class="col-span-3">
                     <div class="space-y-8">
                        <div class="flex items-baseline text-sm">
                           <span class="text-muted basis-32 font-medium">
                              Name
                           </span>
                           <p class="">
                              {{ user?.name }}
                           </p>
                        </div>
                        <div class="flex items-baseline text-sm">
                           <span class="text-muted basis-32 font-medium">
                              Email
                           </span>
                           <p class="">
                              {{ user?.email }}
                           </p>
                        </div>
                        <div class="flex items-baseline text-sm">
                           <span class="text-muted basis-32 font-medium">
                              Phone Number
                           </span>
                           <p class="">
                              <template v-if="consumer?.phoneNumber">
                                 {{ $formatPhoneNumber(consumer.phoneNumber) }}
                              </template>
                              <template v-else> &ndash; </template>
                           </p>
                        </div>
                        <div class="flex items-baseline text-sm">
                           <span class="text-muted basis-32 font-medium">
                              Date of Birth
                           </span>
                           <p class="">
                              <template v-if="consumer?.dob">
                                 {{ $formatDate(consumer.dob) }}
                              </template>
                              <template v-else> &ndash; </template>
                           </p>
                        </div>
                        <div class="flex items-baseline text-sm">
                           <span class="text-muted basis-32 font-medium">
                              Gender
                           </span>
                           <p class="">
                              <template v-if="consumer?.gender">
                                 {{ $parseGender(consumer.gender) }}
                              </template>
                              <template v-else> &ndash; </template>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </template>
         </div>
      </div>
   </div>
</template>
