declare namespace DTO {
   interface Product {
      id: number
      name: string
      description: string | null
      price: number
      stock: number
      categoryId: number
      category: DTO.Category
      createdAt: string
      updatedAt: string
   }
}
