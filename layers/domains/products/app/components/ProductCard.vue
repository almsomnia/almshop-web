<script setup lang="ts">
const props = defineProps<{
   data: DTO.Product
}>()
</script>

<template>
   <UCard
      :ui="{
         root: 'divide-y-0 ring-0 group overflow-hidden transition-all rounded-xl',
         header: 'p-2 sm:p-2',
         body: 'p-0 sm:p-0'
      }"
   >
      <template #header>
         <div class="bg-elevated dark:bg-muted relative aspect-square overflow-hidden rounded-lg">
            <img
               v-if="data.thumbnail"
               :src="$resolveStorageUrl(data.thumbnail.key)"
               :alt="data.name"
               class="h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-103"
            />
            <div
               v-else
               class="group flex h-full w-full items-center justify-center rounded-xl"
            >
               <UIcon
                  name="lucide:image"
                  class="text-muted size-12 group-hover:scale-105 transition"
               />
            </div>
            <div class="absolute top-2 right-2" @click.stop.prevent>
               <UButton
                  color="neutral"
                  variant="ghost"
                  icon="lucide:heart"
                  class="bg-default rounded-full backdrop-blur-sm"
               />
            </div>
         </div>
      </template>
      <div class="p-4">
         <div class="text-muted text-xs">
            {{ data.category?.name ?? "Uncategorized" }}
         </div>
         <h3 class="text-default truncate font-medium">
            {{ data.name }}
         </h3>
         <div class="mt-2 flex items-center justify-between">
            <span class="text-primary text-lg font-bold">
               {{ $formatCurrency(data.price) }}
            </span>
            <UBadge
               :label="data.stock"
               icon="lucide:package"
               variant="soft"
               color="neutral"
            />
         </div>
      </div>
   </UCard>
</template>
