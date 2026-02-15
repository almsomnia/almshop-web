<script setup lang="ts">
definePageMeta({
   pageName: "About Us",
})

const stats = [
   { label: "Founded", value: "2024" },
   { label: "Products", value: "5000+" },
   { label: "Happy Customers", value: "10k+" },
   { label: "Team Members", value: "50+" },
]
</script>

<template>
   <UContainer class="py-12">
      <div class="grid gap-16 lg:grid-cols-2 lg:items-center">
         <div class="space-y-6">
            <UBadge
               label="Our Story"
               variant="soft"
               size="lg"
               class="mb-4"
            />
            <h1 class="text-4xl font-bold tracking-tight sm:text-5xl text-highlighted">
               Crafting the Future of Modern E-Commerce
            </h1>
            <p class="text-muted text-lg leading-relaxed text-pretty">
               Almshop started with a simple vision: to provide a curated
               selection of high-quality products that blend style,
               functionality, and sustainability. We believe that shopping
               should be an inspiring journey, not just a transaction.
            </p>
            <p class="text-muted text-lg leading-relaxed text-pretty">
               Our team works tirelessly to source the best materials and
               partner with ethical manufacturers to ensure that every item we
               sell meets our rigorous standards.
            </p>
            <div class="grid grid-cols-2 gap-8 pt-4">
               <div
                  v-for="stat in stats"
                  :key="stat.label"
                  class="space-y-1"
               >
                  <p class="text-primary text-3xl font-bold">
                     {{ stat.value }}
                  </p>
                  <p
                     class="text-muted text-sm font-medium tracking-wide uppercase"
                  >
                     {{ stat.label }}
                  </p>
               </div>
            </div>
         </div>
         <div
            class="relative aspect-square overflow-hidden rounded-3xl lg:aspect-auto lg:h-[600px]"
         >
            <img
               src="/img/hero-1.jpg"
               alt="Our team working"
               class="h-full w-full object-cover"
            />
            <div
               class="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent"
            />
         </div>
      </div>

      <div class="mt-24 grid gap-12 md:grid-cols-3">
         <div class="space-y-4">
            <div
               class="bg-primary/10 flex size-12 items-center justify-center rounded-xl"
            >
               <UIcon
                  name="lucide:shield-check"
                  class="text-primary size-6"
               />
            </div>
            <h3 class="text-xl font-bold">Quality First</h3>
            <p class="text-muted">
               We never compromise on quality. Every product is hand-picked and
               tested to ensure longevity and performance.
            </p>
         </div>
         <div class="space-y-4">
            <div
               class="bg-primary/10 flex size-12 items-center justify-center rounded-xl"
            >
               <UIcon
                  name="lucide:truck"
                  class="text-primary size-6"
               />
            </div>
            <h3 class="text-xl font-bold">Fast Delivery</h3>
            <p class="text-muted">
               Global shipping made easy. We partner with leading logistics
               providers to get your orders to you as quickly as possible.
            </p>
         </div>
         <div class="space-y-4">
            <div
               class="bg-primary/10 flex size-12 items-center justify-center rounded-xl"
            >
               <UIcon
                  name="lucide:headset"
                  class="text-primary size-6"
               />
            </div>
            <h3 class="text-xl font-bold">24/7 Support</h3>
            <p class="text-muted">
               Our dedicated support team is always here to help you with any
               questions or concerns you might have.
            </p>
         </div>
      </div>
   </UContainer>
</template>
