export function $authSchema() {
   const login = z.object({
      email: z.email(),
      password: z.string().trim().min(1),
   })

   return {
      login,
   }
}
