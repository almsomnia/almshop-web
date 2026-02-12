export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")
   const body = await readBody(event)

   return await $api<API.Response<DTO.User>>(`/users/${id}`, {
      method: "patch",
      body
   })
})
