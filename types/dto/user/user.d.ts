declare namespace DTO {
   type User = {
      id: number
      name: string
      email: string
      role: HintedString<"consumer" | "admin">
   }
}
