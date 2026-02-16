export const useCartStore = defineStore("almshop-cart", () => {
   const cart = ref<DTO.Cart>()
   const items = computed(() => cart.value?.cartDetails ?? [])

   async function addItemToCart(
      ...data: { product: DTO.Product; quantity: number }[]
   ) {
      const payload = data.map((d) => {
         return {
            productId: d.product.id,
            quantity: d.quantity,
         }
      })

      const response = await $api(`/api/cart/bulk`, {
         method: "post",
         body: {
            items: payload,
         },
      })

      if (!cart.value) {
         await fetchCart()
      }
      cart.value!.cartDetails = response.data
      return response
   }

   async function fetchCart() {
      const response = await $api<API.Response<DTO.Cart>>(`/api/cart`, {
         method: "get",
      })
      cart.value = response.data
   }

   function $reset() {
      cart.value = undefined
   }

   return {
      cart,
      items,
      addItemToCart,
      fetchCart,
      $reset,
   }
})
