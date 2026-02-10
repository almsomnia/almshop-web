export default defineNuxtRouteMiddleware((to, from) => {
   const token = useCookie("almshop-auth-token")
   const authStore = useAuthStore()

   if (token.value) {
      // NOTE: if user is logged in and trying to access auth pages, return 404
      if (to.meta.groups?.includes("auth")) {
         const err = createError({
            status: 404,
            statusText: "Page not found",
            message: "The page you are looking for does not exist.",
         })
         return abortNavigation(err)
      }
      return
   }

   // NOTE: admin can access all pages
   if (authStore.user?.role == "admin") return

   // NOTE: consumer can't access admin pages
   if (to.path.includes("admin")) {
      const err = createError({
         status: 404,
         statusText: "Page not found",
         message: "The page you are looking for does not exist.",
      })
      return abortNavigation(err)
   }
})
