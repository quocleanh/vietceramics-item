import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuoteList from '../views/QuoteList.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/san-pham/:id',
    name: 'product-detail',
    component: () => import('../views/ProductDetail.vue')
  },
  {
    path: '/danh-muc',
    name: 'catalog',
    component: () => import('../views/Catalog.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/quote-list',
    name: 'QuoteList',
    component: QuoteList
  },
  {
    path: '/bao-gia-chia-se',
    name: 'SharedQuote',
    component: () => import('../views/SharedQuote.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/Error404.vue')
  }
]

export const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  }
  return { top: 0 }
}

export const createAppRouter = () =>
  createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior
  })

export default createAppRouter
