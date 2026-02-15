export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")

   const data = await $api<API.Response<DTO.Category>>(`/categories/${id}`, {
      method: "get",
   })

   return {
      ...data,
      toJSON() {
         return this as API.Response<DTO.Category>
      },
   }
})
