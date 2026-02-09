// https://nuxt.com/docs/api/configuration/nuxt-config
const typeDeclarationTsConfig = {
   include: ["../../../../types/**/*.d.ts"],
}

export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   devtools: { enabled: true },
   runtimeConfig: {
      apiUrl: import.meta.env.API_URL
   },

   // all paths are relative from ./server
   typescript: {
      tsConfig: { ...typeDeclarationTsConfig },
      sharedTsConfig: { ...typeDeclarationTsConfig },
      nodeTsConfig: { ...typeDeclarationTsConfig },
   },
   nitro: {
      typescript: {
         tsConfig: { ...typeDeclarationTsConfig },
      },
   },
})
