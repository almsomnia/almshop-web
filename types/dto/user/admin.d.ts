declare namespace DTO {
   interface Admin {
      id: number
      createdAt: string
      updatedAt: string
      user?: DTO.User
   }
}
