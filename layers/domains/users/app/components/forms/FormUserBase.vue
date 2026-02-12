<script
   setup
   lang="ts"
   generic="
      T extends ReturnType<typeof $userSchema>['base'] = ReturnType<
         typeof $userSchema
      >['base']
   "
>
import type { FormSubmitEvent } from "#ui/types"

const props = withDefaults(
   defineProps<{
      schema: T
      loading?: Ref<boolean>
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [data: InferFlatSchema<T>]
}>()

const state = defineModel<Partial<InferFlatSchema<T>>>({
   required: true,
   default: () => ({
      name: undefined,
      email: undefined,
      role: undefined,
   }),
})

const roleItems: DTO.User["role"][] = ["admin", "consumer"]

const loading = computed(() => unref(props.loading))

function onSubmit(e: FormSubmitEvent<InferFlatSchema<T>>) {
   emit("submit", e.data)
}
</script>

<template>
   <!-- prettier-ignore-attribute :state -->
   <UForm
      :schema="props.schema"
      :state="(state as any)"
      class="grid grid-cols-2 gap-4"
      @submit="(e: any) => onSubmit(e)"
   >
      <UFormField
         name="name"
         label="Name"
         required
      >
         <UInput
            v-model="state.name"
            :loading="loading"
         />
      </UFormField>
      <UFormField
         name="email"
         label="Email"
         required
      >
         <UInput
            v-model="state.email"
            :loading="loading"
         />
      </UFormField>
      <UFormField
         name="role"
         label="Role"
         required
      >
         <USelect
            v-model="state.role"
            :items="roleItems"
            :loading="loading"
            :ui="{
               itemLabel: 'capitalize',
               base: 'capitalize',
            }"
         />
      </UFormField>
      <slot
         name="extensions"
         :loading="loading"
      />
      <slot
         name="actions"
         :loading="loading"
      >
         <div class="col-span-full mt-2 flex items-center">
            <UButton
               type="submit"
               label="Submit"
               icon="lucide:check"
               :loading="loading"
               class="ms-auto"
            />
         </div>
      </slot>
   </UForm>
</template>
