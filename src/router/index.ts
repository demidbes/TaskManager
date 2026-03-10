import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/board/:id',
    component: () => import('@/pages/BoardPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
