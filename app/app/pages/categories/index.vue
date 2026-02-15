<script setup lang="ts">
import type { BreadcrumbItem } from "#ui/types"

definePageMeta({
   pageName: "All Categories",
})

const { data: categories, pending } = await useApi("/api/categories", {
   key: "nested-categories",
   method: "get",
   transform: (res) => $groupCategoriesByParent(res.data.items),
   default: () => [] as NestedCategory[],
})

const breadcrumbItems: BreadcrumbItem[] = [
   {
      label: "Home",
      to: "/"
   },
   {
      label: "Categories",
      to: "/categories"
   }
]
</script>

<template>
   <div>
      <UPageHeader
         title="Categories"
         description="Explore our products by category."
      >
         <template #headline>
            <UBreadcrumb :items="breadcrumbItems" />
         </template>
      </UPageHeader>
      <div class="mt-4">
         <div
            v-if="pending"
            class="space-y-12"
         >
            <div
               v-for="n in 3"
               :key="n"
               class="space-y-4"
            >
               <div class="flex items-center justify-between">
                  <USkeleton class="h-8 w-48" />
                  <USkeleton class="h-6 w-20" />
               </div>
               <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                  <USkeleton
                     v-for="i in 6"
                     :key="i"
                     class="h-32 rounded-xl"
                  />
               </div>
            </div>
         </div>
         <div
            v-else-if="categories.length > 0"
            class="space-y-12"
         >
            <section
               v-for="parent in categories"
               :key="parent.id"
            >
               <div class="mb-6 flex items-center justify-between">
                  <h2 class="text-2xl font-bold tracking-tight">
                     {{ parent.name }}
                  </h2>
                  <UButton
                     variant="link"
                     label="View All"
                     trailing-icon="lucide:chevron-right"
                     color="neutral"
                     :to="`/categories/${parent.id}`"
                  />
               </div>

               <div
                  v-if="parent.children?.length > 0"
                  class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
               >
                  <NuxtLink
                     v-for="child in parent.children"
                     :key="child.id"
                     :to="`/categories/${child.id}`"
                     class="group hover:border-primary border-muted flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all"
                  >
                     <div
                        class="bg-elevated group-hover:bg-primary/10 flex size-14 items-center justify-center rounded-full transition-colors"
                     >
                        <UIcon
                           name="lucide:tag"
                           class="text-muted group-hover:text-primary size-7 transition-colors"
                        />
                     </div>
                     <div>
                        <span class="text-default block font-medium">
                           {{ child.name }}
                        </span>
                     </div>
                  </NuxtLink>
               </div>
               <div
                  v-else
                  class="text-muted italic"
               >
                  No subcategories found.
               </div>
            </section>
         </div>
         <UEmpty
            v-else
            title="No categories found"
            description="We couldn't find any categories at the moment."
            icon="lucide:tags"
            variant="naked"
            :actions="[
               {
                  label: 'Browse All Products',
                  to: '/products'
               }
            ]"
         />
      </div>
   </div>
</template>
