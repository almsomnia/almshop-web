export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const query = getQuery(event)

   return await $api<API.Response<API.Pagination<DTO.Product[]>>>(`/products`, {
      method: "get",
      query,
   })
})
