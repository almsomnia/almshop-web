declare namespace DTO {
   type User = {
      id: number
      name: string
      email: string
      profileId: number
   } & UserProfile

   type UserProfile = UserBuyer | UserSeller

   interface UserBuyer {
      role: "buyer"
      profileType: "buyer"
      profile: DTO.Buyer
   }

   interface UserSeller {
      role: "seller"
      profileType: "seller"
      profile: DTO.Seller
   }
}
