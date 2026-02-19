<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types"

const props = withDefaults(
   defineProps<{
      consumerId: number
      data?: DTO.Address
      loading?: Ref<boolean>
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [values: InferSchema<typeof $addressSchema, "base">]
}>()

const schema = $addressSchema().base

const state = reactive<Partial<InferFlatSchema<typeof schema>>>({
   label: undefined,
   address: undefined,
   postalCode: undefined,
   consumerId: props.consumerId,
   isDefault: false,
   latitude: undefined,
   longitude: undefined,
   provinceCode: undefined,
   regencyCode: undefined,
   districtCode: undefined,
   villageCode: undefined,
})

const loading = computed(() => unref(props.loading))

function onSubmit(e: FormSubmitEvent<InferFlatSchema<typeof schema>>) {
   emit("submit", e.data)
}

onMounted(() => {
   if (props.data) {
      state.label = props.data.label
      state.address = props.data.address
      state.postalCode = props.data.postalCode
      state.consumerId = props.data.consumerId
      state.isDefault = props.data.isDefault
      state.latitude = props.data.latitude
      state.longitude = props.data.longitude
      state.provinceCode = props.data.provinceCode
      state.regencyCode = props.data.regencyCode
      state.districtCode = props.data.districtCode
      state.villageCode = props.data.villageCode
   }
})
</script>

<template>
   <UForm
      :schema="schema"
      :state="state"
      class="grid grid-cols-2 gap-4"
      @submit="onSubmit"
   >
      <UFormField
         name="label"
         label="Label"
         required
         class="col-span-full"
      >
         <UInput
            v-model="state.label"
            :loading="loading"
         />
      </UFormField>
      <UFormField
         name="address"
         label="Address"
         required
         class="col-span-full"
      >
         <UTextarea
            v-model="state.address"
            :rows="2"
            autoresize
            :loading="loading"
         />
      </UFormField>
      <UFormField
         name="postalCode"
         label="Postal Code"
      >
         <UInput
            v-model="state.postalCode"
            v-numeric
            maxlength="10"
            :loading="loading"
         />
      </UFormField>
      <UFormField
         name="provinceCode"
         label="Province"
         class="col-start-1"
      >
         <slot
            name="province-selector"
            :model-value="state.provinceCode"
            :on-update:model-value="
               (val: typeof state.provinceCode) => (state.provinceCode = val)
            "
            :loading="loading"
         />
      </UFormField>
      <UFormField
         name="regencyCode"
         label="Regency"
      >
         <slot
            name="regency-selector"
            :model-value="state.regencyCode"
            :on-update:model-value="
               (val: typeof state.regencyCode) => (state.regencyCode = val)
            "
            :province-code="state.provinceCode"
            :loading="loading"
            :disabled="!state.provinceCode"
         />
      </UFormField>
      <UFormField
         name="districtCode"
         label="District"
      >
         <slot
            name="district-selector"
            :model-value="state.districtCode"
            :on-update:model-value="
               (val: typeof state.districtCode) => (state.districtCode = val)
            "
            :regency-code="state.regencyCode"
            :loading="loading"
            :disabled="!state.regencyCode"
         />
      </UFormField>
      <UFormField
         name="villageCode"
         label="Village"
      >
         <slot
            name="village-selector"
            :model-value="state.villageCode"
            :on-update:model-value="
               (val: typeof state.villageCode) => (state.villageCode = val)
            "
            :district-code="state.districtCode"
            :loading="loading"
            :disabled="!state.districtCode"
         />
      </UFormField>
      <UCheckbox
         v-model="state.isDefault"
         label="Set as default"
         :disabled="loading"
      />
      <div class="col-span-full mt-4 flex items-center">
         <slot name="actions">
            <UButton
               label="Submit"
               type="submit"
               icon="lucide:check"
               :loading="loading"
               class="ms-auto"
            />
         </slot>
      </div>
   </UForm>
</template>
