export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)

   const data = await $api<DTO.Province[]>(`/regions/provinces`, {
      method: "get",
   })

   return {
      ...data,
      toJSON() {
         return this as DTO.Province[]
      },
   }
})
