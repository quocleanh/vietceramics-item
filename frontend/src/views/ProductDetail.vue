<template>
  <div class="product-detail container py-5" v-if="product">
    <div class="row">
      <!-- Gallery -->
      <div class="col-md-6 mb-4">
        <div class="gallery-wrapper">
          <div class="main-image mb-3 position-relative">
            <!-- Image Type Selection Overlay -->
            <div class="image-type-overlay">
              <button class="type-btn" :class="{ active: currentImageType === 'product' }"
                @click="jumpToImageType('product')">
                <i class="fi fi-br-box"></i>
                <span>Hình sản phẩm</span>
              </button>
              <button class="type-btn" :class="{ active: currentImageType === 'perspective' }"
                @click="jumpToImageType('perspective')">
                <i class="fi fi-br-layout-fluid"></i>
                <span>Hình phối cảnh</span>
              </button>
              <button class="type-btn" :class="{ active: currentImageType === 'real' }"
                @click="jumpToImageType('real')">
                <i class="fi fi-br-camera"></i>
                <span>Hình thực tế</span>
              </button>
            </div>

            <img :src="currentImage" class="img-fluid main-img" :alt="product.name"
              @click="openGallery(currentImageIndex)">
            <span class="zoom-icon" @click="openGallery(currentImageIndex)">
              <img src="https://cdn-icons-png.flaticon.com/128/8535/8535541.png" width="20" height="20" alt="Zoom Icon"
                class="zoom-icon-img">
            </span>

            <!-- Main image navigation buttons -->
            <button v-if="allImages.length > 1" class="nav-btn prev-btn" @click.stop="navigateImage('prev')"
              :disabled="currentImageIndex === 0">
              <i class="fi fi-br-angle-left"></i>
            </button>
            <button v-if="allImages.length > 1" class="nav-btn next-btn" @click.stop="navigateImage('next')"
              :disabled="currentImageIndex === allImages.length - 1">
              <i class="fi fi-br-angle-right"></i>
            </button>
          </div>

          <div class="thumbnails-wrapper position-relative">
            <button v-if="showLeftArrow" class="thumb-nav-btn left" @click="scrollThumbnails('left')">
              <i class="fi fi-br-angle-left"></i>
            </button>
            <div class="thumbnails d-flex justify-content-start gap-2" ref="thumbnails" @scroll="updateThumbArrows">
              <div v-for="(image, index) in allImages" :key="index" class="thumbnail-item"
                :class="{ active: index === currentImageIndex }" @click="selectThumbnail(index, $event)"
                :ref="index === currentImageIndex ? 'activeThumb' : null">
                <img :src="image" class="img-fluid thumb-img" :alt="product.name">
              </div>
            </div>
            <button v-if="showRightArrow" class="thumb-nav-btn right" @click="scrollThumbnails('right')">
              <i class="fi fi-br-angle-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="col-md-6 d-flex flex-column flex-start">
        <h1 class="product-name mb-2">{{ product.name }}</h1>
        <div class="product-code mb-2">Mã sản phẩm: <span>{{ product.itemCode }}</span></div>

        <!-- Price section -->
        <div class="product-price-wrapper mb-3" v-if="isLoggedIn">
          <div class="product-price">
            <div class="current-price">{{ product.price }}</div>
            <div class="original-price">{{ product.originalPrice }}</div>
          </div>
          <div class="price-note">Giá áp dụng tại HCM, chưa bao gồm phí vận chuyển</div>
        </div>
        <div v-else class="login-required-notice price-notice mb-3" @click="goToLogin">
          <i class="fi fi-br-lock"></i>
          <span>Vui lòng đăng nhập để xem giá</span>
        </div>

        <!-- Add to favorite button -->
        <div class="favorite-btn-wrapper mb-4 d-flex flex-start">
          <button class="btn-add-to-quote" @click="addToQuote">
            <i class="fi fi-br-file-invoice"></i>
            <span>Thêm vào báo giá</span>
          </button>
        </div>

        <!-- Lot Price Section -->
        <div class="lot-price-section mb-4">
          <div class="lot-price-header" @click="toggleLotPrice">
            <h3 class="section-title">Giá theo lô</h3>
            <i class="fi" :class="showLotPrice ? 'fi-br-angle-up' : 'fi-br-angle-down'"></i>
          </div>
          <div class="lot-price-content" v-if="showLotPrice">
            <div class="lot-price-table">
              <div class="lot-price-header">
                <div class="lot-code">Mã lô</div>
                <div class="lot-price">Giá bán</div>
                <div class="lot-status">Trạng thái</div>
              </div>
              <div class="lot-price-body">
                <div class="lot-price-row" v-for="(lot, index) in product.lotPrices" :key="index">
                  <div class="lot-code">{{ lot.code }}</div>
                  <div class="lot-price">{{ lot.price }}</div>
                  <div class="lot-status">
                    <span :class="['status-badge', lot.status === 'available' ? 'available' : 'sold']">
                      {{ lot.status === 'available' ? 'Còn hàng' : 'Đã bán' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Product Info -->
        <div class="additional-info">
          <div class="info-item">
            <i class="fi fi-br-ruler"></i>
            <div class="info-content">
              <div class="info-label">Kích thước</div>
              <div class="info-value">{{ product.specifications['Kích thước'] }}</div>
            </div>
          </div>
          <div class="info-item">
            <i class="fi fi-br-palette"></i>
            <div class="info-content">
              <div class="info-label">Màu sắc</div>
              <div class="info-value">{{ product.specifications['Màu sắc'] }}</div>
            </div>
          </div>
          <div class="info-item">
            <i class="fi fi-br-shield-check"></i>
            <div class="info-content">
              <div class="info-label">Bảo hành</div>
              <div class="info-value">{{ product.specifications['Bảo hành'] }}</div>
            </div>
          </div>
          <!-- Thương hiệu -->
          <div class="info-item" v-if="isLoggedIn">
            <i class="fi fi-br-bookmark"></i>
            <div class="info-content">
              <div class="info-label">Thương hiệu</div>
              <div class="info-value">{{ product.specifications['Thương hiệu'] }}</div>
            </div>
          </div>
          <div v-else class="info-item login-required-notice" @click="goToLogin">
            <i class="fi fi-br-lock"></i>
            <div class="info-content">
              <div class="info-label">Thương hiệu</div>
              <div class="info-value">Đăng nhập để xem thông tin</div>
            </div>
          </div>
           
        </div>

        <!-- Certificates -->
        <div class="certificates">
          <div class="cert-item">
            <img src="https://cdn-icons-png.flaticon.com/128/1006/1006771.png" alt="ISO" class="cert-icon">
            <div class="cert-label">ISO 9001</div>
          </div>
          <div class="cert-item">
            <img src="https://cdn-icons-png.flaticon.com/128/1006/1006771.png" alt="CE" class="cert-icon">
            <div class="cert-label">CE Mark</div>
          </div>
          <div class="cert-item">
            <img src="https://cdn-icons-png.flaticon.com/128/1006/1006771.png" alt="Green" class="cert-icon">
            <div class="cert-label">Green Label</div>
          </div>
        </div>
      </div>
    </div>


    <!-- Combo Section -->
    <div v-if="product.productType === 'bath' && product.comboItems && product.comboItems.length"
      class="combo-section mt-5">
      <h3 class="section-title mb-4">Combo tiết kiệm</h3>
      <div class="combo-wrapper">
        <div class="combo-item" v-for="(item, index) in product.comboItems" :key="index">
          <div class="combo-image">
            <img :src="item.image" :alt="item.name" class="img-fluid">
            <div class="combo-discount">{{ item.discount }}</div>
          </div>
          <div class="combo-info">
            <div class="combo-name">{{ item.name }}</div>
            <div class="combo-price-wrapper">
              <div class="combo-price">{{ item.price }}</div>
              <div class="combo-original-price">{{ item.originalPrice }}</div>
            </div>
            <label class="combo-select">
              <input type="checkbox" v-model="item.selected" @change="updateComboTotal">
              <span class="checkmark"></span>
              <span class="select-label">Thêm vào combo</span>
            </label>
          </div>
        </div>
        <div class="combo-total">
          <div class="total-label">Tổng giá trị</div>
          <div class="total-price">{{ selectedComboTotal }}</div>
          <div class="combo-save">Tiết kiệm: {{ selectedComboSave }}</div>
        </div>
      </div>
    </div>

    <!-- Long Desc -->
    <div class="row mt-5">
      <div class="col-12">
        <h3 class="section-title mb-3">Mô tả sản phẩm</h3>
        <div class="long-description">{{ product.longDescription }}</div>
      </div>
    </div>


    <!-- Specifications -->
    <div class="row mt-5">
      <div class="col-12">
        <h3 class="section-title mb-3">Thông số kỹ thuật</h3>
        <div class="specs-table row">
          <div class="col-md-6" v-for="(chunk, i) in specsChunks" :key="i">
            <table class="table specs-table-inner">
              <tbody>
                <tr v-for="(value, key) in chunk" :key="key">
                  <td class="spec-key">{{ key }}</td>
                  <td class="spec-value">{{ value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Fancybox Gallery -->
    <div class="gallery" ref="gallery">
      <a v-for="(image, index) in allImages" :key="index" :data-fancybox="'gallery'" :data-src="image"
        :data-caption="product.name" :data-download-src="image">
        <img :src="image" :alt="product.name" style="display: none;" />
      </a>
    </div>
  </div>
  <!-- Skeleton Loading -->
  <div v-else-if="loading" class="skeleton-wrapper">
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="skeleton skeleton-image mb-3"></div>
        <div class="d-flex gap-2">
          <div class="skeleton skeleton-thumb" v-for="n in 4" :key="n"></div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="skeleton skeleton-title mb-3"></div>
        <div class="skeleton skeleton-code mb-2"></div>
        <div class="skeleton skeleton-price mb-2"></div>
        <div class="skeleton skeleton-price-note mb-3"></div>
        <div class="d-flex gap-2 mt-3">
          <div class="skeleton skeleton-cert" v-for="n in 3" :key="'cert' + n"></div>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12">
        <div class="skeleton skeleton-section-title mb-3"></div>
        <div class="skeleton skeleton-long-desc mb-3"></div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12">
        <div class="skeleton skeleton-section-title mb-3"></div>
        <div class="skeleton skeleton-spec mb-2" v-for="n in 6" :key="'spec' + n"></div>
      </div>
    </div>
  </div>
  <!-- Không tìm thấy sản phẩm -->
  <div v-else-if="!product || !product.name" class="notfound-wrapper">
    <div class="notfound-icon mb-3">
      <i class="fi fi-br-search-alt"></i>
    </div>
    <div class="notfound-title mb-2">Không tìm thấy nội dung sản phẩm</div>
    <div class="notfound-desc mb-3">Sản phẩm này có thể đã bị xoá hoặc không tồn tại. Vui lòng kiểm tra lại hoặc quay về
      trang chủ.</div>
    <a href="/" class="notfound-btn">Về trang chủ</a>
  </div>
</template>

<script>
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { useToast } from 'vue-toastification';
import { useHead } from '@vueuse/head';
import { productService } from '@/services/productService';

export default {
  name: 'ProductDetail',
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      currentImageIndex: 0,
      currentImageType: 'product',
      product: null,
      showLeftArrow: false,
      showRightArrow: false,
      showLotPrice: false,
      loading: true,
      images: [],
      images_perspective: [],
      images_real: [],
      error: null
    };
  },
  computed: {
    // Tổng hợp tất cả hình ảnh từ các nguồn
    allImages() {
      return [
        ...(this.product?.images || []),
        ...(this.images_perspective || []),
        ...(this.product?.images_real || [])
      ];
    },
    // Lấy hình ảnh hiện tại đang hiển thị
    currentImage() {
      return this.allImages[this.currentImageIndex] || '';
    },
    // Chia thông số kỹ thuật thành 2 cột
    specsChunks() {
      if (!this.product) return [];
      const entries = Object.entries(this.product.specifications);
      const mid = Math.ceil(entries.length / 2);
      return [
        Object.fromEntries(entries.slice(0, mid)),
        Object.fromEntries(entries.slice(mid))
      ];
    },
    // Lấy danh sách sản phẩm combo đã chọn
    selectedComboItems() {
      return this.product?.comboItems?.filter(item => item.selected) || [];
    },
    // Tính tổng giá combo
    selectedComboTotal() {
      if (!this.product?.comboItems) return '0đ';
      const mainProductPrice = parseInt(this.product.price.replace(/[^\d]/g, ''));
      const comboItemsTotal = this.product.comboItems
        .filter(item => item.selected)
        .reduce((sum, item) => {
          const price = parseInt(item.price.replace(/[^\d]/g, ''));
          return sum + price;
        }, 0);
      return this.formatPrice(mainProductPrice + comboItemsTotal);
    },
    // Tính số tiền tiết kiệm khi mua combo
    selectedComboSave() {
      if (!this.product?.comboItems) return '0đ';
      const mainProductOriginalPrice = parseInt(this.product.originalPrice.replace(/[^\d]/g, ''));
      const comboItemsOriginalTotal = this.product.comboItems
        .filter(item => item.selected)
        .reduce((sum, item) => {
          const price = parseInt(item.originalPrice.replace(/[^\d]/g, ''));
          return sum + price;
        }, 0);
      const totalOriginal = mainProductOriginalPrice + comboItemsOriginalTotal;
      const total = parseInt(this.selectedComboTotal.replace(/[^\d]/g, ''));
      const save = totalOriginal - total;
      return this.formatPrice(save);
    },
    // Kiểm tra trạng thái đăng nhập
    isLoggedIn() {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          return new Date(parsedUser.expiresAt) > new Date();
        } catch (e) {
          return false;
        }
      }
      return false;
    }
  },
  methods: {
    async loadImages() {
      try {
        // Tải song song các loại hình ảnh
        const [productImages, perspectiveImages, realImages] = await Promise.all([
          productService.getProductImages(this.product.No_, 'product'),
          productService.getProductImages(this.product.No_, 'perspective'),
          productService.getProductImages(this.product.No_, 'real')
        ]);

        this.images = productImages;
        this.images_perspective = perspectiveImages;
        this.images_real = realImages;
      } catch (error) {
        console.error('Error loading images:', error);
        this.toast.error('Không thể tải hình ảnh sản phẩm');
      }
    },

    async fetchProduct() {
      this.loading = true;
      this.error = null;

      try {
        // Gọi API lấy thông tin sản phẩm
        this.product = await productService.getProductDetail(this.$route.params.id);

        // Ẩn thông tin nhạy cảm nếu chưa đăng nhập
        if (!this.isLoggedIn) {
          this.product.specifications['Thương hiệu'] = 'Đăng nhập để xem thông tin';
          this.product.specifications['Xuất xứ'] = 'Đăng nhập để xem thông tin';
        }

        // Tải hình ảnh sau khi có thông tin sản phẩm
        await this.loadImages();
      } catch (error) {
        console.error('Error fetching product:', error);
        this.error = 'Không thể tải thông tin sản phẩm';
        this.toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    // Chọn thumbnail
    selectThumbnail(index, event) {
      this.currentImageIndex = index;
      this.scrollActiveThumbIntoView();
    },

    // Cuộn thumbnail đang active vào vùng nhìn thấy
    scrollActiveThumbIntoView() {
      this.$nextTick(() => {
        const activeThumb = this.$refs.activeThumb;
        const container = this.$refs.thumbnails;
        if (activeThumb && activeThumb[0] && container) {
          // ... logic cuộn
        }
      });
    },

    // Mở gallery xem ảnh full màn hình
    openGallery(index) {
      Fancybox.show(
        this.allImages.map(image => ({
          src: image,
          caption: this.product.name,
          downloadSrc: image
        })),
        {
          startIndex: index,
          // ... cấu hình gallery
        }
      );
    },

    // Chuyển đổi giữa các loại hình ảnh
    jumpToImageType(type) {
      this.currentImageType = type;
      if (type === 'product') {
        this.currentImageIndex = 0;
      } else if (type === 'perspective') {
        this.currentImageIndex = this.product?.images?.length || 0;
      } else {
        this.currentImageIndex = (this.product?.images?.length || 0) + (this.images_perspective?.length || 0);
      }
      this.$nextTick(() => {
        this.scrollActiveThumbIntoView();
      });
    },

    // Thêm sản phẩm vào báo giá
    addToQuote() {
      if (!this.product) return;

      // Kiểm tra đăng nhập
      if (!this.isLoggedIn) {
        this.toast.error('Vui lòng đăng nhập để thêm sản phẩm vào báo giá', {
          // ... cấu hình toast
        });
        return;
      }

      // Thêm vào danh sách báo giá trong localStorage
      let quoteItems = JSON.parse(localStorage.getItem('quoteItems') || '[]');
      const existingItem = quoteItems.find(item => item.id === this.product.id);

      if (existingItem) {
        this.toast.info('Sản phẩm đã có trong danh sách báo giá');
        return;
      }

      quoteItems.push({
        id: this.product.id,
        name: this.product.name,
        code: this.product.itemCode,
        price: this.product.price,
        image: this.images[0],
        quantity: 1
      });

      localStorage.setItem('quoteItems', JSON.stringify(quoteItems));
      this.toast.success('Đã thêm sản phẩm vào danh sách báo giá');
    },

    // Chuyển đến trang đăng nhập
    goToLogin() {
      localStorage.setItem('redirect_after_login', this.$route.fullPath);
      this.$router.push('/login');
    }
  },
  // Lifecycle hooks
  mounted() {
    this.fetchProduct();
    window.addEventListener('keydown', this.handleKeyNavigation);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyNavigation);
  }
};
</script>

<style scoped>
.product-detail {
  background: #fff;
  border-radius: 18px;
}

.gallery-wrapper {
  position: relative;
}

.main-image {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 12px rgba(151, 27, 30, 0.08);
}

.main-img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center !important;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  display: block;
}

.main-image:hover .main-img {
  transform: scale(1.02);
  box-shadow: 0 6px 24px rgba(151, 27, 30, 0.13);
}

.zoom-icon {
  position: absolute;
  bottom: 18px;
  right: 18px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  padding: 8px 10px;
  font-size: 1.2rem;
  color: #971b1e;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.10);
  cursor: pointer;
  transition: all 0.2s;
  z-index: 2;
}

.zoom-icon:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 12px rgba(151, 27, 30, 0.15);
  transform: scale(1.05);
}

.zoom-icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.thumbnails-wrapper {
  position: relative;
  padding: 0 30px;
  margin-top: 10px;
}

.thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 4px;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.thumbnails::-webkit-scrollbar {
  display: none;
}

.thumbnail-item {
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: 70px;
  height: 70px;
  display: inline-block;
  flex-shrink: 0;
  background: #f8f9fa;
  position: relative;
}

.thumbnail-item.active,
.thumbnail-item:hover {
  border: 2px solid #971b1e;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.10);
  transform: translateY(-2px);
}

.thumb-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover !important;
  object-position: center !important;
}

/* Modal zoom */
.zoom-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoomed-img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(151, 27, 30, 0.18);
}

.close-btn {
  position: absolute;
  top: 24px;
  right: 32px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  color: #971b1e;
  padding: 6px 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.10);
}

.product-name {
  font-size: 2rem;
  font-weight: 700;
  color: #971b1e;
}

.product-code {
  color: #666;
  font-size: 1.1rem;
}

.product-code span {
  font-weight: 600;
  color: #222;
}

.product-price-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.current-price {
  font-size: 2.2rem;
  font-weight: 700;
  color: #971b1e;
  line-height: 1.2;
}

.original-price {
  font-size: 1.4rem;
  color: #999;
  text-decoration: line-through;
  position: relative;
}

.original-price::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -4px;
  right: -4px;
  height: 2px;
  background: #999;
  transform: translateY(-50%);
}

.price-note {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

.product-short-desc {
  font-size: 1.08rem;
  color: #444;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem 1.2rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #971b1e;
  margin-bottom: 1.2rem;
}

.long-description {
  font-size: 1.08rem;
  color: #333;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.2rem 1.5rem;
  line-height: 1.7;
  white-space: pre-line;
}

.specs-table {
  margin-top: 0.5rem;
}

.specs-table-inner {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.06);
}

.spec-key {
  font-weight: 500;
  color: #444;
  width: 40%;
  background: #f8f9fa;
  border-radius: 6px 0 0 6px;
}

.spec-value {
  color: #222;
  width: 60%;
}

@media (max-width: 768px) {
  .product-detail {
    padding: 1.2rem 0.2rem;
  }

  .main-image {
    height: 240px;
  }

  .thumbnail-item {
    width: 48px;
    height: 48px;
  }

  .product-name {
    font-size: 1.3rem;
  }

  .product-short-desc,
  .long-description {
    font-size: 0.98rem;
    padding: 0.7rem 0.7rem;
  }

  .section-title {
    font-size: 1.08rem;
  }

  .zoom-icon {
    padding: 6px 8px;
    font-size: 1rem;
  }

  .zoom-icon-img {
    width: 16px;
    height: 16px;
  }

  :deep(.vel-btn) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .current-price {
    font-size: 1.8rem;
  }

  .original-price {
    font-size: 1.2rem;
  }

  .price-note {
    font-size: 0.85rem;
  }
}

@media (max-width: 576px) {
  .main-image {
    height: 100vw;
    max-height: 100vw;
    min-height: 100vw;
    aspect-ratio: 1 / 1;
  }

  .main-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 12px;
    background: #f8f9fa;
    display: block;
  }
}

/* Main image navigation buttons */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #971b1e;
  z-index: 1;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.15);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

/* Thumbnail navigation buttons */
.thumb-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #971b1e;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.10);
}

.thumb-nav-btn:hover {
  background: #fff;
  box-shadow: 0 2px 12px rgba(151, 27, 30, 0.15);
}

.thumb-nav-btn.left {
  left: 0;
}

.thumb-nav-btn.right {
  right: 0;
}

@media (max-width: 768px) {
  .nav-btn {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }

  .thumb-nav-btn {
    width: 25px;
    height: 25px;
    font-size: 0.8rem;
  }
}

/* Fancybox custom styles */
:deep(.fancybox__container) {
  --fancybox-bg: rgba(0, 0, 0, 0.85);
}

:deep(.fancybox__toolbar) {
  background: rgba(0, 0, 0, 0.3);
}

:deep(.fancybox__caption) {
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 1.1rem;
  text-align: center;
  padding: 10px 20px;
}

:deep(.fancybox__content) {
  background: transparent; /* Nền trong suốt cho content */
}

:deep(.fancybox__image) {
  object-fit: contain; /* Hiển thị đầy đủ hình ảnh, không cắt */
  max-height: 90vh;
  border-radius: 8px;
}

:deep(.fancybox__button) {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #971b1e;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.10);
  transition: all 0.2s;
}

:deep(.fancybox__button:hover) {
  background: #fff;
  box-shadow: 0 2px 12px rgba(151, 27, 30, 0.15);
  transform: scale(1.05);
}

:deep(.fancybox__thumbs .carousel__slide.is-nav-selected::after) {
  border: 2px solid #971b1e;
}

@media (max-width: 768px) {
  :deep(.fancybox__button) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}

.image-type-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-image:hover .image-type-overlay {
  opacity: 1;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  margin-bottom: 8px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  color: #971b1e;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.1);
  transform: translateX(-100%);
  opacity: 0;
}

.main-image:hover .type-btn {
  transform: translateX(0);
  opacity: 1;
}

.type-btn:nth-child(1) {
  transition-delay: 0.1s;
}

.type-btn:nth-child(2) {
  transition-delay: 0.2s;
}

.type-btn:nth-child(3) {
  transition-delay: 0.3s;
}

.type-btn:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(151, 27, 30, 0.15);
  transform: translateX(0) scale(1.05);
}

.type-btn.active {
  background: #971b1e;
  color: white;
}

.type-btn i {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .type-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  .type-btn i {
    font-size: 1rem;
  }
}

.additional-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s;
}

.info-item:hover {
  background: #f0f2f5;
  transform: translateY(-2px);
}

.info-item i {
  font-size: 1.2rem;
  color: #971b1e;
  width: 24px;
  text-align: center;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: #222;
}

@media (max-width: 768px) {
  .additional-info {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .info-item {
    padding: 10px;
  }

  .info-item i {
    font-size: 1.1rem;
  }

  .info-label {
    font-size: 0.8rem;
  }

  .info-value {
    font-size: 0.9rem;
  }
}

.certificates {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.cert-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 8px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(151, 27, 30, 0.05);
  transition: all 0.2s;
}

.cert-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(151, 27, 30, 0.1);
}

.cert-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.cert-label {
  font-size: 0.85rem;
  color: #666;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 768px) {
  .certificates {
    padding: 8px;
    gap: 6px;
  }

  .cert-item {
    padding: 6px;
  }

  .cert-icon {
    width: 28px;
    height: 28px;
  }

  .cert-label {
    font-size: 0.8rem;
  }
}

.national-flag {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.1);
  z-index: 2;
  transition: all 0.3s ease;
}

.national-flag:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(151, 27, 30, 0.15);
  transform: translateY(-2px) scale(1.1);
}

.national-flag i {
  font-size: 1.4rem;
  color: #971b1e;
}

@media (max-width: 768px) {
  .national-flag {
    top: 15px;
    right: 15px;
    width: 32px;
    height: 32px;
  }

  .national-flag i {
    font-size: 1.2rem;
  }
}

.combo-section {
  background: #fff7f7;
  border-radius: 16px;
  padding: 28px 24px;
  margin-top: 40px;
  box-shadow: 0 2px 12px rgba(151, 27, 30, 0.07);
}

.combo-section .section-title {
  color: #971b1e;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.combo-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.combo-item {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.10);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1.5px solid #f3d6d7;
  position: relative;
}

.combo-item:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 6px 18px rgba(151, 27, 30, 0.13);
  border-color: #971b1e33;
}

.combo-image {
  width: 100%;
  aspect-ratio: 1/1;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f3d6d7;
  position: relative;
  overflow: hidden;
}

.combo-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover !important;
  object-position: center !important;
  transition: transform 0.3s ease;
}

.combo-item:hover .combo-image img {
  transform: scale(1.05);
}

.combo-discount {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0.85rem;
  color: #28a745;
  font-weight: 600;
  background: rgba(40, 167, 69, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.combo-info {
  width: 100%;
  padding: 16px 12px;
  text-align: center;
}

.combo-name {
  font-size: 1.05rem;
  color: #222;
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.combo-price-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.combo-price {
  font-size: 1.08rem;
  color: #971b1e;
  font-weight: 700;
}

.combo-original-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
}

.combo-select {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  cursor: pointer;
  user-select: none;
}

.combo-select input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-color: #fff;
  border: 2px solid #971b1e;
  border-radius: 4px;
  transition: all 0.2s;
}

.combo-select input:checked~.checkmark {
  background-color: #971b1e;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 2px;
  top: 2px;
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
  border-radius: 2px;
}

.combo-select input:checked~.checkmark:after {
  display: block;
}

.select-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.combo-total {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #f3d6d7;
  position: relative;
}

.total-label {
  font-size: 1.08rem;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.total-price {
  font-size: 2rem;
  color: #971b1e;
  font-weight: 800;
  margin-bottom: 12px;
}

.combo-save {
  font-size: 1.05rem;
  color: #28a745;
  font-weight: 700;
  background: rgba(40, 167, 69, 0.12);
  padding: 6px 18px;
  border-radius: 20px;
  display: inline-block;
  margin-top: 8px;
}

@media (max-width: 1200px) {
  .combo-wrapper {
    max-width: 900px;
  }
}

@media (max-width: 992px) {
  .combo-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }

  .combo-total {
    grid-column: 1 / -1;
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .combo-section {
    padding: 20px 16px;
  }

  .combo-wrapper {
    gap: 20px;
  }

  .combo-name {
    font-size: 1rem;
  }

  .combo-price {
    font-size: 1rem;
  }

  .combo-original-price {
    font-size: 0.85rem;
  }

  .combo-discount {
    font-size: 0.8rem;
  }

  .total-price {
    font-size: 1.8rem;
  }

  .combo-save {
    font-size: 0.95rem;
  }
}

@media (max-width: 576px) {
  .combo-section {
    padding: 16px 12px;
    margin-top: 24px;
  }

  .combo-wrapper {
    gap: 16px;
  }

  .combo-name {
    font-size: 0.95rem;
    margin-bottom: 8px;
  }

  .combo-price {
    font-size: 0.95rem;
  }

  .combo-original-price {
    font-size: 0.8rem;
  }

  .combo-discount {
    font-size: 0.75rem;
    padding: 2px 6px;
  }

  .total-price {
    font-size: 1.5rem;
  }

  .combo-save {
    font-size: 0.9rem;
    padding: 4px 12px;
  }
}

.lot-price-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.lot-price-section .lot-price-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #971b1e;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lot-price-section .lot-price-header:hover {
  background: #b31f23;
}

.lot-price-section .lot-price-header h3 {
  margin: 0;
  color: white;
}

.lot-price-section .lot-price-header i {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.lot-price-content {
  padding: 20px;
  background: white;
}

.lot-price-table {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(151, 27, 30, 0.06);
}

.lot-price-table .lot-price-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  background: #971b1e;
  color: white;
  padding: 12px 16px;
  font-weight: 500;
}

.lot-price-body {
  background: white;
}

.lot-price-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  transition: all 0.2s;
}

.lot-price-row:last-child {
  border-bottom: none;
}

.lot-price-row:hover {
  background: #f8f9fa;
}

.lot-code {
  font-weight: 500;
  color: #222;
}

.lot-price {
  color: #971b1e;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.available {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.status-badge.sold {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

@media (max-width: 768px) {
  .lot-price-section .lot-price-header {
    padding: 12px 16px;
  }

  .lot-price-content {
    padding: 15px;
  }

  .lot-price-table .lot-price-header,
  .lot-price-row {
    padding: 10px 12px;
    font-size: 0.9rem;
  }

  .status-badge {
    padding: 3px 10px;
    font-size: 0.8rem;
  }
}

.breadcrumb-nav {
  background: transparent;
  padding: 0;
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 0;
  font-size: 1rem;
  border-radius: 0;
}

.breadcrumb-item+.breadcrumb-item::before {
  content: "/";
  color: #aaa;
  padding: 0 6px;
}

.breadcrumb-item a {
  color: #971b1e;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-item a:hover {
  color: #b31f23;
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: #222;
  font-weight: 600;
}

.skeleton-wrapper {
  min-height: 600px;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e6e6e6 37%, #f0f0f0 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.2s ease-in-out infinite;
  border-radius: 8px;
  margin-bottom: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}

.skeleton-image {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.skeleton-thumb {
  width: 70px;
  height: 70px;
  border-radius: 8px;
}

.skeleton-title {
  width: 60%;
  height: 32px;
  border-radius: 8px;
}

.skeleton-code {
  width: 40%;
  height: 20px;
}

.skeleton-price {
  width: 35%;
  height: 28px;
}

.skeleton-price-note {
  width: 60%;
  height: 16px;
}

.skeleton-info {
  width: 100%;
  height: 32px;
}

.skeleton-cert {
  width: 60px;
  height: 60px;
  border-radius: 8px;
}

.skeleton-section-title {
  width: 30%;
  height: 24px;
}

.skeleton-long-desc {
  width: 100%;
  height: 60px;
  border-radius: 8px;
}

.skeleton-spec {
  width: 100%;
  height: 28px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .skeleton-image {
    height: 240px;
  }

  .skeleton-thumb {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 576px) {
  .skeleton-image {
    height: 100vw;
    max-height: 100vw;
    min-height: 100vw;
  }
}

.notfound-wrapper {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 0 80px 0;
}

.notfound-icon {
  font-size: 3.5rem;
  color: #971b1e;
  opacity: 0.7;
}

.notfound-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #971b1e;
}

.notfound-desc {
  color: #666;
  font-size: 1.05rem;
  margin-bottom: 18px;
}

.notfound-btn {
  display: inline-block;
  background: #971b1e;
  color: #fff;
  font-weight: 600;
  padding: 10px 28px;
  border-radius: 24px;
  text-decoration: none;
  font-size: 1.08rem;
  transition: background 0.2s;
}

.notfound-btn:hover {
  background: #b31f23;
}

.combo-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
  padding: 0 24px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  min-width: 180px;
  justify-content: center;
}

.action-btn i {
  font-size: 1.1rem;
}

.favorite-btn-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
  padding: 0;
  gap: 16px;
}

.favorite-btn,
.quote-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  min-width: 180px;
  justify-content: center;
}

.favorite-btn {
  background: #fff;
  color: #971b1e;
  border: 2px solid #971b1e;
}

.favorite-btn:hover {
  background: #971b1e;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(151, 27, 30, 0.15);
}

.quote-btn {
  background: #971b1e;
  color: #fff;
  border: none;
}

.quote-btn:hover {
  background: #b31f23;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(151, 27, 30, 0.15);
}

.favorite-btn i,
.quote-btn i {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .favorite-btn-wrapper {
    margin-top: 16px;
    gap: 12px;
  }

  .favorite-btn,
  .quote-btn {
    padding: 10px 20px;
    font-size: 0.95rem;
    min-width: auto;
  }

  .favorite-btn i,
  .quote-btn i {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .favorite-btn-wrapper {
    margin-top: 12px;
    gap: 8px;
  }

  .favorite-btn,
  .quote-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #971b1e;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 5px;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel,
.btn-download {
  padding: 10px 20px;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn-download {
  background: #971b1e;
  color: white;
  border: none;
}

.btn-cancel:hover {
  background: #eee;
}

.btn-download:hover {
  background: #b31f23;
}

.quote-preview {
  font-family: Arial, sans-serif;
}

.quote-template {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
}

.quote-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.quote-header h1 {
  color: #971b1e;
  font-size: 2rem;
  margin-bottom: 10px;
}

.quote-header p {
  color: #666;
}

.main-product-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.showcase-image {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.showcase-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.showcase-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.showcase-details h2 {
  color: #971b1e;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.product-code {
  color: #666;
  font-size: 1.1rem;
}

.product-price {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.current-price {
  color: #971b1e;
  font-size: 1.8rem;
  font-weight: 700;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 1.2rem;
}

.product-description,
.product-specs {
  margin-top: 20px;
}

.product-description h3,
.product-specs h3 {
  color: #971b1e;
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.product-description p {
  color: #444;
  line-height: 1.6;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.spec-label {
  color: #666;
  font-size: 0.9rem;
}

.spec-value {
  color: #222;
  font-weight: 500;
}

.combo-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.combo-section h2 {
  color: #971b1e;
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
}

.combo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.combo-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.combo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.combo-image {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 8px;
  overflow: hidden;
}

.combo-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.combo-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.combo-info h4 {
  color: #222;
  font-size: 1rem;
  margin: 0;
}

.combo-price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.combo-price .current {
  color: #971b1e;
  font-weight: 600;
}

.combo-price .original {
  color: #999;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.combo-discount {
  color: #28a745;
  font-weight: 600;
  font-size: 0.9rem;
}

.combo-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-item .total {
  color: #971b1e;
  font-weight: 700;
  font-size: 1.2rem;
}

.summary-item .save {
  color: #28a745;
  font-weight: 600;
}

.quote-footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.quote-footer p {
  color: #666;
  margin: 0;
}

.quote-footer p:last-child {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .main-product-showcase {
    grid-template-columns: 1fr;
  }

  .combo-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .combo-grid {
    grid-template-columns: 1fr;
  }
}

.product-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #971b1e;
  color: white;
  border: none;
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn-primary:hover {
  background: #b31f23;
  transform: translateY(-2px);
}

.btn-secondary:hover {
  background: #eee;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.btn-add-to-quote {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #971b1e;
  color: white;
  border: none;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-to-quote:hover {
  background: #b31f23;
  transform: translateY(-2px);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.product-info {
  animation: fadeIn 0.5s ease-out;
}

.product-gallery {
  animation: slideIn 0.5s ease-out;
}

.product-actions {
  animation: fadeIn 0.5s ease-out 0.2s;
  animation-fill-mode: both;
}

.combo-section {
  animation: scaleIn 0.5s ease-out 0.3s;
  animation-fill-mode: both;
}

/* Hover effects */
.product-image {
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.02);
}

.btn-add-to-favorite {
  transition: all 0.3s ease;
}

.btn-add-to-favorite:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.combo-item {
  transition: all 0.3s ease;
}

.combo-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }

  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}

/* Add new styles */
.login-required-notice {
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #971b1e;
}

.login-required-notice:hover {
  background: #f0f2f5;
  transform: translateY(-2px);
}

.login-required-notice i {
  font-size: 1.2rem;
}

.price-notice {
  font-size: 1.1rem;
  font-weight: 500;
  justify-content: center;
}
</style>