declare namespace DTO {
   interface Consumer {
      id: number
      phoneNumber: string
      gender: boolean
      createdAt: string
      updatedAt: string
      user?: DTO.User
   }
}
