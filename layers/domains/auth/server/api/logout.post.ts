export default eventHandler(async (event) => {
   deleteCookie(event, "almshop-auth-token", {
      path: "/",
   })

   return {
      data: true,
      meta: {
         message: "Logged out successfully",
         error: "",
      },
      toJSON() {
         return this as API.Response<boolean>
      },
   }
})
