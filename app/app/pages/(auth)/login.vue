<script setup lang="ts">
import type { NuxtError } from '#app'

definePageMeta({
   layout: false,
})

const appConfig = useAppConfig()
const colorMode = useColorMode()
const authStore = useAuthStore()
const appStore = useAppStore()

const imgSrc = computed(() => {
   return colorMode.preference === "dark"
      ? "/img/login-dark.jpg"
      : "/img/login-light.jpg"
})

async function onSubmit(data: InferSchema<typeof $authSchema, "login">) {
   try {
      const response = await authStore.login(data)
      if (response.data.role === "admin") {
         return await navigateTo(`/admin`)
      }
      return await navigateTo(`/`)
   } catch (error) {
      const err = error as NuxtError<any>
      appStore.notify({
         title: err?.statusMessage,
         description: err?.message,
         color: "error"
      })
   }
}
</script>

<template>
   <UApp>
      <main class="relative h-screen">
         <div class="absolute top-0 right-0 mt-4 mr-4">
            <UColorModeButton />
         </div>
         <div class="grid h-full max-h-screen grid-cols-5 gap-4 p-4">
            <div
               class="ring-muted relative col-span-3 overflow-hidden rounded-xl ring"
            >
               <ClientOnly>
                  <img
                     :src="imgSrc"
                     class="h-auto w-full object-cover"
                     alt="login-img"
                  />
               </ClientOnly>
               <div class="absolute bottom-0 start-0 ms-4 mb-4">
                  <h1 class="uppercase text-4xl tracking-widest text-primary-50">
                     {{ appConfig.app.title }}
                  </h1>
               </div>
            </div>
            <div
               class="col-span-2 mx-auto flex w-full max-w-lg items-center justify-center"
            >
               <div class="w-full">
                  <h2 class="text-3xl font-bold tracking-tight">Login</h2>
                  <div class="mt-12 w-full">
                     <FormLogin @submit="onSubmit" />
                  </div>
               </div>
            </div>
         </div>
      </main>
   </UApp>
</template>
