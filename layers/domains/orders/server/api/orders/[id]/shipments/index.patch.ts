export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const orderId = getRouterParam(event, "id")
   const body = await readBody(event)

   const response = await $api<API.Response<DTO.Shipment>>(
      `/shipments/order/${orderId}`,
      {
         method: "patch",
         body: {
            ...body,
            orderId: Number(orderId),
         },
      }
   )

   return {
      ...response,
      toJSON() {
         return this as API.Response<DTO.Shipment>
      },
   }
})
