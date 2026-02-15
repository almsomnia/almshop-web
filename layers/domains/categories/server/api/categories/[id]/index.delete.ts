export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")

   const data = await $api<API.Response<boolean>>(`/categories/${id}`, {
      method: "delete",
   })

   return {
      ...data,
      toJSON() {
         return this as API.Response<boolean>
      },
   }
})
