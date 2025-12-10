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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-NS378GYPDW'

const trackPageView = (to) => {
  if (typeof window === 'undefined') return
  if (!window.gtag || !GA_MEASUREMENT_ID) return

  window.gtag('event', 'page_view', {
    page_title: to?.name || document.title,
    page_location: window.location.href,
    page_path: to?.fullPath || window.location.pathname,
    send_to: GA_MEASUREMENT_ID
  })
}

router.afterEach((to) => {
  trackPageView(to)
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
