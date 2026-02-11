export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const body = await readBody(event)

   return await $api<API.Response<DTO.Category>>(`/categories`, {
      method: "post",
      body,
   })
})
