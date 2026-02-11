import type { H3Event } from "h3"

export default function (event: H3Event) {
   const config = useRuntimeConfig(event)
   const token = getCookie(event, "almshop-access-token")
   return $fetch.create({
      baseURL: config.apiUrl,
      onRequest: ({ request, options }) => {
         options.headers.set("Accept", "application/json")
         if (token) {
            options.headers.set("Authorization", `Bearer ${token}`)
         }
      },
      onResponseError: ({ error, response }) => {
         const data: API.Response<any> = response._data
         throw createError({
            status: response.status,
            statusText: response.statusText,
            message: data.meta.error,
            data: data,
         })
      },
   })
}
