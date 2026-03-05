import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Board, Priority, Task } from '@/types'
import { getBoards, saveBoards, generateId } from '@/services/storageService'

export const useBoardStore = defineStore('board', () => {
  const boards = ref<Board[]>(getBoards())

  function addBoard(title: string): void {
    const board: Board = {
      id: generateId(),
      title: title,
      createdAt: Date.now(),
      columns: [
        { id: generateId(), title: 'To Do', tasks: [] },
        { id: generateId(), title: 'In Progress', tasks: [] },
        { id: generateId(), title: 'Done', tasks: [] },
      ],
    }
    boards.value.push(board)
    saveBoards(boards.value)
  }
  function deleteBoard(boardId: string): void {
    boards.value = boards.value.filter((b: Board) => b.id !== boardId)
    saveBoards(boards.value)
  }
  function getBoardById(boardId: string) {
    return boards.value.find((b: Board) => b.id === boardId)
  }
  function addTask(
    boardId: string,
    columnId: string,
    title: string,
    description: string,
    priority: Priority,
    deadline: string,
  ) {
    const task: Task = {
      id: generateId(),
      title: title,
      description: description,
      createdAt: Date.now(),
      priority: priority,
      deadline: deadline,
    }

    const board = getBoardById(boardId)
    if (!board) return

    const column = board.columns.find((c) => {
      return c.id === columnId
    })
    if (!column) return

    column.tasks.push(task)
    saveBoards(boards.value)
  }
  function deleteTask(boardId: string, columnId: string, taskId: string) {
    const board = getBoardById(boardId)
    if (!board) return

    const column = board.columns.find((c) => c.id === columnId)
    if (!column) return

    column.tasks = column.tasks.filter((t: Task) => t.id !== taskId)
    saveBoards(boards.value)
  }
  function moveTask(boardId: string, fromColumnId: string, toColumnId: string, taskId: string) {
    const board = getBoardById(boardId)
    if (!board) return

    const fromColumn = board.columns.find((c) => c.id === fromColumnId)
    const toColumn = board.columns.find((c) => c.id === toColumnId)
    if (!fromColumn || !toColumn) return

    const task = fromColumn.tasks.find((t) => t.id === taskId)
    if (!task) return

    fromColumn.tasks = fromColumn.tasks.filter((t) => t.id !== taskId)
    toColumn.tasks.push(task)
    saveBoards(boards.value)
  }
  return { boards, addBoard, deleteBoard, getBoardById, addTask, deleteTask, moveTask }
})
