export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const body = await readBody(event)

   const data = await $api<API.Response<DTO.Cart.Detail[]>>(`/cart/bulk`, {
      method: "delete",
      body,
   })

   return {
      ...data,
      toJSON() {
         return this as API.Response<DTO.Cart.Detail[]>
      },
   }
})
