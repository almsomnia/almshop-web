<script setup lang="ts">
const props = defineProps<{
   data: DTO.Order
}>()
</script>

<template>
   <div>
      <div class="flex items-center">
         <p class="font-semibold">Order #{{ props.data.id }}</p>
         <UBadge
            :label="props.data.status"
            variant="soft"
            class="ms-2"
         />
         <div class="text-muted ms-auto text-sm">
            {{ $formatDate(props.data.createdAt) }}
         </div>
      </div>
      <div class="mt-4 flex">
         <div>
            <span class="text-muted text-sm leading-snug">Total</span>
            <p class="text-lg font-semibold">
               {{ $formatCurrency(props.data.totalPrice) }}
            </p>
         </div>
         <div
            v-if="$slots.actions"
            class="ms-auto self-end"
         >
            <slot
               name="actions"
               :item="props.data"
            />
         </div>
      </div>
   </div>
</template>
