declare namespace DTO {
   type User = {
      id: number
      name: string
      email: string
      createdAt: string
   } & User.Reference

   namespace User {
      type Reference = UserAdmin | UserConsumer

      type UserAdmin = {
         referenceType: "admin"
         referenceId: number
         reference: DTO.Admin
      }

      type UserConsumer = {
         referenceType: "consumer"
         referenceId: number
         reference: DTO.Consumer
      }
   }
}
