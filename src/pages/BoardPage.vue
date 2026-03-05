<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardStore } from '@/stores/boardStore'
import type { Priority } from '@/types'
import BaseModal from '@/components/ui/BaseModal.vue'

const store = useBoardStore()
const route = useRoute()

const isModalOpen = ref(false)

const boardId = route.params.id as string
const board = store.getBoardById(boardId)
const firstColumnId = board?.columns[0]?.id ?? ''

const dragTaskId = ref('')
const dragFromColumnId = ref('')

const columnColor = ['border-blue-400', 'border-yellow-400', 'border-green-400']

const priorityBadge: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

const taskData = reactive({
  title: '',
  description: '',
  priority: 'low' as Priority,
  deadline: '',
})

function clearTaskData() {
  Object.assign(taskData, { title: '', description: '', priority: 'low', deadline: '' })
}

function addTask() {
  store.addTask(
    boardId,
    firstColumnId,
    taskData.title,
    taskData.description,
    taskData.priority,
    taskData.deadline,
  )
  clearTaskData()
  isModalOpen.value = false
}

function onDragStart(event: DragEvent, taskId: string, columnId: string) {
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
</script>

<template>
  <div v-if="board">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">
        <span class="text-xl font-normal text-gray-800">Доска:</span> {{ board.title }}
      </h2>
      <button
        @click="isModalOpen = true"
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
              >{{ task.priority }}</span
            >
          </p>
          <p>
            <span class="text-sm text-gray-500">Дедлайн:</span>
            {{ task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : '—' }}
          </p>
          <button
            class="text-sm text-red-500 hover:text-red-700 cursor-pointer mt-auto self-end"
            @click="store.deleteTask(boardId, column.id, task.id)"
            type="button"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
    <!-- Создать таску-->
    <BaseModal v-model:open="isModalOpen" title="Создать таску">
      <form class="flex flex-col gap-4" @submit.prevent="addTask">
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
        <button
          class="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Создать
        </button>
      </form>
    </BaseModal>
  </div>
  <div v-else>Доска не найдена, или не существует</div>
</template>
