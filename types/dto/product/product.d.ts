declare namespace DTO {
   interface Product {
      id: number
      name: string
      description: string | null
      price: number
      stock: number
      categoryId: number
      createdAt: string
      updatedAt: string
   }
}
