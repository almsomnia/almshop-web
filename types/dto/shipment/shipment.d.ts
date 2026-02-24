declare namespace DTO {
   interface Shipment {
      id: number
      orderId: number
      addressId: number
      courierProvider: string
      trackingNumber: string
      createdAt: string
      updatedAt: string
      address: DTO.Address
   }
}
