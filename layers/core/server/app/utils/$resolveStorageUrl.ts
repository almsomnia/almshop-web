export default function (key: string) {
   const config = useRuntimeConfig()
   return `${config.public.storageUrl}/${key}`
}
