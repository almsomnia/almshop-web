export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const consumerId = getRouterParam(event, "consumerId")

   const data = await $api<API.Response<DTO.Address[]>>(
      `/addresses/consumer/${consumerId}`,
      {
         method: "get",
      }
   )

   return {
      ...data,
      toJSON() {
         return this as API.Response<DTO.Address[]>
      },
   }
})
