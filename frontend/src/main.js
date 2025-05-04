import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import Bootstrap và BootstrapVue CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import { BootstrapVue3 } from 'bootstrap-vue-3'

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

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

// Sử dụng plugins
app.use(router)
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

app.mount('#app')
