export function $orderSchema() {
   const item = z.object({
      productId: z.number(),
      quantity: z.number().positive().min(1),
   })

   const base = z.object({
      userId: z.number(),
      addressId: z.number(),
      items: z.array(item),
   })

   return {
      base,
      item,
   }
}

export function $shipmentSchema() {
   const base = z.object({
      addressId: z.number().int().positive(),
      orderId: z.number().int().positive(),
      courierProvider: z.string().min(1).max(255),
      trackingNumber: z.string().max(255).nullish(),
   })

   return {
      base,
   }
}
