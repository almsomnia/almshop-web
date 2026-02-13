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

function renderFile(key: string) {
   return `http://localhost:9001/${key}`
}
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
            <div class="absolute inset-0 h-full w-full rounded-2xl bg-neutral-950/40" />
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
                  color="primary"
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
                  <p class="text-muted">
                     Find what you're looking for faster.
                  </p>
               </div>
               <UButton
                  variant="ghost"
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
                  class="group hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 flex flex-col items-center gap-3 rounded-xl border border-gray-200 p-4 transition-all dark:border-gray-800"
               >
                  <div
                     class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700"
                  >
                     <UIcon
                        name="lucide:tag"
                        class="h-8 w-8 text-muted"
                     />
                  </div>
                  <span class="font-medium text-default">
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
                  <p class="text-muted">
                     Our top picks for you this week.
                  </p>
               </div>
               <UButton
                  variant="ghost"
                  label="Browse All"
                  trailing-icon="lucide:chevron-right"
                  to="/products"
                  color="neutral"
               />
            </div>

            <div
               v-if="featuredProducts.length > 0"
               class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
               <UCard
                  v-for="product in featuredProducts"
                  :key="product.id"
                  class="group overflow-hidden transition-all hover:shadow-lg"
                  :ui="{
                     body: 'p-0 sm:p-0',
                     footer: 'p-4',
                  }"
               >
                  <template #header>
                     <div
                        class="bg-elevated dark:bg-muted relative aspect-square overflow-hidden rounded-lg"
                     >
                        <img
                           v-if="product.files?.length"
                           :src="renderFile(product.files[0]!.key)"
                           :alt="product.name"
                           class="h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div
                           v-else
                           class="flex h-full w-full items-center justify-center rounded-xl"
                        >
                           <UIcon
                              name="lucide:image"
                              class="text-muted h-12 w-12"
                           />
                        </div>
                        <div class="absolute top-2 right-2">
                           <UButton
                              color="neutral"
                              variant="ghost"
                              icon="lucide:heart"
                              class="rounded-full bg-white/80 backdrop-blur-sm dark:bg-gray-900/80"
                           />
                        </div>
                     </div>
                  </template>

                  <div class="p-4">
                     <div class="mb-1 text-xs text-muted">
                        {{ product.category?.name ?? "Uncategorized" }}
                     </div>
                     <h3 class="text-default line-clamp-1 font-semibold">
                        <NuxtLink
                           :to="`/products/${product.id}`"
                           class="hover:text-primary"
                        >
                           {{ product.name }}
                        </NuxtLink>
                     </h3>
                     <div class="mt-2 flex items-center justify-between">
                        <span class="text-primary text-lg font-bold">
                           {{ $formatCurrency(product.price) }}
                        </span>
                        <div class="text-muted flex items-center gap-1 text-sm">
                           <UIcon
                              name="lucide:package"
                              class="h-4 w-4"
                           />
                           {{ product.stock }}
                        </div>
                     </div>
                  </div>

                  <template #footer>
                     <UButton
                        block
                        color="primary"
                        label="Add to Cart"
                        icon="lucide:shopping-cart"
                     />
                  </template>
               </UCard>
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
               <p class="text-muted mb-8 text-lg">
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
                     color="primary"
                     label="Subscribe"
                  />
               </UForm>
               <p class="mt-4 text-xs text-muted">
                  We care about your data. Read our
                  <NuxtLink
                     to="/privacy"
                     class="underline hover:text-muted"
                     >Privacy Policy</NuxtLink
                  >.
               </p>
            </div>
         </section>
      </UContainer>
   </div>
</template>
