import type { Board } from '@/types'

const STORAGE_KEY = 'boards'

export function getBoards(): Board[] {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
        return JSON.parse(data)
    }
    return []
}

export function saveBoards(boards: Board[]): void {
    localStorage.setItem(STORAGE_KEY , JSON.stringify(boards))
}

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
}