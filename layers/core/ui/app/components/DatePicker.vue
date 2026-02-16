<script setup lang="ts">
import { CalendarDate } from "@internationalized/date"
import type { Dayjs } from "dayjs"

const dayjs = useDayjs()

const model = defineModel<
   Dayjs | null | undefined,
   string,
   CalendarDate | undefined
>({
   get(val) {
      if (!val) return undefined
      return new CalendarDate(val.year(), val.month() + 1, val.date())
   },
   set(value) {
      if (!value) return undefined
      return dayjs(value.toString())
   },
})

const inputDate = useTemplateRef("inputDate")
</script>

<template>
   <UInputDate
      ref="inputDate"
      v-model="model"
   >
      <template #trailing>
         <UPopover :reference="inputDate?.inputsRef[3]?.$el">
            <UButton
               color="neutral"
               variant="link"
               size="sm"
               icon="lucide:calendar"
               aria-label="Select a date"
               class="px-0"
            />
            <template #content>
               <UCalendar
                  v-model="model"
                  class="p-2"
               />
            </template>
         </UPopover>
      </template>
   </UInputDate>
</template>
