declare namespace API {
   interface Response<T> {
      data: T
      meta: {
         message: string
         error: string
      }
   }
}
