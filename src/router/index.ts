import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import BoardPage from '@/pages/BoardPage.vue'

const routes = [
    {path: '/', component: HomePage},
     {path: '/board/:id', component: BoardPage},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
