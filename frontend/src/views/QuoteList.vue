<template>
  <div class="quote-list-page container py-5">
    <div class="row">
      <div class="col-12">
        <h1 class="page-title mb-4">Danh sách báo giá</h1>
        
        <!-- Empty State -->
        <div v-if="!quoteItems.length" class="empty-state text-center py-5">
          <div class="empty-icon mb-3">
            <i class="fi fi-br-shopping-bag"></i>
          </div>
          <h3 class="empty-title mb-2">Danh sách báo giá trống</h3>
          <p class="empty-desc mb-4">Bạn chưa thêm sản phẩm nào vào danh sách báo giá.</p>
          <router-link to="/" class="btn-back-home">
            <i class="fi fi-br-arrow-left"></i>
            <span>Quay về trang chủ</span>
          </router-link>
        </div>

        <!-- Quote List -->
        <div v-else class="quote-list">
          <div class="quote-items">
            <div v-for="(item, index) in quoteItems.slice(0, 10)" :key="index" class="quote-item">
              <div class="item-image">
                <img :src="item.image" :alt="item.name" class="img-fluid">
              </div>
              <div class="item-info">
                <h3 class="item-name">{{ item.name }}</h3>
                <div class="item-code">Mã: {{ item.code }}</div>
                <div class="item-price">{{ item.price }}</div>
              </div>
              <div class="item-actions">
                <button class="btn-remove" @click="removeItem(index)">
                  <i class="fi fi-br-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Total Section -->
          <div class="quote-total mt-4">
            <div class="total-info">
              <span class="total-label">Tổng cộng:</span>
              <span class="total-value">{{ totalItems }} sản phẩm</span>
            </div>
            <div v-if="quoteItems.length > 10" class="total-warning">
              <i class="fi fi-br-info"></i>
              <span>Chỉ hiển thị 10 sản phẩm đầu tiên khi chia sẻ</span>
            </div>
          </div>

          <div class="quote-actions mt-4">
            <button class="btn-clear" @click="clearList">
              <i class="fi fi-br-trash"></i>
              <span>Xóa tất cả</span>
            </button>
            <button class="btn-share" @click="shareQuote">
              <i class="fi fi-br-share"></i>
              <span>Chia sẻ</span>
            </button>
            <button class="btn-create-quote" @click="createQuote">
              <i class="fi fi-br-file-invoice"></i>
              <span>Tạo báo giá</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Popup -->
    <div v-if="showSharePopup" class="share-popup-overlay">
      <div class="share-popup">
        <div class="share-popup-header">
          <h3>Chia sẻ danh sách báo giá</h3>
          <button class="btn-close" @click="showSharePopup = false">
            <i class="fi fi-br-cross"></i>
          </button>
        </div>
        <div class="share-popup-content">
          <div class="share-url-container">
            <input 
              type="text" 
              :value="shareUrl" 
              readonly 
              class="share-url-input"
              ref="shareUrlInput"
            >
            <button class="btn-copy" @click="copyShareUrl">
              <i class="fi fi-br-copy"></i>
            </button>
          </div>
          <div class="qrcode-container">
            <qrcode-vue :value="shareUrl" :size="200" level="H" />
            <p class="qrcode-desc">Quét mã QR để xem danh sách báo giá</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'QuoteList',
  components: {
    QrcodeVue
  },
  data() {
    return {
      quoteItems: [],
      showSharePopup: false,
      shareUrl: ''
    };
  },
  created() {
    this.loadQuoteItems();
    // Check if there's a shared quote in URL
    const sharedQuote = this.$route.query.q;
    if (sharedQuote) {
      this.loadSharedQuote(sharedQuote);
    }
  },
  methods: {
    loadQuoteItems() {
      const items = localStorage.getItem('quoteItems');
      this.quoteItems = items ? JSON.parse(items) : [];
    },
    removeItem(index) {
      this.quoteItems.splice(index, 1);
      this.saveQuoteItems();
    },
    clearList() {
      if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách báo giá?')) {
        this.quoteItems = [];
        this.saveQuoteItems();
      }
    },
    saveQuoteItems() {
      localStorage.setItem('quoteItems', JSON.stringify(this.quoteItems));
    },
    createQuote() {
      // TODO: Implement quote creation logic
      console.log('Creating quote with items:', this.quoteItems);
    },
    shareQuote() {
      if (!this.quoteItems.length) {
        alert('Danh sách báo giá trống. Vui lòng thêm sản phẩm trước khi chia sẻ.');
        return;
      }

      // Create share data with full product information
      const shareData = this.quoteItems.map(item => ({
        id: item.id,
        name: item.name,
        code: item.code,
        image: item.image,
        price: item.price
      }));

      // First encode the JSON string to handle Unicode characters
      const jsonString = JSON.stringify(shareData);
      const encodedJson = encodeURIComponent(jsonString);
      
      // Create share URL
      this.shareUrl = `${window.location.origin}/bao-gia-chia-se?q=${encodedJson}`;
      
      // Show popup
      this.showSharePopup = true;
    },
    copyShareUrl() {
      this.$refs.shareUrlInput.select();
      document.execCommand('copy');
      alert('Đã sao chép link chia sẻ vào clipboard!');
    },
    loadSharedQuote(encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        if (Array.isArray(decodedData)) {
          // Load product details for each item
          decodedData.forEach(async (item) => {
            try {
              const response = await axios.get(`/api/products/${item.id}`);
              if (response.data) {
                const product = response.data;
                this.quoteItems.push({
                  id: product.id,
                  name: product.name,
                  code: product.code,
                  image: product.image,
                  price: product.price
                });
                this.saveQuoteItems();
              }
            } catch (error) {
              console.error('Error loading product:', error);
            }
          });
        }
      } catch (error) {
        console.error('Error decoding shared quote:', error);
      }
    }
  },
  computed: {
    totalItems() {
      return this.quoteItems.length;
    }
  }
};
</script>

<style scoped>
.quote-list-page {
  min-height: 100vh;
  background: #fff;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #971b1e;
}

.empty-state {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 40px;
}

.empty-icon {
  font-size: 4rem;
  color: #971b1e;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #971b1e;
}

.empty-desc {
  color: #666;
  font-size: 1.1rem;
}

.btn-back-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #971b1e;
  color: white;
  border-radius: 24px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-back-home:hover {
  background: #b31f23;
  transform: translateY(-2px);
}

.quote-list {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
}

.quote-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quote-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.06);
  transition: all 0.3s;
}

.quote-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(151, 27, 30, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
}

.item-code {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 4px;
}

.item-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #971b1e;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.btn-remove {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  border: none;
  color: #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: #dc3545;
  color: white;
  transform: scale(1.1);
}

.quote-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.btn-clear,
.btn-share,
.btn-create-quote {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-clear {
  background: #f8f9fa;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.btn-clear:hover {
  background: #dc3545;
  color: white;
  transform: translateY(-2px);
}

.btn-share {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8f9fa;
  color: #0d6efd;
  border: 1px solid #0d6efd;
}

.btn-share:hover {
  background: #0d6efd;
  color: white;
  transform: translateY(-2px);
}

.btn-create-quote {
  background: #971b1e;
  color: white;
  border: none;
}

.btn-create-quote:hover {
  background: #b31f23;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .empty-icon {
    font-size: 3rem;
  }

  .empty-title {
    font-size: 1.2rem;
  }

  .empty-desc {
    font-size: 1rem;
  }

  .quote-list {
    padding: 16px;
  }

  .quote-item {
    padding: 12px;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .item-name {
    font-size: 1rem;
  }

  .item-price {
    font-size: 1.1rem;
  }

  .btn-remove {
    width: 32px;
    height: 32px;
  }

  .btn-clear,
  .btn-share,
  .btn-create-quote {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}

/* Share Popup Styles */
.share-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.share-popup {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.share-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.share-popup-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #971b1e;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.btn-close:hover {
  color: #971b1e;
}

.share-popup-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.share-url-container {
  display: flex;
  gap: 8px;
}

.share-url-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #666;
  background: #f8f9fa;
}

.btn-copy {
  background: #971b1e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-copy:hover {
  background: #b31f23;
  transform: translateY(-2px);
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
}

.qrcode-desc {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .share-popup {
    width: 95%;
    padding: 16px;
  }

  .share-popup-header h3 {
    font-size: 1.2rem;
  }

  .share-url-input {
    font-size: 0.8rem;
    padding: 8px;
  }

  .qrcode-container {
    padding: 16px;
  }

  .qrcode-desc {
    font-size: 0.8rem;
  }
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

.total-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffc107;
  font-size: 0.9rem;
}

.total-warning i {
  font-size: 1rem;
}
</style> 