<script setup lang="ts">
import type { FormSubmitEvent, FormErrorEvent } from "#ui/types"

const props = withDefaults(
   defineProps<{
      loading?: Ref<boolean>
      data?: DTO.Shipment
      orderId: number
      addressId: number
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [data: InferSchema<typeof $shipmentSchema, "base">]
}>()

const schema = $shipmentSchema().base
const state = reactive<Partial<InferFlatSchema<typeof schema>>>({
   orderId: props.orderId,
   addressId: props.addressId,
   courierProvider: undefined,
   trackingNumber: undefined,
})

const loading = computed(() => unref(props.loading))

function onSubmit(e: FormSubmitEvent<InferFlatSchema<typeof schema>>) {
   emit("submit", e.data)
}

function logFormError(e: FormErrorEvent) {
   if (import.meta.dev) {
      console.table(e.errors)
   }
}

onMounted(() => {
   if (props.data) {
      state.courierProvider = props.data.courierProvider
      state.trackingNumber = props.data.trackingNumber
   }
})
</script>

<template>
   <UForm
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      @error="logFormError"
      class="space-y-4"
   >
      <UFormField
         name="courierProvider"
         label="Courier Provider"
         required
      >
         <UInput
            v-model="state.courierProvider"
            maxlength="255"
            :loading="loading"
         />
      </UFormField>
      <UFormField
         name="trackingNumber"
         label="Tracking Number"
      >
         <UInput
            v-model="state.trackingNumber"
            maxlength="255"
            :loading="loading"
         />
      </UFormField>
      <div class="mt-6 flex items-center">
         <UButton
            type="submit"
            label="Submit"
            icon="lucide:check"
            class="ms-auto"
            :loading="loading"
         />
      </div>
   </UForm>
</template>
