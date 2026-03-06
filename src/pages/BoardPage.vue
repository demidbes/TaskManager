<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardStore } from '@/stores/boardStore'
import type { Task } from '@/types'
import TaskCreateEdit from '@/components/ui/TaskCreateEdit.vue'

const store = useBoardStore()
const route = useRoute()

const isModalOpen = ref(false)
const selectedTask = ref<Task | null>(null)
const selectedColumnId = ref('')

const boardId = route.params.id as string
const board = store.getBoardById(boardId)

const dragTaskId = ref('')
const dragFromColumnId = ref('')

const columnColor = ['border-blue-400', 'border-yellow-400', 'border-green-400']

const priorityBadge: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

const priorityLabel: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

// Создать таску
function createTask() {
  selectedTask.value = null
  selectedColumnId.value = board?.columns[0]?.id ?? ''
  isModalOpen.value = true
}

// Перетаскивание тасок по колонкам
function onDragStart(_event: DragEvent, taskId: string, columnId: string) {
  dragTaskId.value = taskId
  dragFromColumnId.value = columnId
}
function onDragOver(event: DragEvent) {
  event.preventDefault()
}
function onDrop(columnId: string) {
  store.moveTask(boardId, dragFromColumnId.value, columnId, dragTaskId.value)
  dragTaskId.value = ''
  dragFromColumnId.value = ''
}
// Редактирование такси
function editTask(task: Task, columnId: string) {
  selectedTask.value = task
  selectedColumnId.value = columnId
  isModalOpen.value = true
}
</script>

<template>
  <div v-if="board">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">
        <span class="text-xl font-normal text-gray-800">Доска:</span> {{ board.title }}
      </h2>
      <button
        @click="createTask()"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
      >
        Создать задачу
      </button>
    </div>
    <div class="flex flex-col justify-between gap-4 overflow-x-auto pb-4 md:flex-row">
      <div
        @dragover="onDragOver($event)"
        @drop="onDrop(column.id)"
        v-for="(column, index) in board.columns"
        :key="column.id"
        class="flex flex-col w-full px-4 py-2 bg-gray-100 rounded-xl gap-2"
      >
        <h3
          class="font-bold text-gray-900 mb-2 pb-2 border-b-2 text-center"
          :class="columnColor[index]"
        >
          {{ column.title }}
        </h3>
        <div
          v-for="task in column.tasks"
          :key="task.id"
          draggable="true"
          @dragstart="onDragStart($event, task.id, column.id)"
          class="bg-white rounded-lg p-3 shadow-sm flex flex-col gap-2 cursor-grab"
        >
          <h3 class="font-semibold text-gray-900">{{ task.title }}</h3>
          <p><span class="text-sm text-gray-500">Описание:</span> {{ task.description }}</p>
          <p>
            <span class="text-sm text-gray-500">Дата создания:</span>
            {{ new Date(task.createdAt).toLocaleDateString('ru-RU') }}
          </p>
          <p>
            <span class="text-sm text-gray-500">Приоритет:</span>
            <span
              class="text-sm px-2 py-0.5 rounded-full w-fit ml-2"
              :class="priorityBadge[task.priority]"
              >{{ priorityLabel[task.priority] }}</span
            >
          </p>
          <p>
            <span class="text-sm text-gray-500">Дедлайн:</span>
            {{ task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : '—' }}
          </p>
          <div class="flex gap-4 self-end">
            <button
              class="text-sm text-blue-500 hover:text-blue-700 cursor-pointer"
              @click="editTask(task, column.id)"
            >
              Редактировать
            </button>
            <button
              class="text-sm text-red-500 hover:text-red-700 cursor-pointer mt-auto"
              @click="store.deleteTask(boardId, column.id, task.id)"
              type="button"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Создать таску-->
    <TaskCreateEdit
      v-model:open="isModalOpen"
      :boardId="boardId"
      :columnId="selectedColumnId"
      :task="selectedTask"
    ></TaskCreateEdit>
  </div>
  <div v-else>Доска не найдена, или не существует</div>
</template>
