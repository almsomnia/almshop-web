export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const provinceId = getRouterParam(event, "provinceId")

   const data = await $api<DTO.Regency[]>(`/regions/regencies/${provinceId}`, {
      method: "get",
   })

   return {
      ...data,
      toJSON() {
         return this as DTO.Regency[]
      },
   }
})
