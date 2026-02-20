declare type OrderStatus = "PENDING" | "PAID" | "PACKED" | "SHIPPED" | "COMPLETED" | "CANCELLED"

declare namespace DTO {
   interface Order {
      id: number
      userId: number
      addressId: number
      totalPrice: number
      status: OrderStatus
      createdAt: string
      updatedAt: string
      orderDetails: DTO.Order.Detail[]
      user: DTO.User
      address: DTO.Address
   }

   namespace Order {
      interface Detail {
         id: number
         orderId: number
         productId: number
         price: number
         quantity: number
         productName: string
      }
   }
}
