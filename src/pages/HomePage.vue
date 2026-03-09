<script setup lang="ts">
import { useBoardStore } from '@/stores/boardStore'
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
const store = useBoardStore()
const newBoardTitle = ref('')
const isModalOpen = ref(false)

const boardEditId = ref('')
const boardEditTitle = ref('')

function addBoard(title: string) {
  store.addBoard(title)
  newBoardTitle.value = ''
  isModalOpen.value = false
}

function editBoardTitle(boardId: string, currentTitle: string) {
  boardEditId.value = boardId
  boardEditTitle.value = currentTitle
}

function saveBoardTitle() {
  store.updateBoardTitle(boardEditId.value, boardEditTitle.value)
  boardEditId.value = ''
  boardEditTitle.value = ''
}
</script>

<template>
  <!-- Кнопка создания доски -->
  <button
    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
    @click="isModalOpen = true"
  >
    Создать доску
  </button>
  <BaseModal v-model:open="isModalOpen" title="Создать доску">
    <form class="flex items-end gap-3" @submit.prevent="addBoard(newBoardTitle)">
      <label class="flex flex-col gap-1">
        Название:
        <input
          class="border border-gray-300 rounded-md px-3 py-2"
          required
          v-model="newBoardTitle"
          type="text"
        />
      </label>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
        Создать
      </button>
    </form>
  </BaseModal>

  <!-- Сами доски -->
  <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
    <li v-for="board in store.boards" :key="board.id">
      <article
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3 h-full"
      >
        <form class="flex gap-3" @submit.prevent="saveBoardTitle" v-if="boardEditId === board.id">
          <input
            class="text-lg font-semibold text-gray-800 w-auto border-0 border-b-2 border-black outline-none pr-2"
            v-model="boardEditTitle"
            autofocus
            :size="boardEditTitle.length || 1"
          />
          <button class="text-green-600 text-lg cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>
        </form>
        <h3 v-else class="flex gap-3 break-words text-lg font-semibold text-gray-800">
          {{ board.title }}
          <button class="text-blue-600" @click="editBoardTitle(board.id, board.title)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </button>
        </h3>
        <p>
          <span class="text-sm text-gray-500">Добавлена:</span>
          {{ new Date(board.createdAt).toLocaleDateString('ru-RU') }}
        </p>
        <p>
          <span class="text-sm text-gray-500">Кол-во тасок:</span>
          {{ board.columns.reduce((sum, c) => sum + c.tasks.length, 0) }}
        </p>
        <div class="flex gap-3 mt-auto">
          <button
            @click="store.deleteBoard(board.id)"
            class="border border-red-200 rounded-lg text-red-600 px-3 py-1.5 text-sm hover:bg-red-50 cursor-pointer"
          >
            Удалить
          </button>
          <router-link
            class="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
            :to="'/board/' + board.id"
            >Перейти</router-link
          >
        </div>
      </article>
    </li>
  </ul>
</template>
