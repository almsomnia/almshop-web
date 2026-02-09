import type { NuxtError } from "#app"
import type {
   NitroFetchRequest,
   NitroFetchOptions,
   TypedInternalResponse,
} from "nitropack"

export default function <
   T = unknown,
   R extends NitroFetchRequest = NitroFetchRequest,
>(endpoint: R, opts?: NitroFetchOptions<R>): Promise<TypedInternalResponse<R, T>> {
   const handler = $fetch.create({
      retry: false,
      onResponseError: ({ response }) => {
         throw response._data as NuxtError
      },
   })

   return handler<T, R>(endpoint, opts)
}
