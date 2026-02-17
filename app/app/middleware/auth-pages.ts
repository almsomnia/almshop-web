export default defineNuxtRouteMiddleware((to, from) => {
   const token = useCookie("almshop-auth-token")

   if (!token.value) {
      return navigateTo(`/login?redirect=${to.fullPath}`)
   }
})
