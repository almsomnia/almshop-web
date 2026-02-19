<script setup lang="ts">
const props = defineProps<{
   data: DTO.Address
}>()

const region = computed(() => {
   const province = props.data.province.name
   const regency = props.data.regency.name
   const district = props.data.district.name
   const village = props.data.village.name
   return [village, district, regency, province].filter(Boolean).join(", ")
})
</script>

<template>
   <div>
      <div class="flex items-center">
         <p class="font-semibold">
            {{ props.data.label }}
         </p>
         <div
            v-if="$slots.actions"
            class="ms-auto flex items-center"
         >
            <slot
               name="actions"
               :item="props.data"
            />
         </div>
      </div>
      <p class="text-muted mt-2 line-clamp-2 text-sm text-pretty">
         {{ props.data.address }}
      </p>
      <p class="text-muted text-sm text-pretty">
         {{ region }}
      </p>
   </div>
</template>
