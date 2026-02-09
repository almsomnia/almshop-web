import { skipHydrate } from "pinia"
import { markRaw } from "vue"
import type { ToastProps } from "@nuxt/ui"

type Dialog = {
   show: boolean
   title: string
   component: ReturnType<typeof h>
   width:
      | "auto"
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl"
      | "7xl"
}

export const useAppStore = defineStore("almshop-app-store", () => {
   const dialog = ref<Dialog>({
      show: false,
      title: "",
      component: markRaw(h("div")),
      width: "lg",
   })

   function showDialog(
      title: Dialog["title"],
      component: Dialog["component"],
      opts?: Partial<Omit<Dialog, "show" | "component" | "title">>
   ) {
      dialog.value.title = title
      dialog.value.component = markRaw(component)
      dialog.value.show = true
      dialog.value.width = opts?.width ?? "lg"
   }

   function closeDialog() {
      dialog.value.show = false
      setTimeout(() => {
         dialog.value.component = h("div")
         dialog.value.title = ""
         dialog.value.width = "lg"
      }, 100)
   }

   function notify(opts: ToastProps) {
      const toast = useToast()
      toast.add(opts)
   }

   return {
      dialog: skipHydrate(dialog),
      showDialog,
      closeDialog,
      notify,
   }
})
