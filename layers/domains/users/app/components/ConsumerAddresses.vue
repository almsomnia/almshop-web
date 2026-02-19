<script setup lang="ts">
const props = defineProps<{
   data: DTO.Address[]
}>()

const emit = defineEmits<{
   "update:default": [data: DTO.Address]
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
            class="px-2 py-4 transition"
         >
            <DetailAddress :data="address">
               <template #actions>
                  <slot
                     name="actions"
                     :item="address"
                  />
               </template>
            </DetailAddress>
         </div>
      </div>
   </div>
</template>
