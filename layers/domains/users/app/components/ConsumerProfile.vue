<script setup lang="ts">
const props = defineProps<{
   user: DTO.User
}>()

const consumer = computed<DTO.Consumer | null>(() => {
   return props.user.referenceType === "consumer" ? props.user.reference : null
})
</script>

<template>
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
         <slot
            name="actions:after-image"
            :user="props.user"
            :consumer="consumer"
         />
      </div>
      <div class="col-span-3">
         <div class="space-y-8">
            <div class="flex items-baseline text-sm">
               <span class="text-muted basis-32 font-medium"> Name </span>
               <p class="">
                  {{ props.user?.name }}
               </p>
            </div>
            <div class="flex items-baseline text-sm">
               <span class="text-muted basis-32 font-medium"> Email </span>
               <p class="">
                  {{ props.user?.email }}
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
               <span class="text-muted basis-32 font-medium"> Gender </span>
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
