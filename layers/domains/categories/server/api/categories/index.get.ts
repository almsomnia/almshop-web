export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const query = getQuery(event)

   const data = await $api<API.Response<API.Pagination<DTO.Category[]>>>(
      `/categories`,
      {
         method: "get",
         query,
      }
   )

   return {
      ...data,
      toJSON() {
         return this as API.Response<API.Pagination<DTO.Category[]>>
      }
   }
})
