import './assets/main.css'

import { nextTick } from 'vue'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes, scrollBehavior } from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import Bootstrap và BootstrapVue CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import { BootstrapVue3 } from 'bootstrap-vue-3'

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.css'

const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
}

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior
  },
  ({ app, router }) => {
    // Plugins
    app.use(BootstrapVue3)
    app.use(Toast, toastOptions)

    // Directive v-lazy cho lazy loading hình ảnh
    app.directive('lazy', {
      mounted(el, binding) {
        function loadImage() {
          el.src = binding.value
          el.addEventListener('load', () => {
            if (el.complete && el.naturalHeight !== 0) {
              // Khi ảnh load xong thì loại bỏ class loading nếu có
              el.classList.remove('lazy-loading')
              el.classList.add('lazy-loaded')
            }
          })
        }

        function handleIntersect(entries, observer) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadImage()
              observer.unobserve(el)
            }
          })
        }

        // Sử dụng Intersection Observer API nếu trình duyệt hỗ trợ
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver(handleIntersect, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
          })
          observer.observe(el)
        } else {
          // Fallback cho trình duyệt không hỗ trợ Intersection Observer
          loadImage()
        }
      }
    })

    router.isReady().then(() => {
      if (typeof document !== 'undefined') {
        nextTick(() => {
          document.dispatchEvent(new Event('app-rendered'))
        })
      }
    })
  }
)
