declare namespace DTO {
   interface File {
      id: number
      key: string
      refType: HintedString<"product">
      refId: number
      createdAt: string
      updatedAt: string
   }
}
