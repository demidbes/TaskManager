<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function close() {
  emit('update:open', false)
}
</script>
<template>
  <Teleport to="body">
    <div class="fixed inset-0 flex items-center justify-center z-50" v-if="open">
      <div class="absolute inset-0 bg-black/50" @click="close()"></div>
      <div class="relative bg-white rounded-xl shadow-xl p-6 m-2 w-full max-w-md">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ title }}</h2>
        <button
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          @click="close"
        >
          x
        </button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
