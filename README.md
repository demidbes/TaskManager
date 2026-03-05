# TaskFlow

Канбан-менеджер задач на Vue 3. Создавай доски, управляй задачами по колонкам, перетаскивай карточки мышью.

## Возможности

- Создание и удаление досок
- Три колонки на каждой доске: To Do, In Progress, Done
- Создание задач с названием, описанием, приоритетом и дедлайном
- Drag & drop задач между колонками
- Цветные бейджи приоритета: низкий (зелёный), средний (жёлтый), высокий (красный)
- Данные сохраняются в localStorage — бэкенд не нужен

## Технологии

- **Vue 3** — Composition API, `<script setup>`
- **TypeScript**
- **Pinia** — управление состоянием
- **Vue Router** — клиентская маршрутизация
- **Tailwind CSS v4**
- **Vite 7**

## Запуск

```bash
# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev

# Собрать для продакшена
npm run build
```

## Структура проекта

```
src/
├── pages/
│   ├── HomePage.vue       # Список досок
│   └── BoardPage.vue      # Колонки и задачи
├── components/
│   └── ui/
│       └── BaseModal.vue  # Модалка создания задачи
├── stores/
│   └── boardStore.ts      # Pinia store
├── services/
│   └── storageService.ts  # Работа с localStorage
├── router/
│   └── index.ts
├── types/
│   └── index.ts           # Board, Column, Task, Priority
└── style.css
```

## Автор

[Demidbes](https://github.com/demidbes)
