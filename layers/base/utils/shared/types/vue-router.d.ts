import "vue-router"

declare module "vue-router" {
   interface RouteMeta {
      pageName?: string
      pageIcon?: string
      pageOrder?: number
      hideOnSidebar?: boolean
   }
}

declare module "#app" {
   interface PageMeta {
      pageName?: string
      pageIcon?: string
      pageOrder?: number
      hideOnSidebar?: boolean
   }
}

export {}
