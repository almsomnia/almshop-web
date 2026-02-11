export function $productSchema() {
   const create = z.object({
      name: z.string().min(3).max(255),
      description: z.string().optional(),
      price: z.number().positive(),
      stock: z.number().int().nonnegative(),
      categoryId: z.number().int().positive().optional(),
   })

   return {
      create,
   }
}
