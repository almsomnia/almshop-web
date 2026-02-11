export function $categorySchema() {
   const create = z.object({
      name: z.string().min(3).max(255),
      parentId: z.number().int().positive().nullish(),
   })

   return {
      create,
   }
}
