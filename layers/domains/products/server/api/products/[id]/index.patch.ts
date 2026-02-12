export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")
   const body = await readBody<DTO.Product>(event)

   return await $api(`/products/${id}`, {
      method: "patch",
      body,
   })
})
