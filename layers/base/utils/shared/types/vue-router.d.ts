import "vue-router"

declare module "vue-router" {
   interface RouteMeta {
      pageName?: string
      pageIcon?: string
      pageOrder?: number
      hideOnSidebar?: boolean
      parent?: RouteMeta
   }
}

declare module "#app" {
   interface PageMeta {
      pageName?: string
      pageIcon?: string
      pageOrder?: number
      hideOnSidebar?: boolean
      parent?: PageMeta
   }
}

export {}
