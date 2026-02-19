export function $orderSchema() {
   const item = z.object({
      productId: z.number(),
      quantity: z.number().positive().min(1),
   })

   const base = z.object({
      userId: z.number(),
      addressId: z.number(),
      items: z.array(item)
   })

   return {
      base,
      item
   }
}
