<script setup lang="ts">
const route = useRoute()
const { data } = useApi(`/api/products/${route.params.id}`, {
   method: "get",
   transform: (res) => res.data,
})

const files = computed(() => data.value?.files ?? [])

function renderFile(key: string) {
   return `http://localhost:9000/almshop/${key}`
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
</script>

<template>
   <div class="flex items-start gap-8">
      <div class="flex w-[55%] gap-4">
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
                  v-for="file in files"
                  :key="file.id"
                  class="h-auto w-full shrink-0"
               >
                  <img
                     :src="renderFile(file.key)"
                     class="aspect-square h-auto w-full cursor-pointer rounded-lg object-cover opacity-25 transition-opacity hover:opacity-75"
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
            <img
               :src="renderFile(files[0]?.key ?? '')"
               class="aspect-square h-auto w-full rounded-lg object-cover"
            />
         </div>
      </div>
      <div class="w-[45%]">
         <div v-if="data">
            <div class="text-muted text-sm font-medium tracking-wide uppercase">
               {{ data.category?.name }}
            </div>
            <h2 class="mt-1 text-3xl font-semibold">
               {{ data.name }}
            </h2>
            <div class="mt-2 flex items-center gap-2">
               <span>{{ $formatCurrency(data.price) }}</span>
               <USeparator
                  orientation="vertical"
                  :ui="{ root: 'h-4' }"
               />
               <span>{{ data.stock }} in stock</span>
            </div>
            <p class="text-muted mt-4 text-sm">
               {{ data.description }}
            </p>
         </div>
      </div>
   </div>
</template>
