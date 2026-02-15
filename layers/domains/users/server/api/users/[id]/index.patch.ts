export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")
   const body = await readBody(event)

   const data = await $api<API.Response<DTO.User>>(`/users/${id}`, {
      method: "patch",
      body,
   })

   return {
      ...data,
      toJSON() {
         return this as API.Response<DTO.User>
      }
   }
})
