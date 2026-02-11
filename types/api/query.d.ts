declare namespace API {
   type Query<T extends Record<string, any> = Record<string, any>> = Partial<
      {
         page: number
         perPage: number
      } & T
   >
}
