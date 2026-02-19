export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const body = await readBody(event)

   const data = await $api<API.Response<DTO.Order>>(`/orders`, {
      method: "post",
      body
   })

   return {
      ...data,
      toJSON() {
         return this as API.Response<DTO.Order>
      }
   }
})
