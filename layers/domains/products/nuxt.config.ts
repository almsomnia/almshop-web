// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const currentDir = dirname(fileURLToPath(import.meta.url))

const typeDeclarationTsConfig = {
   include: ["../../../../types/**/*.d.ts"],
}

export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   devtools: { enabled: true },
   extends: ["../../core/server", "../../core/ui"],

   components: {
      dirs: [
         {
            path: join(currentDir, "components"),
            pathPrefix: false,
         },
      ],
   },

   // all paths are relative from ./.nuxt
   typescript: {
      tsConfig: { ...typeDeclarationTsConfig },
      sharedTsConfig: { ...typeDeclarationTsConfig },
      nodeTsConfig: { ...typeDeclarationTsConfig },
   },
   nitro: {
      typescript: { tsConfig: { ...typeDeclarationTsConfig } },
   },
})
