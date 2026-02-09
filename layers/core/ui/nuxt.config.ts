// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
   extends: ["../../base/utils"],
   compatibilityDate: "2025-07-15",
   devtools: { enabled: false },
   modules: ["@nuxt/ui"],
   css: [join(currentDir, "app/assets/css/main.css")],
   components: {
      dirs: [
         {
            path: join(currentDir, "app/components"),
            pathPrefix: false,
         },
      ],
   },
})
