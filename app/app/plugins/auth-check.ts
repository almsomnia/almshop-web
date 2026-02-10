export default defineNuxtPlugin((nuxtApp) => {
   const token = useCookie("almshop-auth-token")
   const authStore = useAuthStore()

   if (!token.value) {
      authStore.$reset()
   }
})
