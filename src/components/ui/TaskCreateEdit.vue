<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Priority, Task } from '@/types'
import { useBoardStore } from '@/stores/boardStore'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps<{
  open: boolean
  boardId: string
  columnId: string
  task: Task | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const store = useBoardStore()
const taskData: Omit<Task, 'id' | 'createdAt'> = reactive({
  title: '',
  description: '',
  priority: 'low' as Priority,
  deadline: '',
})

const isEditing = computed(() => props.task !== null)

watch(
  () => props.task,
  (task) => {
    if (task) {
      Object.assign(taskData, task)
    } else {
      Object.assign(taskData, { title: '', description: '', priority: 'low', deadline: '' })
    }
  },
)

watch(
  () => props.open,
  (open) => {
    if (open && !props.task) {
      Object.assign(taskData, { title: '', description: '', priority: 'low', deadline: '' })
    }
  },
)

function submit() {
  if (isEditing.value && props.task) {
    store.updateTask(props.boardId, props.columnId, props.task.id!, taskData)
  } else {
    store.addTask(
      props.boardId,
      props.columnId,
      taskData.title,
      taskData.description ?? '',
      taskData.priority,
      taskData.deadline ?? '',
    )
  }
  emit('update:open', false)
}
</script>
<template>
  <BaseModal
    :open="open"
    @update:open="emit('update:open', $event)"
    :title="isEditing ? 'Редактировать таску' : 'Создать таску'"
  >
    <form class="flex flex-col gap-4" @submit.prevent="submit()">
      <label class="flex gap-2 text-sm text-gray-700 text-nowrap items-start"
        >Название:
        <input
          class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          required
          v-model="taskData.title"
          type="text"
      /></label>
      <label class="flex gap-2 text-sm text-gray-700 text-nowrap items-start"
        >Описание:
        <textarea
          class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          v-model="taskData.description"
        ></textarea>
      </label>
      <label class="flex gap-2 text-sm text-gray-700 text-nowrap items-start">
        Приоритет:
        <select
          class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          v-model="taskData.priority"
        >
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
      </label>

      <label class="flex gap-2 text-sm text-gray-700 text-nowrap items-start"
        >Дедлайн:
        <input
          class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          v-model="taskData.deadline"
          type="date"
      /></label>
      <button class="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
        {{ isEditing ? 'Сохранить' : 'Создать' }}
      </button>
    </form>
  </BaseModal>
</template>
