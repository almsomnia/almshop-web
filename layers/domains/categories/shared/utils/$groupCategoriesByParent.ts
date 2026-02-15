export type NestedCategory = DTO.Category & {
   children: NestedCategory[]
}

export default function (data: DTO.Category[]) {
   const map = new Map<number, NestedCategory>()
   const roots: NestedCategory[] = []

   for (const item of data) {
      map.set(item.id, { ...item, children: [] })
   }

   for (const item of data) {
      const node = map.get(item.id)
      if (!node) continue
      if (item.parentId && map.has(item.parentId)) {
         map.get(item.parentId)?.children.push(node)
      } else {
         roots.push(node)
      }
   }

   return roots
}
