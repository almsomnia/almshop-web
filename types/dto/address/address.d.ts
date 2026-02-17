declare namespace DTO {
   interface Address {
      id: number
      consumerId: number
      label: string
      address: string
      postalCode: string
      latitude: number
      longitude: number
      provinceCode: string
      regencyCode: string
      districtCode: string
      villageCode: string
      isDefault: boolean
      createdAt: string
      updatedAt: string
      province: DTO.Province
      regency: DTO.Regency
      district: DTO.District
      village: DTO.Village
   }
}
