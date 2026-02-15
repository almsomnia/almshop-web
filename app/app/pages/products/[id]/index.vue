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
      <div class="flex flex-col gap-8 lg:flex-row lg:gap-16">
         <!-- Gallery Section -->
         <div class="flex w-full flex-col-reverse gap-2 md:flex-row lg:w-[55%]">
            <template v-if="pending">
               <div
                  class="relative flex flex-row gap-4 overflow-x-auto md:w-18 md:shrink-0 md:flex-col md:overflow-y-auto"
               >
                  <div
                     v-for="n in 6"
                     :key="n"
                     class="h-18 w-18 shrink-0 md:h-auto md:w-full"
                  >
                     <USkeleton
                        class="aspect-square h-auto w-full rounded-xl"
                     />
                  </div>
               </div>
               <div class="flex-1">
                  <USkeleton class="aspect-square h-auto w-full rounded-xl" />
               </div>
            </template>
            <template v-else-if="files.length > 0">
               <!-- Thumbnail List -->
               <div class="relative md:w-18 md:shrink-0">
                  <!-- Up/Down buttons only visible on MD+ where it's vertical -->
                  <div
                     v-show="showUpButton"
                     class="absolute inset-x-0 top-0 z-20 hidden -translate-y-1/2 justify-center md:flex"
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
                     class="scrollbar-hidden -mx-0.5 flex flex-row gap-2 overflow-x-auto p-0.5 md:absolute md:inset-0 md:flex-col md:overflow-y-auto"
                  >
                     <div
                        v-for="(file, index) in files"
                        :key="file.id"
                        class="h-18 w-18 shrink-0 md:h-auto md:w-full"
                     >
                        <img
                           :src="$resolveStorageUrl(file.key)"
                           class="aspect-square h-auto w-full cursor-pointer rounded-xl object-cover transition-opacity"
                           :class="[
                              currentFileIndex == index
                                 ? 'ring-primary opacity-100 ring-2'
                                 : 'opacity-50 hover:opacity-75',
                           ]"
                           @click.stop="onFileSelect(index)"
                        />
                     </div>
                  </div>

                  <div
                     v-show="showDownButton"
                     class="absolute inset-x-0 bottom-0 z-20 hidden translate-y-1/2 justify-center md:flex"
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

               <!-- Main Image -->
               <div class="flex-1">
                  <Transition
                     name="fade"
                     mode="out-in"
                  >
                     <img
                        :src="$resolveStorageUrl(files[currentFileIndex]!.key)"
                        :key="files[currentFileIndex]?.id"
                        class="aspect-square h-auto w-full rounded-2xl object-cover shadow-sm"
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
                  root: 'w-full aspect-square mx-auto rounded-xl',
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

         <!-- Info Section -->
         <div class="w-full lg:w-[45%]">
            <div v-if="data">
               <p
                  class="text-muted truncate text-sm font-medium tracking-wide uppercase"
               >
                  {{ data.category?.name }}
               </p>
               <h1 class="text-highlighted text-3xl font-semibold md:text-4xl">
                  {{ data?.name }}
               </h1>
               <p class="mt-2 text-xl font-bold">
                  {{ $formatCurrency(data?.price) }}
               </p>
               <div class="mt-6">
                  <h3
                     class="text-muted text-sm font-medium tracking-wider uppercase"
                  >
                     Description
                  </h3>
                  <p class="text-muted mt-2 leading-relaxed text-pretty">
                     {{ data.description }}
                  </p>
               </div>

               <UCard
                  variant="soft"
                  :ui="{
                     root: 'mt-8',
                     body: 'p-6',
                  }"
               >
                  <div class="flex items-center gap-4">
                     <div class="flex flex-col gap-1">
                        <span class="text-muted text-xs font-medium uppercase"
                           >Quantity</span
                        >
                        <UInputNumber
                           class="max-w-32"
                           v-model="cartQty"
                           :default-value="1"
                           :step="1"
                           :min="1"
                           :max="data.stock"
                        />
                     </div>
                     <div class="ms-auto text-right">
                        <span class="text-muted text-xs font-medium uppercase"
                           >Availability</span
                        >
                        <div class="mt-1">
                           <UBadge
                              :label="`${data.stock} in stock`"
                              icon="lucide:package"
                              variant="soft"
                              color="neutral"
                           />
                        </div>
                     </div>
                  </div>
                  <USeparator
                     type="dashed"
                     class="my-6"
                  />
                  <div class="flex items-center">
                     <span class="text-muted font-medium">Subtotal</span>
                     <span class="text-primary ms-auto text-2xl font-bold">
                        {{ $formatCurrency(subtotal) }}
                     </span>
                  </div>
                  <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                     <UButton
                        label="Add To Cart"
                        icon="lucide:shopping-cart"
                        size="lg"
                        class="flex-1"
                        block
                     />
                     <UTooltip
                        text="Add to Wishlist"
                        arrow
                     >
                        <UButton
                           variant="outline"
                           color="neutral"
                           size="lg"
                           icon="lucide:heart"
                           class="hidden sm:inline-flex"
                        />
                        <UButton
                           variant="outline"
                           color="neutral"
                           size="lg"
                           label="Wishlist"
                           icon="lucide:heart"
                           class="sm:hidden"
                           block
                        />
                     </UTooltip>
                  </div>
               </UCard>
            </div>
         </div>
      </div>
   </div>
</template>
