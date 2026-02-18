<script setup lang="ts">
const props = defineProps<{
   data: DTO.Address[]
}>()

function renderRegion(address: DTO.Address) {
   const province = address.province.name
   const regency = address.regency.name
   const district = address.district.name
   const village = address.village.name
   return [village, district, regency, province].filter(Boolean).join(", ")
}
</script>

<template>
   <div>
      <div class="divide-default flex flex-col divide-y">
         <div
            v-for="address in props.data"
            :key="address.id"
            class="py-4 transition"
         >
            <div class="flex items-center">
               <h3 class="font-semibold">
                  {{ address.label }}
               </h3>
               <div class="ms-auto flex items-center">
                  <UTooltip text="Update">
                     <UButton
                        icon="lucide:edit"
                        size="xs"
                        variant="ghost"
                        color="neutral"
                        class="ms-2"
                     />
                  </UTooltip>
                  <UTooltip text="Delete">
                     <UButton
                        icon="lucide:trash"
                        size="xs"
                        variant="ghost"
                        color="error"
                        class="ms-2"
                        :disabled="address.isDefault"
                     />
                  </UTooltip>
                  <USeparator
                     orientation="vertical"
                     class="mx-4 h-6"
                  />
                  <UBadge
                     v-if="address.isDefault"
                     label="Default Address"
                     variant="subtle"
                  />
                  <UButton
                     v-else
                     label="Set as Default"
                     variant="outline"
                     color="neutral"
                  />
               </div>
            </div>
            <p class="text-muted mt-4 text-sm text-pretty">
               {{ address.address }}
            </p>
            <p class="text-muted mt-2 text-sm text-pretty">
               {{ renderRegion(address) }}
            </p>
         </div>
      </div>
   </div>
</template>
