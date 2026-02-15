<script setup lang="ts">
import type { BreadcrumbItem } from "#ui/types"

const route = useRoute()
const categoryId = computed(() => route.params.id)

const appStore = useAppStore()

const query = reactive<API.Query>({
   page: 1,
   perPage: 12,
   categoryId: categoryId.value,
})

// Fetch category details
const { data: category } = await useApi(`/api/categories/${categoryId.value}`, {
   key: `category-${categoryId.value}`,
   method: "get",
   transform: (res) => res.data,
})

// Fetch products for this category
const { data: products, pending } = await useApi(`/api/products`, {
   key: `products-category-${categoryId.value}`,
   method: "get",
   query,
   transform: (res) => res.data,
})

const { wishlist, toggleWishlist } = useWishlist()
function onToggleWishlist(id: number) {
   const message = toggleWishlist(id)
   appStore.notify({
      title: `Product ${message} to wishlist`,
   })
}

// Update page name for breadcrumbs if applicable
definePageMeta({
   pageName: "Category",
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
   if (!category.value) return []
   const items: BreadcrumbItem[] = []
   items.push(
      {
         label: "Home",
         to: "/",
      },
      {
         label: "All Categories",
         to: "/categories",
      }
   )
   if (category.value.parent) {
      items.push({
         label: category.value.parent.name,
         to: `/categories/${category.value.parent.id}`,
      })
   }
   items.push({
      label: category.value.name,
      to: `/categories/${category.value.id}`,
   })
   return items
})
</script>

<template>
   <div>
      <UPageHeader
         v-if="category"
         :title="category.name"
      >
         <template #headline>
            <UBreadcrumb :items="breadcrumbItems" />
         </template>
         <template #description>
            <div
               v-if="category.children?.length"
               class="flex items-baseline"
            >
               <span class="text-muted text-sm font-medium"
                  >Subcategories: &nbsp;</span
               >
               <div class="divide-muted flex items-center divide-x">
                  <NuxtLink
                     v-for="child in category.children"
                     :key="`${category.id}-${child.id}`"
                     :to="`/categories/${child.id}`"
                     class="text-muted hover:text-primary px-2 text-sm first:ps-0 last:pe-0 hover:underline"
                  >
                     {{ child.name }}
                  </NuxtLink>
               </div>
            </div>
         </template>
      </UPageHeader>
      <USkeleton
         v-else
         class="h-10 w-48"
      />
      <div
         v-if="pending"
         class="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
         <div
            v-for="n in 8"
            :key="n"
            class="space-y-4"
         >
            <USkeleton class="aspect-square w-full rounded-xl" />
            <USkeleton class="h-4 w-2/3" />
            <USkeleton class="h-4 w-1/2" />
         </div>
      </div>
      <template v-else>
         <div
            v-if="products?.items?.length"
            class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
         >
            <NuxtLink
               v-for="item in products.items"
               :key="item.id"
               class="group block"
               :to="`/products/${item.id}`"
            >
               <ProductCard
                  :data="item"
                  :wishlist="wishlist"
                  @wishlist:toggle="onToggleWishlist"
               />
            </NuxtLink>
         </div>

         <div
            v-else
            class="flex flex-col items-center justify-center py-20 text-center"
         >
            <div
               class="bg-muted mb-4 flex items-center justify-center rounded-full p-6"
            >
               <UIcon
                  name="lucide:package-open"
                  class="text-muted text-6xl"
               />
            </div>
            <h3 class="mb-2 text-xl font-semibold">No products found</h3>
            <p class="text-muted mb-6">
               We couldn't find any products in this category.
            </p>
            <UButton
               to="/products"
               variant="solid"
               color="primary"
               label="Continue Shopping"
            />
         </div>

         <div
            v-if="products && products.total > (query?.perPage ?? 0)"
            class="mt-12 flex justify-center"
         >
            <UPagination
               v-model:page="query.page"
               :items-per-page="query.perPage"
               :total="products.total"
            />
         </div>
      </template>
   </div>
</template>
