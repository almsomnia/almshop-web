<script setup lang="ts">
import type { BreadcrumbItem } from "#ui/types"

const route = useRoute()

const { data, pending, refresh } = await useApi(
   `/api/products/${route.params.id}`,
   {
      key: `product-${route.params.id}`,
      method: "get",
      transform: (res) => res.data,
   }
)

const files = computed(() => data.value?.files ?? [])
const currentFileIndex = shallowRef(0)

function onFileSelect(index: number) {
   currentFileIndex.value = index
}

const galleryContainer = useTemplateRef("galleryContainer")

const { y, arrivedState } = useScroll(galleryContainer, {
   behavior: "smooth",
})
const showUpButton = computed(() => !arrivedState.top)
const showDownButton = computed(() => !arrivedState.bottom)

function scrollUp() {
   if (!galleryContainer.value) return

   const firstItem = galleryContainer.value.firstElementChild as HTMLElement
   const itemHeight = firstItem.offsetHeight
   const scrollStep = itemHeight + 16
   y.value -= scrollStep * 3
}

function scrollDown() {
   if (!galleryContainer.value) return

   const firstItem = galleryContainer.value.firstElementChild as HTMLElement
   const itemHeight = firstItem.offsetHeight
   const scrollStep = itemHeight + 16
   y.value += scrollStep * 3
}

const cartQty = shallowRef(1)
const subtotal = computed(() => {
   if (!data.value?.price) return 0
   return data.value.price * cartQty.value
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
   return [
      {
         label: "Home",
         to: "/",
      },
      {
         label: "Products",
         to: "/products",
      },
      {
         label: data.value?.name,
         to: `/products/${route.params.id}`,
      },
   ]
})
</script>

<template>
   <div>
      <UPageHeader>
         <template #headline>
            <UBreadcrumb :items="breadcrumbItems" />
         </template>
      </UPageHeader>
      <div class="flex gap-16">
         <div class="flex w-[55%] gap-4">
            <template v-if="pending">
               <div class="relative w-18 shrink-0">
                  <div
                     ref="galleryContainer"
                     class="scrollbar-hidden absolute inset-0 flex flex-col gap-4 overflow-y-auto"
                  >
                     <div
                        v-for="n in 6"
                        :key="n"
                        class="h-auto w-full shrink-0"
                     >
                        <USkeleton
                           class="aspect-square h-auto w-full rounded-xl"
                        />
                     </div>
                  </div>
               </div>
               <div class="flex-1">
                  <USkeleton class="aspect-square h-auto w-full rounded-xl" />
               </div>
            </template>
            <template v-else-if="files.length > 0">
               <div class="relative w-18 shrink-0">
                  <div
                     v-show="showUpButton"
                     class="absolute inset-x-0 top-0 z-20 flex -translate-y-1/2 justify-center"
                  >
                     <UButton
                        icon="lucide:arrow-up"
                        color="neutral"
                        size="xs"
                        class="rounded-full shadow-lg"
                        @click="scrollUp"
                     />
                  </div>
                  <div
                     ref="galleryContainer"
                     class="scrollbar-hidden absolute inset-0 flex flex-col gap-4 overflow-y-auto"
                  >
                     <div
                        v-for="(file, index) in files"
                        :key="file.id"
                        class="h-auto w-full shrink-0"
                     >
                        <img
                           :src="$resolveStorageUrl(file.key)"
                           class="aspect-square h-auto w-full cursor-pointer rounded-xl object-cover transition-opacity"
                           :class="[
                              currentFileIndex == index
                                 ? 'opacity-100'
                                 : 'opacity-25 hover:opacity-75',
                           ]"
                           @click.stop="onFileSelect(index)"
                        />
                     </div>
                  </div>
                  <div
                     v-show="showDownButton"
                     class="absolute inset-x-0 bottom-0 z-20 flex translate-y-1/2 justify-center"
                  >
                     <UButton
                        icon="lucide:arrow-down"
                        color="neutral"
                        size="xs"
                        class="rounded-full shadow-lg"
                        @click="scrollDown"
                     />
                  </div>
               </div>
               <div class="flex-1">
                  <Transition
                     name="fade"
                     mode="out-in"
                  >
                     <img
                        :src="$resolveStorageUrl(files[currentFileIndex]!.key)"
                        :key="files[currentFileIndex]?.id"
                        class="aspect-square h-auto w-full rounded-2xl object-cover"
                     />
                  </Transition>
               </div>
            </template>
            <UEmpty
               v-else
               icon="lucide:image"
               label="No Image"
               description="No image available"
               variant="soft"
               :ui="{
                  root: 'basis-[calc(100%-(var(--spacing)*18))] aspect-square mx-auto rounded-xl',
                  header: 'max-w-xs w-full',
               }"
            >
               <template #leading>
                  <div
                     class="h-30 w-full bg-neutral-900 mask-[url(/img/not-found-cat.svg)] mask-contain mask-center mask-no-repeat dark:bg-neutral-200"
                  />
               </template>
            </UEmpty>
         </div>
         <div class="w-[45%]">
            <div v-if="data">
               <p
                  class="text-muted truncate text-sm font-medium tracking-wide uppercase"
               >
                  {{ data.category?.name }}
               </p>
               <h1 class="text-3xl font-semibold">
                  {{ data?.name }}
               </h1>
               <p class="mt-2 text-xl">
                  {{ $formatCurrency(data?.price) }}
               </p>
               <div class="mt-4">
                  <p class="leading-relaxed text-pretty">
                     {{ data.description }}
                  </p>
               </div>
               <UCard
                  variant="soft"
                  :ui="{
                     root: 'mt-4',
                  }"
               >
                  <div class="flex items-center">
                     <UInputNumber
                        class="max-w-30"
                        v-model="cartQty"
                        :default-value="1"
                        :step="1"
                        :min="1"
                        :max="data.stock"
                     />
                     <UTooltip
                        :text="`Stock: ${data.stock}`"
                        arrow
                     >
                        <UBadge
                           :label="data.stock"
                           icon="lucide:package"
                           class="ms-4"
                           variant="soft"
                        />
                     </UTooltip>
                  </div>
                  <div class="mt-4 flex items-center">
                     <span class="text-muted font-medium"> Subtotal </span>
                     <span class="ms-auto text-lg font-semibold">
                        {{ $formatCurrency(subtotal) }}
                     </span>
                  </div>
                  <div class="mt-2 flex items-center gap-2">
                     <UButton
                        label="Add To Cart"
                        icon="lucide:shopping-cart"
                        block
                     />
                     <UTooltip
                        text="Add to Wishlist"
                        arrow
                     >
                        <UButton
                           variant="ghost"
                           color="neutral"
                           square
                           icon="lucide:heart"
                        />
                     </UTooltip>
                  </div>
               </UCard>
            </div>
         </div>
      </div>
   </div>
</template>
