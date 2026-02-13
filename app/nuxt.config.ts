// https://nuxt.com/docs/api/configuration/nuxt-config
const typeDeclarationTsConfig = {
   include: ["../../types/**/*.d.ts"],
}

export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   devtools: { enabled: true },
   extends: [
      "../layers/domains/auth",
      "../layers/domains/products",
      "../layers/domains/categories",
      "../layers/domains/users",
   ],

   routeRules: {
      "/admin/**": { appLayout: "admin", ssr: false },
   },

   runtimeConfig: {
      public: {
         storageUrl: import.meta.env.STORAGE_URL
      }
   },

   // all paths are relative from ./nuxt
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
