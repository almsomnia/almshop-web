export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const query = getQuery(event)

   return await $api<API.Response<API.Pagination<DTO.Category[]>>>(
      `/categories`,
      {
         method: "get",
         query,
      }
   )
})
