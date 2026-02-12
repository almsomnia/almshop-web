export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")
   const body = await readBody<DTO.Category>(event)

   return await $api<API.Response<DTO.Category>>(`/categories/${id}`, {
      method: "patch",
      body,
   })
})
