export function $addressSchema() {
   const base = z.object({
      label: z.string().min(1),
      address: z.string().min(1),
      postalCode: z.string().max(10).nullish(),
      consumerId: z.number().positive().int(),
      isDefault: z.boolean().default(false),
      latitude: z.number().nullish(),
      longitude: z.number().nullish(),
      provinceCode: z.string(),
      regencyCode: z.string(),
      districtCode: z.string(),
      villageCode: z.string(),
   })

   const create = base
   const update = base

   return {
      create,
      update,
      base,
   }
}
