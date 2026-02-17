export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")
   const body = await readBody(event)

   const data = await $api<API.Response<DTO.Address>>(`/addresses/${id}`, {
      method: "patch",
      body
   })

   return {
      ...data,
      toJSON() {
         return this as API.Response<DTO.Address>
      },
   }
})
