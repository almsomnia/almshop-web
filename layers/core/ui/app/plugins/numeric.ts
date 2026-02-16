export default defineNuxtPlugin((nuxtApp) => {
   const handleEventListener = (e: Event) => {
      const target = e.target as HTMLInputElement
      const val = target.value
      const numericVal = val.replace(/[^0-9]/g, "")
      if (val !== numericVal) {
         target.value = numericVal
         target.dispatchEvent(new Event("input"))
      }
   }

   nuxtApp.vueApp.directive("numeric", {
      mounted(el) {
         const input =
            el instanceof HTMLInputElement ? el : el.querySelector("input")
         if (!input) return

         input.addEventListener("input", handleEventListener)
      },

      beforeUnmount(el) {
         const input =
            el instanceof HTMLInputElement ? el : el.querySelector("input")
         if (!input) return

         input.removeEventListener("input", handleEventListener)
      },
   })
})
