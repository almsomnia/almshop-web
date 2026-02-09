declare type InferSchema<
   Fn extends (
      ...args: any[]
   ) => Record<string, import("zod").ZodType | import("zod").ZodLazy>,
   Key extends keyof ReturnType<Fn>,
> = import("zod").infer<ReturnType<Fn>[Key]>

declare type InferFlatSchema<
   S extends import("zod").ZodType | import("zod").ZodLazy,
> = import("zod").infer<S>
