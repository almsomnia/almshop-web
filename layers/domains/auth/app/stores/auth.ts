export const useAuthStore = defineStore(
   "almshop-auth",
   () => {
      const user = ref<DTO.User>()

      async function login(payload: InferSchema<typeof $authSchema, "login">) {
         const response = await $api(`/api/login`, {
            method: "post",
            body: payload,
         })
         user.value = response.data as DTO.User
         return response
      }

      async function logout() {
         const response = await $api(`/api/logout`, {
            method: "post",
         })
         user.value = undefined
         return response
      }

      function $reset() {
         user.value = undefined
      }

      return {
         user,
         login,
         logout,
         $reset,
      }
   },
   {
      persist: {
         storage: piniaPluginPersistedstate.localStorage(),
      },
   }
)
