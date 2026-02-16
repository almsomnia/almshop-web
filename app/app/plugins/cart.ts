export default defineNuxtPlugin(() => {
   const authStore = useAuthStore()
   if (authStore.user) {
      const cartStore = useCartStore()
      cartStore.fetchCart()
   }
})
