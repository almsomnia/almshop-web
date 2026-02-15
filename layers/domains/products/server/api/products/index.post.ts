export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const body = await readBody(event)

   const response = await $api<API.Response<DTO.Product>>(`/products`, {
      method: "post",
      body,
   })

   return {
      ...response,
      toJSON() {
         return this as API.Response<DTO.Product>
      },
   }
})
