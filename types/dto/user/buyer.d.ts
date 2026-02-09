declare namespace DTO {
   interface Buyer {
      id: number
      dob: Date
      gender: HintedString<"male" | "female"> | null
   }
}
