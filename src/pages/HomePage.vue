<script setup lang="ts">
import { useBoardStore } from '@/stores/boardStore'
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
const store = useBoardStore()
const newBoardTitle = ref('')
const isModalOpen = ref(false)

function addBoard(title: string) {
  store.addBoard(title)
  newBoardTitle.value = ''
  isModalOpen.value = false
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
        <h3 class="break-words text-lg font-semibold text-gray-800">
          {{ board.title }}
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
