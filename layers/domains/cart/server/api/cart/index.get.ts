export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)

   const data = await $api<API.Response<DTO.Cart>>(`/cart`, {
      method: "get",
   })

   return {
      ...data,
      toJSON() {
         return this as API.Response<DTO.Cart>
      }
   }
})
