import type { BreadcrumbItem } from "#ui/types"

export default function () {
   const route = useRoute()
   const router = useRouter()

   const items = computed<BreadcrumbItem[]>(() => {
      const segments = route.path.split("/").filter(Boolean)
      const breadcrumbs: BreadcrumbItem[] = []

      for (let i = segments.length; i > 0; i--) {
         // Cut-off at the second slash (segments[0] is index 1, segments[1] is index 2)
         // If we have more than 1 segment, we stop before segments[0] (which is the root category like /admin)
         if (segments.length > 1 && i < 2) break

         const path = `/${segments.slice(0, i).join("/")}`
         const resolved = router.resolve(path)

         // Skip if route is invalid or doesn't exist in router
         if (!resolved.name && resolved.matched.length === 0) continue

         breadcrumbs.unshift({
            label: (resolved.meta.pageName as string) ?? segments[i - 1],
            to: path,
            icon: resolved.meta.pageIcon as string,
         })
      }

      return breadcrumbs
   })

   return {
      items,
   }
}
