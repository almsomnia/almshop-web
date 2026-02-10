<script setup lang="ts">
const { dialog } = useAppStore()
</script>

<template>
   <div>
      <NuxtRouteAnnouncer />
      <NuxtLoadingIndicator />
      <UApp>
         <NuxtLayout>
            <NuxtPage />
         </NuxtLayout>
         <ClientOnly>
            <UModal
               v-model:open="dialog.show"
               :title="dialog.title"
               :ui="{
                  content: `max-w-${dialog.width}`,
               }"
            >
               <template #body>
                  <component :is="dialog.component" />
               </template>
            </UModal>
         </ClientOnly>
      </UApp>
   </div>
</template>
