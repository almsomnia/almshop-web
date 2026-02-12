<script setup lang="ts">
const route = useRoute()
const { data, pending } = useApi(`/api/products/${route.params.id}`, {
   key: `product-${route.params.id}`,
   method: "get",
   transform: (res) => res.data,
})

const files = computed(() => data.value?.files ?? [])
const currentFileIndex = shallowRef(0)

function onFileSelect(index: number) {
   currentFileIndex.value = index
}

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
                        :src="renderFile(file.key)"
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
                     :src="renderFile(files[currentFileIndex]!.key)"
                     :key="files[currentFileIndex]?.id"
                     class="aspect-square h-auto w-full rounded-xl object-cover"
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
            <p class="text-muted mt-4 text-sm text-pretty">
               {{ data.description }}
            </p>
         </div>
         <div v-else>
            <USkeleton class="h-(--text-sm) w-1/6" />
            <USkeleton class="mt-1 h-(--text-3xl) w-1/2" />
            <USkeleton class="mt-2 h-(--text-sm) w-1/4" />
            <div class="mt-4">
               <USkeleton class="h-(--text-sm) w-5/6" />
               <USkeleton class="mt-1.5 h-(--text-sm) w-9/10" />
               <USkeleton class="mt-1.5 h-(--text-sm) w-3/4" />
               <USkeleton class="mt-1.5 h-(--text-sm) w-2/5" />
            </div>
         </div>
      </div>
   </div>
</template>
