import type { UseFetchOptions, FetchResult } from "nuxt/app"
import type { NitroFetchRequest, AvailableRouterMethod } from "nitropack"

type KeysOf<T> = Array<
   T extends T ? (keyof T extends string ? keyof T : never) : never
>

export function useApi<
   T = void,
   ReqT extends NitroFetchRequest = NitroFetchRequest,
   Method extends AvailableRouterMethod<ReqT> = T extends void
      ? "get" extends AvailableRouterMethod<ReqT>
         ? "get"
         : AvailableRouterMethod<ReqT>
      : AvailableRouterMethod<ReqT>,
   _ResT = T extends void ? FetchResult<ReqT, Method> : T,
   DataT = _ResT,
   PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
   DefaultT = undefined,
>(
   url: Ref<ReqT> | ReqT | (() => ReqT),
   options?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>
) {
   const res = useFetch(url, {
      ...options,
      $fetch: $api as typeof $fetch,
   })
   return {
      ...res,
      pending: computed(() => res.status.value === "pending"),
   }
}
