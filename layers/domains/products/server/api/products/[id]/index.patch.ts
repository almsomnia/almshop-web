export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")
   const body = await readBody<DTO.Product>(event)

   const data = await $api<API.Response<DTO.Product>>(`/products/${id}`, {
      method: "patch",
      body,
   })

   return {
      ...data,
      toJSON() {
         return this as API.Response<DTO.Product>
      },
   }
})
