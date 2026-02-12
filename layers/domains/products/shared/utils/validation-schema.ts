export function $productSchema() {
   const create = z.object({
      name: z.string().min(3).max(255),
      description: z.string().nullish(),
      price: z.number().positive(),
      stock: z.number().int().nonnegative(),
      categoryId: z.number().int().positive().nullish(),
   })

   const files = z.object({
      files: z.array(z.file()).min(1),
   })

   return {
      create,
      files,
   }
}
