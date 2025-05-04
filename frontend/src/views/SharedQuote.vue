<template>
  <div class="shared-quote-page container py-5">
    <div class="row">
      <div class="col-12">
        <div class="company-info mb-5">
          <div class="company-logo mb-3">
            <img src="@/assets/images/logo-main.png" alt="Vietceramics Logo" class="img-fluid">
          </div>
          <h1 class="company-name">Công Ty Cổ Phần Quốc Tế Gốm Sứ Việt</h1>
          <div class="company-details">
            <div class="detail-item">
              <i class="fi fi-br-map-marker"></i>
              <span>Địa chỉ: 778k/2 Nguyễn Kiệm, Phường 4, Quận Phú Nhuận, TP. HCM</span>
            </div>
            <div class="detail-item">
              <i class="fi fi-br-phone"></i>
              <span>Điện thoại: +0797555299</span>
            </div>
            <div class="detail-item">
              <i class="fi fi-br-envelope"></i>
              <span>Email: vietceramics@vietceramics.com.vn</span>
            </div>
            <div class="detail-item">
              <i class="fi fi-br-globe"></i>
              <span>Website: www.vietceramics.com.vn</span>
            </div>
          </div>
        </div>

        <div class="shared-products">
          <h2 class="section-title mb-4">Danh sách sản phẩm</h2>
          
          <!-- Loading State -->
          <div v-if="loading" class="loading-state text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Đang tải danh sách sản phẩm...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!products.length" class="empty-state text-center py-5">
            <div class="empty-icon mb-3">
              <i class="fi fi-br-shopping-bag"></i>
            </div>
            <h3 class="empty-title mb-2">Không tìm thấy sản phẩm</h3>
            <p class="empty-desc mb-4">Danh sách sản phẩm không tồn tại hoặc đã bị xóa.</p>
          </div>

          <!-- Product List -->
          <div v-else class="product-list">
            <div v-for="product in products" :key="product.id" class="product-item">
              <div class="product-image">
                <img :src="product.image" :alt="product.name" class="img-fluid">
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-code">Mã: {{ product.code }}</div>
                <div class="product-price">{{ product.price }}</div>
              </div>
            </div>
          </div>

          <!-- Total Section -->
          <div class="quote-total mt-4">
            <div class="total-info">
              <span class="total-label">Tổng cộng:</span>
              <span class="total-value">{{ totalItems }} sản phẩm - {{ totalPrice }} VND</span>
            </div>
          </div>
        </div>

        <div class="contact-info mt-5">
          <h2 class="section-title mb-4">Liên hệ tư vấn</h2>
          <div class="contact-options">
            <a href="tel:02812345678" class="contact-option">
              <i class="fi fi-br-phone"></i>
              <span>Gọi điện</span>
            </a>
            <a href="https://zalo.me/123456789" class="contact-option">
              <i class="fi fi-br-comment"></i>
              <span>Zalo</span>
            </a>
            <a href="mailto:info@vietceramics.com" class="contact-option">
              <i class="fi fi-br-envelope"></i>
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SharedQuote',
  data() {
    return {
      products: [],
      loading: true
    }
  },
  created() {
    this.loadSharedProducts()
  },
  methods: {
    async loadSharedProducts() {
      try {
        const encodedData = this.$route.query.q
        if (!encodedData) {
          this.loading = false
          return
        }

        // Decode the URL-encoded data
        const decodedData = JSON.parse(decodeURIComponent(encodedData))
        if (!Array.isArray(decodedData)) {
          this.loading = false
          return
        }

        // Use the decoded data directly
        this.products = decodedData
      } catch (error) {
        console.error('Error loading shared products:', error)
      } finally {
        this.loading = false
      }
    }
  },
  computed: {
    totalItems() {
      return this.products.length;
    },
    totalPrice() {
      return this.products.reduce((sum, product) => sum + product.price, 0);
    }
  }
}
</script>

<style scoped>
.shared-quote-page {
  min-height: 100vh;
  background: #fff;
}

.company-info {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 16px;
}

.company-logo {
  max-width: 200px;
  margin: 0 auto;
}

.company-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #971b1e;
  margin-bottom: 1.5rem;
}

.company-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.detail-item i {
  color: #971b1e;
  font-size: 1.2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #971b1e;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.06);
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.25rem;
}

.product-code {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.product-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #971b1e;
}

.contact-info {
  text-align: center;
}

.contact-options {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.contact-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  text-decoration: none;
  color: #971b1e;
  transition: all 0.3s;
}

.contact-option:hover {
  background: #971b1e;
  color: white;
  transform: translateY(-2px);
}

.contact-option i {
  font-size: 1.5rem;
}

.contact-option span {
  font-size: 0.9rem;
  font-weight: 500;
}

.quote-total {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.06);
}

.total-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.total-label {
  color: #666;
}

.total-value {
  color: #971b1e;
}

@media (max-width: 768px) {
  .company-info {
    padding: 1.5rem;
  }

  .company-name {
    font-size: 1.2rem;
  }

  .detail-item {
    font-size: 0.9rem;
  }

  .product-item {
    padding: 0.75rem;
  }

  .product-image {
    width: 60px;
    height: 60px;
  }

  .product-name {
    font-size: 1rem;
  }

  .product-price {
    font-size: 1.1rem;
  }

  .contact-options {
    gap: 1rem;
  }

  .contact-option {
    padding: 0.75rem;
  }
}
</style> 