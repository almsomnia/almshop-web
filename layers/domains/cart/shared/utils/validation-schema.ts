export function $cartSchema() {
   const create = z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
   })

   const bulk = z.array(create)

   const update = create

   return {
      create,
      bulk,
      update,
   }
}
