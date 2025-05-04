<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <img src="@/assets/images/logo-main.png" alt="Logo" class="login-logo">
        <h2>Đăng nhập</h2>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Tên đăng nhập</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            class="form-control"
            :class="{ 'is-invalid': errors.username }"
            placeholder="Nhập tên đăng nhập"
          >
          <div class="invalid-feedback" v-if="errors.username">
            {{ errors.username }}
          </div>
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password" 
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              placeholder="Nhập mật khẩu"
            >
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fi fi-br-eye-crossed' : 'fi fi-br-eye'"></i>
            </button>
          </div>
          <div class="invalid-feedback" v-if="errors.password">
            {{ errors.password }}
          </div>
        </div>

        <div class="form-group">
          <button 
            type="submit" 
            class="btn-login"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </div>

        <div class="alert alert-danger" v-if="error" role="alert">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const toast = useToast()
    const username = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const loading = ref(false)
    const error = ref('')
    const errors = ref({
      username: '',
      password: ''
    })

    // Check if user is already logged in
    onMounted(() => {
      const user = localStorage.getItem('user')
      if (user) {
        try {
          router.push({ path: '/' })
        } catch (err) {
          console.error('Navigation error:', err)
          window.location.href = '/'
        }
      }
    })

    const validateForm = () => {
      let isValid = true
      errors.value = {
        username: '',
        password: ''
      }

      if (!username.value) {
        errors.value.username = 'Vui lòng nhập tên đăng nhập'
        isValid = false
      }

      if (!password.value) {
        errors.value.password = 'Vui lòng nhập mật khẩu'
        isValid = false
      }

      return isValid
    }

    const handleLogin = async (e) => {
      e.preventDefault()
      
      if (!validateForm()) return

      loading.value = true
      error.value = ''

      try {
        // Mock authentication
        if (username.value === 'admin' && password.value === '123456') {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const userData = {
            username: username.value,
            role: 'admin',
            token: 'mock-token-' + Date.now(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
          localStorage.setItem('user', JSON.stringify(userData))

          window.dispatchEvent(new CustomEvent('user-logged-in', { detail: userData }))

          toast.success('Đăng nhập thành công!', {
            timeout: 3000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            closeButton: "button",
            icon: true,
            rtl: false
          })

          setTimeout(() => {
            try {
              // Lấy URL trước đó từ localStorage hoặc chuyển về trang chủ nếu không có
              const previousPath = localStorage.getItem('previousPath') || '/'
              router.replace(previousPath)
              localStorage.removeItem('previousPath') // Xóa URL trước đó sau khi sử dụng
            } catch (err) {
              console.error('Navigation error:', err)
              window.location.href = '/'
            }
          }, 1000)
        } else {
          error.value = 'Tên đăng nhập hoặc mật khẩu không đúng'
          toast.error('Tên đăng nhập hoặc mật khẩu không đúng', {
            timeout: 3000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            closeButton: "button",
            icon: true,
            rtl: false
          })
        }
      } catch (err) {
        error.value = 'Có lỗi xảy ra, vui lòng thử lại'
        toast.error('Có lỗi xảy ra, vui lòng thử lại', {
          timeout: 3000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: false,
          closeButton: "button",
          icon: true,
          rtl: false
        })
        console.error('Login error:', err)
      } finally {
        loading.value = false
      }
    }

    return {
      username,
      password,
      showPassword,
      loading,
      error,
      errors,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-logo {
  width: 120px;
  height: auto;
  margin-bottom: 1rem;
}

.login-header h2 {
  color: #971b1e;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #444;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  border-color: #971b1e;
  box-shadow: 0 0 0 0.2rem rgba(151, 27, 30, 0.15);
  outline: none;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0;
}

.toggle-password:hover {
  color: #971b1e;
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  background: #971b1e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.btn-login:hover:not(:disabled) {
  background: #7a1618;
  transform: translateY(-1px);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

@media (max-width: 576px) {
  .login-container {
    padding: 1.5rem;
  }
  
  .login-logo {
    width: 100px;
  }
  
  .login-header h2 {
    font-size: 1.3rem;
  }
}
</style> 