<script setup lang="ts">
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
      title: `Product ${message} to wishlist`
   })
}
</script>

<template>
   <div>
      <div class="grid grid-cols-4 gap-2">
         <NuxtLink
            v-for="item in data?.items"
            :key="item.id"
            class="block col-span-1"
            :to="`/products/${item.id}`"
         >
            <ProductCard
               :data="item"
               :wishlist="wishlist"
               @wishlist:toggle="onToggleWishlist"
            />
         </NuxtLink>
      </div>
      <div class="flex items-center justify-center mt-8">
         <UPagination
            v-model:page="query.page"
            :items-per-page="query.perPage"
            :total="data?.total"
         />
      </div>
   </div>
</template>
