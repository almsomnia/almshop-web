export default eventHandler(async (event) => {
   const $api = $serverApi(event)
   const body = await readBody(event)

   return await $api(`/auth/login`, {
      method: "post",
      body
   })
})
