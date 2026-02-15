export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")
   const body = await readRawBody(event, false)
   const contentType = getHeader(event, "content-type")

   if (!body || !contentType) {
      throw createError({
         statusCode: 400,
         statusMessage: "Invalid multipart request",
      })
   }

   const data = await $api<API.Response<DTO.File[]>>(`/products/${id}/files`, {
      method: "POST",
      body,
      headers: {
         "Content-Type": contentType,
      },
   })

   return {
      ...data,
      toJSON() {
         return this as API.Response<DTO.File[]>
      }
   }
})
