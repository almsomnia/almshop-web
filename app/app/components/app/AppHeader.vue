<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core"

const appStore = useAppStore()

const appConfig = useAppConfig()
const appTitle = computed<string>(() => (appConfig.app as any).title)

const isMounted = shallowRef(false)

const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanMd = computed(() => {
   if (!isMounted.value) return true
   return breakpoints.greater("md").value
})

function openLoginDialog() {
   appStore.showDialog("Login", h(resolveComponent("FormLogin")))
}

onMounted(() => {
   isMounted.value = true
})
</script>

<template>
   <UHeader :title="appTitle">
      <template #right>
         <template v-if="largerThanMd">
            <UColorModeButton />
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
      </template>
   </UHeader>
</template>
