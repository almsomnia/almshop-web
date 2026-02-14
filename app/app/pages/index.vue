<script setup lang="ts">
const { data: products, refresh: refreshProducts } = await useApi(
   "/api/products",
   {
      method: "get",
      query: { perPage: 8 },
      transform: (res) => res.data.items,
   }
)

const { data: categories, refresh: refreshCategories } = await useApi(
   "/api/categories",
   {
      method: "get",
      transform: (res) => res.data.items,
   }
)

const featuredProducts = computed(() => products.value ?? [])
const allCategories = computed(() => categories.value ?? [])

function refresh() {
   refreshProducts()
   refreshCategories()
}

const heroImages = ["/img/hero-1.jpg", "/img/hero-2.jpg", "/img/hero-3.jpg"]
</script>

<template>
   <div class="space-y-12 pb-12">
      <section class="relative h-[70dvh] overflow-hidden">
         <UCarousel
            v-slot="{ item }"
            :items="heroImages"
            autoplay
            loop
            :ui="{
               root: 'h-full',
               item: 'h-full relative',
               viewport: 'h-full',
               container: 'h-full',
            }"
         >
            <div class="absolute inset-0 ps-4">
               <div class="h-full w-full rounded-2xl bg-neutral-950/60" />
            </div>
            <img
               :src="item"
               class="h-full w-full rounded-2xl object-cover object-center"
               draggable="false"
            />
         </UCarousel>
         <div
            class="pointer-events-none absolute inset-0 flex items-center justify-center"
         >
            <div
               class="pointer-events-auto max-w-2xl px-4 text-center text-white"
            >
               <h1 class="mb-4 text-4xl font-bold md:text-6xl">
                  Discover Your Style
               </h1>
               <p class="mb-8 text-lg md:text-xl">
                  Explore our curated collection of premium products designed
                  for your lifestyle.
               </p>
               <UButton
                  size="xl"
                  color="white"
                  label="Shop Now"
                  icon="lucide:shopping-bag"
                  to="/products"
               />
            </div>
         </div>
      </section>
      <UContainer class="space-y-16">
         <section v-if="allCategories.length > 0">
            <div class="mb-8 flex items-center justify-between">
               <div>
                  <h2 class="text-2xl font-bold tracking-tight">
                     Shop by Category
                  </h2>
                  <p class="text-muted">Find what you're looking for faster.</p>
               </div>
               <UButton
                  variant="link"
                  label="View All"
                  trailing-icon="lucide:chevron-right"
                  color="neutral"
               />
            </div>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
               <NuxtLink
                  v-for="category in allCategories.slice(0, 6)"
                  :key="category.id"
                  :to="`/categories/${category.id}`"
                  class="group hover:border-primary border-muted flex flex-col items-center gap-3 rounded-xl border p-4 transition-all"
               >
                  <div
                     class="bg-elevated flex size-12 items-center justify-center rounded-full"
                  >
                     <UIcon
                        name="lucide:tag"
                        class="text-muted size-6"
                     />
                  </div>
                  <span class="text-default font-medium">
                     {{ category.name }}
                  </span>
               </NuxtLink>
            </div>
         </section>
         <section>
            <div class="mb-8 flex items-center justify-between">
               <div>
                  <h2 class="text-2xl font-bold tracking-tight">
                     Featured Products
                  </h2>
                  <p class="text-muted">Our top picks for you this week.</p>
               </div>
               <UButton
                  variant="link"
                  label="Browse All"
                  trailing-icon="lucide:chevron-right"
                  to="/products"
                  color="neutral"
               />
            </div>
            <div
               v-if="featuredProducts.length > 0"
               class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
               <NuxtLink
                  v-for="product in featuredProducts"
                  :key="product.id"
                  :to="`/products/${product.id}`"
                  class="block"
               >
                  <ProductCard
                     :data="product"
                  />
               </NuxtLink>
            </div>
            <div
               v-else
               class="flex flex-col items-center justify-center py-20 text-center"
            >
               <UIcon
                  name="lucide:shopping-bag"
                  class="text-muted mb-4 h-16 w-16"
               />
               <h3 class="text-xl font-medium">No products found</h3>
               <p class="text-muted mt-2">
                  Stay tuned! We're adding new items daily.
               </p>
               <UButton
                  class="mt-6"
                  label="Refresh"
                  variant="outline"
                  icon="lucide:refresh-cw"
                  @click="refresh()"
               />
            </div>
         </section>
         <section
            class="text-inverted dark:text-default rounded-3xl bg-neutral-900 p-8 md:p-16"
         >
            <div class="mx-auto max-w-2xl text-center">
               <h2 class="mb-4 text-3xl font-bold">Join Our Newsletter</h2>
               <p class="text-dimmed dark:text-muted mb-8 text-lg">
                  Subscribe to get special offers, free giveaways, and
                  once-in-a-lifetime deals.
               </p>
               <UForm
                  @submit=""
                  class="flex flex-col gap-4 sm:flex-row"
               >
                  <UInput
                     placeholder="Enter your email"
                     size="xl"
                     color="neutral"
                  />
                  <UButton
                     size="xl"
                     color="white"
                     label="Subscribe"
                  />
               </UForm>
               <p class="text-dimmed dark:text-muted mt-4 text-xs">
                  We care about your data. Read our
                  <NuxtLink
                     to="/privacy"
                     class="hover:text-inverted dark:hover:text-primary underline"
                     >Privacy Policy</NuxtLink
                  >.
               </p>
            </div>
         </section>
      </UContainer>
   </div>
</template>
