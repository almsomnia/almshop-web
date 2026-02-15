export default eventHandler(async (event) => {
   const $api = $serverApi(event)
   const body = await readBody(event)

   const response = await $api<API.Response<DTO.Auth>>(`/auth/login`, {
      method: "post",
      body,
   })

   setCookie(event, "almshop-auth-token", response.data.token, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // a week
   })

   return {
      data: { ...response.data.user },
      meta: response.meta,
      toJSON() {
         return this as API.Response<DTO.User>
      }
   }
})
