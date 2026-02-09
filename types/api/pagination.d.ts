declare namespace API {
   interface Pagination<T> {
      items: T
      page: number
      perPage: number
      total: number
      lastPage: number
      from: number
      to: number
   }
}
