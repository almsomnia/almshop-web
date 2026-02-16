declare namespace DTO {
   interface Consumer {
      id: number
      phoneNumber: string
      gender: boolean
      dob: string
      profileImage: string | null
      createdAt: string
      updatedAt: string
      user?: DTO.User
   }
}
