export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")

   return await $api<API.Response<boolean>>(`/users/${id}`, {
      method: "delete",
   })
})
