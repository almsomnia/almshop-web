declare namespace DTO {
   interface Product {
      id: number
      name: string
      description: string | null
      price: number
      stock: number
      categoryId: number | null
      category: DTO.Category | null
      createdAt: string
      updatedAt: string
   }
}
