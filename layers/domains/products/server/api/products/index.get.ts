export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const query = getQuery(event)

   return await $api(`/products`, {
      method: "get",
      query
   })
})
