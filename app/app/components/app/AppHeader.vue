<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core"
import { FormLogin } from "#components"
import type { NuxtError } from "#app"

const appStore = useAppStore()
const authStore = useAuthStore()
const appConfig = useAppConfig()
const appTitle = computed<string>(() => (appConfig.app as any).title)

const isMounted = shallowRef(false)

const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanMd = computed(() => {
   if (!isMounted.value) return true
   return breakpoints.greater("md").value
})

function openLoginDialog() {
   appStore.showDialog(
      "Login",
      h(FormLogin, {
         onSubmit: async (data: InferSchema<typeof $authSchema, "login">) => {
            try {
               await authStore.login(data)
               window.location.reload()
            } catch (error) {
               const err = error as NuxtError<any>
               appStore.notify({
                  title: err?.statusMessage,
                  description: err?.message
               })
            }
         },
      })
   )
}

onMounted(() => {
   isMounted.value = true
})
</script>

<template>
   <UHeader :title="appTitle">
      <template #right>
         <ClientOnly>
            <template v-if="largerThanMd">
               <UColorModeButton />
               <template v-if="!authStore.user">
                  <UButton
                     label="Login"
                     icon="lucide:log-in"
                     variant="outline"
                     color="neutral"
                     @click="openLoginDialog"
                  />
                  <UButton
                     label="Register"
                     icon="lucide:user-plus"
                  />
               </template>
               <template v-else>
                  <UUser
                     :name="authStore.user.name"
                     :description="authStore.user.email"
                  />
               </template>
            </template>
         </ClientOnly>
      </template>
   </UHeader>
</template>
