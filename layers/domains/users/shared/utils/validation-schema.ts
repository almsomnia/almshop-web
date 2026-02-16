const userFields = {
   email: z.email(),
   name: z.string().min(3).max(255),
   password: z.string().min(6),
   passwordConfirmation: z.string(),
}

export const userSchemaBase = z
   .object(userFields)
   .omit({ password: true, passwordConfirmation: true })
export type UserSchemaBase = typeof userSchemaBase

export function $consumerSchema() {
   const reference = z.object({
      dob: z.date().nullish(),
      gender: z.boolean().nullish(),
      phoneNumber: z.string().regex(/^\d+$/).nullable(),
   })

   const create = z
      .object(userFields)
      .extend(reference.shape)
      .refine((data) => data.password === data.passwordConfirmation, {
         message: "Passwords do not match",
         path: ["passwordConfirmation"],
      })

   const update = z
      .object({
         name: userFields.name,
         email: userFields.email,
      })
      .extend(reference.shape)

   return { reference, create, update }
}

export function $adminSchema() {
   const reference = z.object({})

   const create = z
      .object({
         ...userFields,
      })
      .refine((data) => data.password === data.passwordConfirmation, {
         message: "Passwords do not match",
         path: ["passwordConfirmation"],
      })

   const update = z.object({
      name: userFields.name,
      email: userFields.email,
   })

   return { reference, create, update }
}

export function $userSchema() {
   const base = z.object({
      email: userFields.email,
      name: userFields.name,
      referenceType: z.enum(["admin", "consumer"]),
      reference: z
         .union([$adminSchema().reference, $consumerSchema().reference])
         .optional(),
   })

   const create = base
      .extend({
         password: userFields.password,
         passwordConfirmation: userFields.passwordConfirmation,
      })
      .refine((data) => data.password === data.passwordConfirmation, {
         message: "Passwords do not match",
         path: ["passwordConfirmation"],
      })

   const update = base

   return { base, create, update }
}
