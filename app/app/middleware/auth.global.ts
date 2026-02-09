export default defineNuxtRouteMiddleware((to, from) => {
   const token = useCookie("almshop-auth-token")
   if (!token.value && to.path.includes("admin")) {
      const err = createError({
         status: 404,
         statusText: "Page not found",
         message: "The page you are looking for does not exist."
      })
      return abortNavigation(err)
   }
})
