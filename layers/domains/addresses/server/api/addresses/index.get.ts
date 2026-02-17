export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)

   const data = await $api<API.Response<DTO.Address[]>>(`/addresses`, {
      method: "get",
   })

   return {
      ...data,
      toJSON() {
         return this as API.Response<DTO.Address[]>
      },
   }
})
