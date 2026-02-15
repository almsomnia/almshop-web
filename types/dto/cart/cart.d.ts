declare namespace DTO {
   interface Cart {
      id: number
      userId: number
      createdAt: string
      updatedAt: string
      cartDetails: Cart.Detail[]
   }

   namespace Cart {
      interface Detail {
         id: number
         cartId: number
         productId: number
         quantity: number
         products: DTO.Product[]
      }
   }
}
