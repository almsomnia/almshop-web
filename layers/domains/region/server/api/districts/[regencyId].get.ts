export default defineEventHandler(async (event) => {
   const $api = $serverApi(event)
   const regencyId = getRouterParam(event, "regencyId")

   const data = await $api<DTO.District[]>(`/regions/districts/${regencyId}`, {
      method: "get",
   })

   return {
      ...data,
      toJSON() {
         return this as DTO.District[]
      },
   }
})
