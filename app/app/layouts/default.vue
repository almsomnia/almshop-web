<script setup lang="ts">
const currentDate = Date.now()
</script>

<template>
   <div>
      <AppHeader />
      <UMain>
         <slot />
      </UMain>
      <USeparator />
      <UFooter
         :ui="{
            container: 'max-w-full',
         }"
      >
         <template #top>
            <UContainer class="max-w-full">
               <div
                  class="flex flex-col justify-baseline lg:flex-row lg:justify-between"
               >
                  <div>
                     <h2 class="text-3xl font-bold">Join Our Newsletter</h2>
                     <p class="text-dimmed dark:text-muted mt-1 text-lg">
                        Subscribe to get special offers, free giveaways, and
                        once-in-a-lifetime deals.
                     </p>
                  </div>
                  <div
                     class="mt-4 flex w-full justify-end self-end-safe lg:mt-0 lg:w-auto"
                  >
                     <UForm class="w-full lg:w-auto">
                        <UFieldGroup class="w-full">
                           <UInput
                              placeholder="Enter your email"
                              size="lg"
                              color="neutral"
                              class="w-full lg:w-xs"
                           />
                           <UButton
                              label="Subscribe"
                              size="lg"
                              color="neutral"
                           />
                        </UFieldGroup>
                     </UForm>
                  </div>
               </div>
            </UContainer>
         </template>
         <template #left>
            <p class="text-muted text-sm">
               &copy;
               <NuxtTime
                  :datetime="currentDate"
                  year="numeric"
               />
               Almshop
            </p>
         </template>
      </UFooter>
   </div>
</template>
