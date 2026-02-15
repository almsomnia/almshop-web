declare namespace DTO {
   interface Category {
      id: number
      name: string
      parentId: number
      parent?: DTO.Category | null
      children?: DTO.Category[] | null
      createdAt: string
      updatedAt: string
   }
}
