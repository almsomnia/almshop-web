<script setup lang="ts">
definePageMeta({
   pageName: "Order Detail",
   hideOnSidebar: true,
})

const route = useRoute()

const { data, pending, refresh } = useApi(`/api/orders/${route.params.id}`, {
   method: "get",
   transform: (res) => res.data,
})
</script>

<template>
   <div class="flex gap-8">
      <div class="w-[55%]">
         <h2 class="text-lg font-semibold">Order Items</h2>
         <div class="divide-default mt-4 flex flex-col divide-y">
            <div
               v-for="item in data?.orderDetails"
               :key="item.id"
               class="p-4"
            >
               <div class="flex gap-4">
                  <div>
                     <p class="line-clamp-2 font-medium">
                        {{ item.productName }}
                     </p>
                  </div>
                  <div class="ms-auto">
                     <p class="text-muted text-sm text-nowrap">
                        {{ item.quantity }} x {{ $formatCurrency(item.price) }}
                     </p>
                     <p class="text-end font-medium text-nowrap">
                        {{ $formatCurrency(item.price * item.quantity) }}
                     </p>
                  </div>
               </div>
               <div class="mt-4 flex items-center gap-1">
                  <UButton
                     label="View Product"
                     size="sm"
                     variant="soft"
                     icon="lucide:package"
                     :to="`/admin/products/${item.productId}`"
                  />
               </div>
            </div>
         </div>
      </div>
      <div class="w-[45%]">
         <UCard>
            <template #header>
               <h2 class="font-semibold">Order Information</h2>
            </template>
            <div class="items baseline flex">
               <template v-if="pending">
                  <USkeleton class="h-10 w-10" />
               </template>
               <template v-else-if="data">
                  <UUser
                     :name="data?.user.name"
                     :description="data.user.email"
                     :avatar="{
                        text: data.user.name.charAt(0),
                     }"
                  />
                  <div class="ms-auto">
                     <UBadge
                        :label="data.status"
                        variant="subtle"
                     />
                  </div>
               </template>
            </div>
            <div class="mt-4 space-y-2 text-sm sm:mt-6">
               <template v-if="pending">
                  <div
                     v-for="n in 5"
                     class="flex items-center"
                  >
                     <USkeleton class="h-3.5 w-24" />
                     <USkeleton class="ms-auto h-3.5 w-64" />
                  </div>
               </template>
               <template v-else-if="data">
                  <div class="flex items-baseline">
                     <p class="text-muted">Order ID</p>
                     <div class="ms-auto">
                        <p class="text-end">#{{ data?.id }}</p>
                     </div>
                  </div>
                  <div class="flex items-baseline">
                     <p class="text-muted">Order Date</p>
                     <div class="ms-auto">
                        <p class="text-end">
                           {{ $formatDate(data.createdAt) }}
                        </p>
                     </div>
                  </div>
               </template>
            </div>
            <USeparator class="my-4" />
            <div
               class=""
               v-if="data"
            >
               <h3 class="mb-4 text-sm font-semibold">Shipping Information</h3>
               <div class="space-y-2 text-sm">
                  <div class="flex items-baseline">
                     <p class="basis-40">Courier Provider</p>
                     <div class="flex flex-1 gap-2 before:content-[':']">
                        <p class="text-dimmed italic">
                           No information provided
                        </p>
                     </div>
                  </div>
                  <div class="flex items-baseline">
                     <p class="basis-40">Tracking Number</p>
                     <div class="flex flex-1 gap-2 before:content-[':']">
                        <p class="text-dimmed italic">
                           No information provided
                        </p>
                     </div>
                  </div>
                  <div class="flex items-baseline">
                     <p class="basis-40">Address</p>
                     <div class="flex flex-1 gap-2 before:content-[':']">
                        <DetailAddress
                           :data="data.address"
                           hide-label
                        />
                     </div>
                  </div>
               </div>
            </div>
            <USeparator class="my-4" />
            <div class="">
               <h3 class="mb-4 text-sm font-semibold">Payment Detail</h3>
               <div class="space-y-2 text-sm">
                  <template v-if="pending">
                     <div
                        v-for="n in 5"
                        class="flex items-center"
                     >
                        <USkeleton class="h-3.5 w-24" />
                        <USkeleton class="ms-auto h-3.5 w-64" />
                     </div>
                  </template>
                  <template v-else-if="data">
                     <div class="flex items-baseline">
                        <p class="text-muted">Items Subtotal</p>
                        <div class="ms-auto">
                           <p class="text-end">
                              {{ $formatCurrency(data.totalPrice) }}
                           </p>
                        </div>
                     </div>
                     <div
                        class="text-highlighted mt-6 flex items-baseline text-base font-medium"
                     >
                        <p>Total</p>
                        <div class="ms-auto">
                           <p class="text-end">
                              {{ $formatCurrency(data.totalPrice) }}
                           </p>
                        </div>
                     </div>
                  </template>
               </div>
            </div>
         </UCard>
      </div>
   </div>
</template>
