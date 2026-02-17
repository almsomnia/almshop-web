declare namespace DTO {
   interface Province {
      code: string
      name: string
   }

   interface Regency {
      code: string
      provinceCode: string
      name: string
   }

   interface District {
      code: string
      regencyCode: string
      name: string
   }

   interface Village {
      code: string
      districtCode: string
      name: string
   }
}
