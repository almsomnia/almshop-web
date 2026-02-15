export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const body = await readBody(event)
   const id = getRouterParam(event, "id")

   const data = await $api<API.Response<DTO.Cart.Detail>>(`/cart/${id}`, {
      method: "patch",
      body
   })

   return {
      ...data,
      toJSON() {
         return this as API.Response<DTO.Cart.Detail>
      }
   }
})
