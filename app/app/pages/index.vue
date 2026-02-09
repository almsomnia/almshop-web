<script setup lang="ts">
const appStore = useAppStore()

function onOpenDialog() {
   appStore.showDialog('Dialog Title', h('div', 'Dialog Content'))
}
</script>

<template>
   <UButton
      label="Show Dialog"
      @click="onOpenDialog"
   />
   <UButton
      label="Show Notification"
      @click="appStore.notify({ title: 'Notification Title', description: 'Notification Description' })"
   />
</template>
