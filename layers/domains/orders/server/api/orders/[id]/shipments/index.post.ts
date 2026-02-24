export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const orderId = getRouterParam(event, "id")
   const body = await readBody(event)

   const response = await $api<API.Response<DTO.Shipment>>(`/shipments`, {
      method: "post",
      body: {
         ...body,
         orderId: Number(orderId),
      },
   })

   return {
      ...response,
      toJSON() {
         return this as API.Response<DTO.Shipment>
      },
   }
})
