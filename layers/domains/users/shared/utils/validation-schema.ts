export function $userSchema() {
   const base = z.object({
      email: z.email(),
      name: z.string().min(3).max(255),
      role: z.enum(["admin", "consumer"]),
   })

   const create = base
      .extend({
         password: z.string().min(6),
         passwordConfirmation: z.string(),
      })
      .refine((data) => data.password === data.passwordConfirmation, {
         message: "Passwords do not match",
         path: ["passwordConfirmation"],
      })

   const update = base

   return { base, create, update }
}
