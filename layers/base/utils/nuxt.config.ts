// https://nuxt.com/docs/api/configuration/nuxt-config
const typeDeclarationTsConfig = {
   include: ["../../../../types/**/*.d.ts"],
}

export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   devtools: { enabled: true },
   extends: [],
   modules: ["@vueuse/nuxt", "dayjs-nuxt", "@pinia/nuxt"],

   dayjs: {
      plugins: ["utc", "relativeTime", "timezone"],
      locales: ["id"],
      defaultLocale: "id",
      defaultTimezone: "Asia/Jakarta",
   },

   // all paths are relative from ./.nuxt
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
