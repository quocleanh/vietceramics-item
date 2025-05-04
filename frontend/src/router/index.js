import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuoteList from '../views/QuoteList.vue'

const routes = [
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
    component: () => import('../views/Login.vue'),
    beforeEnter: (to, from) => {
      // Lưu URL trước đó vào localStorage
      if (from.path !== '/login') {
        localStorage.setItem('previousPath', from.path)
      }
    }
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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Remove navigation guard
// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login']
//   const authRequired = !publicPages.includes(to.path)
//   const loggedIn = localStorage.getItem('user')
// 
//   if (authRequired && !loggedIn) {
//     return next('/login')
//   }
// 
//   next()
// })

export default router 