<script setup lang="ts">
import type { BreadcrumbItem } from "#ui/types"

definePageMeta({
   pageName: "Shop All",
})

const appStore = useAppStore()

const query = reactive<API.Query>({
   page: 1,
   perPage: 12,
})

const { data } = await useApi(`/api/products`, {
   key: "products",
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

const breadcrumbItems: BreadcrumbItem[] = [
   {
      label: "Home",
      to: "/",
   },
   {
      label: "Products",
      to: "/products",
   },
]
</script>

<template>
   <div>
      <UPageHeader
         title="Products"
         description="Browse our collection of high-quality products and find everything you need."
      >
         <template #headline>
            <UBreadcrumb :items="breadcrumbItems" />
         </template>
      </UPageHeader>
      <div class="mt-4 grid grid-cols-4 gap-2">
         <NuxtLink
            v-for="item in data?.items"
            :key="item.id"
            class="col-span-1 block"
            :to="`/products/${item.id}`"
         >
            <ProductCard
               :data="item"
               :wishlist="wishlist"
               @wishlist:toggle="onToggleWishlist"
            />
         </NuxtLink>
      </div>
      <div class="mt-8 flex items-center justify-center">
         <UPagination
            v-model:page="query.page"
            :items-per-page="query.perPage"
            :total="data?.total"
         />
      </div>
   </div>
</template>
