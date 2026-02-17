export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const districtId = getRouterParam(event, "districtId")

   const data = await $api<DTO.Village[]>(`/regions/villages/${districtId}`, {
      method: "get",
   })

   return {
      ...data,
      toJSON() {
         return this as DTO.Village[]
      },
   }
})
