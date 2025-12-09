<template>
  <div class="product-detail py-4" v-if="product">
    <!-- Breadcrumb -->
    <nav class="breadcrumb-nav mb-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">Trang chủ</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link :to="{ name: 'catalog', query: { productType: product.specifications['Loại sản phẩm'] } }">
            {{ product.specifications['Loại sản phẩm'] }}
          </router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
      </ol>
    </nav>

    <div class="row">
      <!-- Gallery -->
      <div class="col-md-6 mb-4">
        <div class="gallery-wrapper">
          <div class="main-image mb-3 position-relative">
            <!-- Image Type Selection Overlay -->
            <div class="image-type-overlay">
              <div class="image-type-buttons">
                <button v-if="hasProductImages" class="type-btn" :class="{ active: currentImageType === 'product' }"
                  @click.stop="jumpToImageType('product')">
                  <i class="fi fi-br-box"></i>
                  <span>Hình sản phẩm</span>
                </button>
                <button v-if="hasPerspectiveImages" class="type-btn" :class="{ active: currentImageType === 'perspective' }"
                  @click.stop="jumpToImageType('perspective')">
                  <i class="fi fi-br-layout-fluid"></i>
                  <span>Hình phối cảnh</span>
                </button>
                <button v-if="hasRealImages" class="type-btn" :class="{ active: currentImageType === 'real' }"
                  @click.stop="jumpToImageType('real')">
                  <i class="fi fi-br-camera"></i>
                  <span>Hình thực tế</span>
                </button>
              </div>
            </div>

            <div v-if="imageLoading" class="main-image-skeleton"></div>
            <img :src="currentImage" class="img-fluid main-img" :alt="product.name" @click="openCustomModal"
              @mousemove="handleImageHover" @mouseenter="isHovering = true" @mouseleave="isHovering = false"
              @load="handleMainImageLoad"
              :style="getHoverStyle()"
              :class="{ 'img-loading': imageLoading }">

            <div class="zoom-indicator">
              <i class="fi fi-br-zoom-in"></i>
              <span>Click để phóng to</span>
            </div>

            <!-- Main image navigation buttons -->
            <button v-if="allImages.length > 1" class="nav-btn prev-btn" @click.stop="navigateImage('prev')"
              :disabled="currentImageIndex === 0">
              <i class="fi fi-br-angle-left"></i>
            </button>
            <button v-if="allImages.length > 1" class="nav-btn next-btn" @click.stop="navigateImage('next')"
              :disabled="currentImageIndex === allImages.length - 1">
              <i class="fi fi-br-angle-right"></i>
            </button>

            <!-- Embedded thumbnails -->
            <div class="thumbnails-wrapper">
              <button class="thumb-nav thumb-nav-left" v-if="showLeftArrow" @click.stop="scrollThumbnails('left')">
                <i class="fi fi-br-angle-left"></i>
              </button>
              <div class="thumbnails d-flex justify-content-start gap-2" ref="thumbnails" @scroll="updateThumbArrows">
                <div v-for="(image, index) in allImages" :key="index" class="thumbnail-item"
                  :class="{ active: index === currentImageIndex }" @click.stop="selectThumbnail(index, $event)"
                  :ref="index === currentImageIndex ? 'activeThumb' : null">
                  <div v-if="!thumbLoaded[index]" class="thumb-skeleton"></div>
                  <img :src="image" class="img-fluid thumb-img" :alt="product.name" @load="handleThumbLoad(index)">
                </div>
              </div>
              <button class="thumb-nav thumb-nav-right" v-if="showRightArrow" @click.stop="scrollThumbnails('right')">
                <i class="fi fi-br-angle-right"></i>
              </button>
            </div>
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
            <div class="current-price">
              {{ formatPrice(product.displayPriceValue ?? 0) }}
            </div>
            <div
              class="original-price"
              v-if="product.isSale && product.priceBaseValue !== null"
            >
              {{ formatPrice(product.priceBaseValue) }}
            </div>
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
        <div v-if="hasLotPrices" class="lot-price-section mb-4">
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
            <i class="fi fi-br-category-alt"></i>
            <div class="info-content">
              <div class="info-label">Tên Nhóm VTHH</div>
              <div class="info-value">{{ product.specifications['Tên Nhóm VTHH'] }}</div>
            </div>
          </div>
          <div class="info-item">
            <i class="fi fi-br-palette"></i>
            <div class="info-content">
              <div class="info-label">Màu sắc</div>
              <div class="info-value">{{ product.specifications['Tên Màu Sắc'] }}</div>
            </div>
          </div>
          <div class="info-item">
            <i class="fi  fi-br-ruler-combined"></i>
            <div class="info-content">
              <div class="info-label">Kích thước</div>
              <div class="info-value">{{ product.specifications['Kích Thước Mô Phỏng']  || product.specifications['Quy Cách'] }}</div>
            </div>
          </div>
          <!-- Thương hiệu -->
          <div
            class="info-item"
            v-if="showBrandPublic"
          >
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

        <!-- Certificates / Feature badges -->
        <div v-if="certificateItems.length" class="certificates">
          <div class="cert-item" v-for="(cert, index) in certificateItems" :key="index">
            <i v-if="cert.icon" class="cert-icon fi" :class="cert.icon"></i>
            <div class="cert-label">
              <div class="cert-name">{{ cert.label }}</div>
              <div class="cert-value">{{ cert.value }}</div>
            </div>
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
        <div class="long-description">{{ product.custom_field169 }}</div>
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
                  <td class="spec-value">
                    <router-link
                      v-if="isProductLineField(key) && !isPlaceholderValue(value)"
                      :to="getCatalogLinkForValue(value)"
                    >
                      {{ value }}
                    </router-link>
                    <span v-else>{{ value }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Zoom Modal -->
    <transition name="fade">
      <div v-if="showZoomModal" class="custom-zoom-modal" :style="{
        transform: isDraggingDown ? `translateY(${dragOffset}px)` : 'none',
        background: `rgba(0, 0, 0, ${backgroundOpacity})`
      }" @click="closeZoomModal">
        <div class="custom-zoom-container" @click.stop>
          <div class="custom-toolbar">
            <button class="toolbar-btn" @click="zoomIn"><i class="fi fi-br-zoom-in"></i></button>
            <button class="toolbar-btn" @click="zoomOut"><i class="fi fi-br-zoom-out"></i></button>
            <button class="toolbar-btn" @click="resetZoom"><i class="fi fi-br-undo"></i></button>
            <div class="toolbar-spacer"></div>
            <button class="toolbar-btn" @click="downloadImage"><i class="fi fi-br-download"></i></button>
            <button class="toolbar-btn" @click="closeZoomModal"><i class="fi fi-br-cross"></i></button>
          </div>

          <div class="zoom-image-wrapper" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag"
            @mouseleave="stopDrag" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
            @touchend="handleTouchEnd">
            <img :src="zoomedImage" alt="Zoomed Image" class="custom-zoomed-img" :class="{
              'slide-left': slideDirection === 'left' && isSliding,
              'slide-right': slideDirection === 'right' && isSliding
            }" :style="{
                transform: `scale(${zoomLevel}) translate(${dragX}px, ${dragY}px)`
              }" @wheel="handleZoomWheel">

            <!-- Thêm nút điều hướng -->
            <button v-if="allImages.length > 1" class="zoom-nav-btn prev-btn" @click.stop="navigateImage('prev')"
              :disabled="currentImageIndex === 0">
              <i class="fi fi-br-angle-left"></i>
            </button>
            <button v-if="allImages.length > 1" class="zoom-nav-btn next-btn" @click.stop="navigateImage('next')"
              :disabled="currentImageIndex === allImages.length - 1">
              <i class="fi fi-br-angle-right"></i>
            </button>
          </div>

          <div class="custom-thumbnails">
            <div class="thumbnails-container">
              <div v-for="(image, index) in allImages" :key="index" class="zoom-thumbnail-item"
                :class="{ active: zoomedImage === image }" @click="changeZoomedImage(image)">
                <img :src="image" class="zoom-thumb-img" :alt="product.name">
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
import { productService } from '@/services/productService';
import fieldDefinitions from '@/assets/product_field_definitions.json';
import { updateSeoMeta } from '@/utils/seo';

export default {
  name: 'ProductDetail',
  setup() {
    const toast = useToast();
    updateSeoMeta({
      title: 'Vietceramics | Chi tiết sản phẩm',
      description: 'Đang tải thông tin sản phẩm chính hãng từ Vietceramics.',
      type: 'product'
    });
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
      error: null,
      showZoomModal: false,
      zoomedImage: '',
      zoomLevel: 1,
      dragX: 0,
      dragY: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      hoverX: 0,
      hoverY: 0,
      isHovering: false,
      touchStartX: 0,
      touchEndX: 0,
      isSwiping: false,
      slideDirection: '', // 'left' hoặc 'right'
      isSliding: false,
      touchStartY: 0,
      touchEndY: 0,
      isDraggingDown: false,
      dragOffset: 0,
      backgroundOpacity: 0.95, // Thêm opacity cho background
      imageLoading: true,
      thumbLoaded: {},
      // Danh sách nhãn muốn ẩn khỏi phần thông số
      hiddenLabels: [
        'Ngày tạo',
        'Ngày sửa',
        'Người tạo',
        'Người sửa',
        'Ngừng theo dõi',
        'Dùng chung',
        'Bố cục',
        'Theo dõi theo mã quy cách',
        'Đơn giá bán 1',
        'Đơn giá bán 2',
        'Đơn giá bán cố định',
        'Đơn giá chi phí',
        'Giá bán là đơn giá sau thuế',
        'Chủ sở hữu',
        'Tên hàng hóa',
        'Tên hàng hóa',
        'Thuế GTGT',
        'Thuế GTGT',
        'Đơn giá mua',
        'Đơn vị',
        'Đơn giá bán',
        'Ngầm định ghi nhận DS trước thuế',
        'Diễn giải khi bán',
        'Diễn giải khi bán',
        'Nguồn gốc',
        'Mã Hàng NCU',
        'Loại Bán Hàng',
        //'Hiển Thị Công Năng In Tem',
        'Trọng Lượng/DVT Chính',
        'Hướng Dẫn Sử Dụng',
        'Hướng Dẫn Bảo Quản',
        'Hướng Dẫn Vận Chuyển',
        'Tính chất',
        '',
        '',
      ]
    };
  },
  computed: {
    // Tổng hợp tất cả hình ảnh từ các nguồn
    allImages() {
      const mainImages = (this.images && this.images.length) ? this.images : (this.product?.images || []);
      const realImages = (this.images_real && this.images_real.length) ? this.images_real : (this.product?.images_real || []);
      return [
        ...mainImages,
        ...(this.images_perspective || []),
        ...realImages
      ];
    },
    hasProductImages() {
      return (this.images && this.images.length) || (this.product?.images?.length);
    },
    hasPerspectiveImages() {
      return (this.images_perspective && this.images_perspective.length);
    },
    hasRealImages() {
      return (this.images_real && this.images_real.length) || (this.product?.images_real?.length);
    },
    availableImageTypes() {
      const types = [];
      if (this.hasProductImages) types.push('product');
      if (this.hasPerspectiveImages) types.push('perspective');
      if (this.hasRealImages) types.push('real');
      return types;
    },
    // Lấy hình ảnh hiện tại đang hiển thị
    currentImage() {
      return this.allImages[this.currentImageIndex] || '';
    },
    filteredSpecifications() {
      if (!this.product || !this.product.specifications) return {};
      return Object.fromEntries(
        Object.entries(this.product.specifications).filter(
          ([label]) => !this.hiddenLabels.includes(label)
        )
      );
    },
    // Chia thông số kỹ thuật thành 2 cột
    specsChunks() {
      const entries = Object.entries(this.filteredSpecifications);
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
      if (!this.product) return '0đ';
      const comboItems = this.product.comboItems || [];
      const mainProductPrice = this.product.displayPriceValue ?? 0;
      const comboItemsTotal = comboItems
        .filter(item => item.selected)
        .reduce((sum, item) => sum + this.parsePrice(item.price), 0);
      return this.formatPrice(mainProductPrice + comboItemsTotal);
    },
    // Tính số tiền tiết kiệm khi mua combo
    selectedComboSave() {
      if (!this.product) return '0đ';
      const comboItems = this.product.comboItems || [];
      const comboItemsSelected = comboItems.filter(item => item.selected);
      const mainProductOriginalPrice = this.product.priceBaseValue ?? this.product.displayPriceValue ?? 0;
      const comboItemsOriginalTotal = comboItemsSelected
        .reduce((sum, item) => sum + this.parsePrice(item.originalPrice), 0);
      const comboItemsSelectedTotal = comboItemsSelected
        .reduce((sum, item) => sum + this.parsePrice(item.price), 0);
      const totalOriginal = mainProductOriginalPrice + comboItemsOriginalTotal;
      const total = (this.product.displayPriceValue ?? 0) + comboItemsSelectedTotal;
      const save = totalOriginal - total;
      return this.formatPrice(save > 0 ? save : 0);
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
    },
    hasLotPrices() {
      return Array.isArray(this.product?.lotPrices) && this.product.lotPrices.length > 0;
    },
    showBrandPublic() {
      const type = (this.product?.productType || '').toLowerCase();
      const isSanitary = type.includes('thiết bị vệ sinh') || type === 'bath';
      return isSanitary || this.isLoggedIn;
    },
    certificateItems() {
      const specs = this.product?.specifications || {};
      const placeholder = 'Đang cập nhật';
      const getValue = (keys) => {
        const keyArr = Array.isArray(keys) ? keys : [keys];
        for (const key of keyArr) {
          const raw = specs[key];
          if (raw !== undefined && raw !== null) {
            const str = String(raw).trim();
            return str || placeholder;
          }
        }
        return placeholder;
      };

      return [
        {
          label: 'Công Nghệ Bề Mặt',
          value: getValue(['Công Nghệ Bề Mặt', 'Công nghệ bề mặt']),
          icon: 'fi-br-layer-plus'
        },
        {
          label: 'Chứng chỉ môi trường',
          value: getValue(['Chứng chỉ môi trường']),
          icon: 'fi-br-leaf'
        },
        {
          label: 'Công nghệ chống trượt',
          value: getValue(['Chống Trượt', 'Công nghệ chống trượt']),
          icon: 'fi-br-shield-check'
        }
      ];
    }
  },
  methods: {
    isProductLineField(key) {
      return String(key || '').trim().toLowerCase() === 'dòng sản phẩm';
    },
    isPlaceholderValue(value) {
      const str = String(value || '').trim().toLowerCase();
      return (
        !str ||
        str === 'đang cập nhật' ||
        str === 'dang cap nhat' ||
        str === 'liên hệ' ||
        str === 'lien he'
      );
    },
    getCatalogLinkForValue(value) {
      const query = { collection: value };
      const productType =
        this.product?.specifications?.['Loại sản phẩm'] ||
        this.product?.productType;
      if (productType) {
        query.productType = productType;
      }
      return { name: 'catalog', query };
    },
    getImageCounts() {
      const mainCount = (this.images && this.images.length) ? this.images.length : (this.product?.images?.length || 0);
      const perspectiveCount = (this.images_perspective && this.images_perspective.length) ? this.images_perspective.length : 0;
      const realCount = (this.images_real && this.images_real.length) ? this.images_real.length : (this.product?.images_real?.length || 0);
      return { mainCount, perspectiveCount, realCount };
    },
    getStartIndexForType(type) {
      const { mainCount, perspectiveCount } = this.getImageCounts();
      if (type === 'product') return 0;
      if (type === 'perspective') return mainCount;
      return mainCount + perspectiveCount;
    },
    async loadImages() {
      try {
        const productCode = this.product?.itemCode || this.product?.No_ || this.$route.params.id;
        // Tải song song các loại hình ảnh
        const [productImages, perspectiveImages, realImages] = await Promise.all([
          productService.getProductImages(productCode, 'product', this.product?.collectionName),
          productService.getProductImages(productCode, 'perspective', this.product?.collectionName),
          productService.getProductImages(productCode, 'real', this.product?.collectionName)
        ]);

        this.images = (productImages && productImages.length) ? productImages : [];
        this.images_perspective = (perspectiveImages && perspectiveImages.length) ? perspectiveImages : [];
        this.images_real = (realImages && realImages.length) ? realImages : [];

       // Nếu không có ảnh nào, sử dụng placeholder để tránh màn trắng
if (
  !this.images.length &&
  !this.images_perspective.length &&
  !this.images_real.length
) {
  const productName = '';

  const line1 = productName;                     // TÊN SẢN PHẨM (IN HOA, 1 dòng riêng)
  const line2 = 'KHÔNG CÓ HÌNH ẢNH';             // Dòng thông báo
  const line3 = 'VUI LÒNG LIÊN HỆ QC ';         // Dòng chú thích nhỏ

  const placeholderText = encodeURIComponent(
    `${line1}\n${line2}\n${line3}`
  );

  this.images = [
    `https://placehold.co/600x600/971b1e/white?text=${placeholderText}&font=Roboto`
  ];
}

        this.currentImageIndex = 0;
        // Đảm bảo currentImageType luôn trỏ đến loại ảnh có dữ liệu
        const availableTypes = this.availableImageTypes;
        if (!availableTypes.includes(this.currentImageType)) {
          this.currentImageType = availableTypes[0] || 'product';
        }
        this.currentImageIndex = this.getStartIndexForType(this.currentImageType);

        this.imageLoading = true;
        this.thumbLoaded = {};
        this.$nextTick(() => this.updateThumbArrows());
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
        // Hiển thị bảng giá theo lô nếu có dữ liệu
        this.showLotPrice = this.hasLotPrices;

        // Tải hình ảnh sau khi có thông tin sản phẩm
        await this.loadImages();
        this.applyProductSeo();
      } catch (error) {
        console.error('Error fetching product:', error);
        this.error = 'Không thể tải thông tin sản phẩm';
        this.toast.error(this.error);
        updateSeoMeta({
          title: 'Vietceramics | Không tìm thấy sản phẩm',
          description: 'Sản phẩm có thể đã bị gỡ hoặc không còn được phân phối.',
          type: 'product'
        });
      } finally {
        this.loading = false;
      }
    },
    toggleLotPrice() {
      if (!this.hasLotPrices) return;
      this.showLotPrice = !this.showLotPrice;
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
          const thumbLeft = activeThumb[0].offsetLeft;
          const thumbWidth = activeThumb[0].offsetWidth;
          const containerWidth = container.clientWidth;
          const scrollLeft = container.scrollLeft;

          // If the active thumbnail is not visible or partially visible, scroll it into view
          if (thumbLeft < scrollLeft || (thumbLeft + thumbWidth) > (scrollLeft + containerWidth)) {
            // Center the thumbnail in the container
            container.scrollTo({
              left: thumbLeft - (containerWidth / 2) + (thumbWidth / 2),
              behavior: 'smooth'
            });
          }
          this.updateThumbArrows();
        }
      });
    },

    // Chuyển đổi giữa các loại hình ảnh
    jumpToImageType(type) {
      if (!this.availableImageTypes.includes(type)) return;
      this.currentImageType = type;
      this.currentImageIndex = this.getStartIndexForType(type);
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
        image: this.images[0] || (this.product.images && this.product.images[0]) || '',
        quantity: 1
      });

      localStorage.setItem('quoteItems', JSON.stringify(quoteItems));
      this.toast.success('Đã thêm sản phẩm vào danh sách báo giá');
    },

    // Chuyển đến trang đăng nhập
    goToLogin() {
      localStorage.setItem('redirect_after_login', this.$route.fullPath);
      this.$router.push('/login');
    },

    // Navigate image with previous/next buttons
    navigateImage(direction) {
      if (direction === 'prev' && this.currentImageIndex > 0) {
        this.slideDirection = 'right';
        this.currentImageIndex--;
      } else if (direction === 'next' && this.currentImageIndex < this.allImages.length - 1) {
        this.slideDirection = 'left';
        this.currentImageIndex++;
      }

      // Cập nhật zoomedImage khi điều hướng trong popup
      if (this.showZoomModal) {
        this.isSliding = true;
        this.zoomedImage = this.allImages[this.currentImageIndex];
        // Reset zoom và vị trí khi chuyển ảnh
        this.zoomLevel = 1;
        this.dragX = 0;
        this.dragY = 0;
        this.lastX = 0;
        this.lastY = 0;

        // Reset trạng thái sliding sau khi animation kết thúc
        setTimeout(() => {
          this.isSliding = false;
          this.slideDirection = '';
        }, 300);
      }

      this.scrollActiveThumbIntoView();
    },

    // Update thumbnail arrows visibility
    updateThumbArrows() {
      if (!this.$refs.thumbnails) return;

      const container = this.$refs.thumbnails;
      this.showLeftArrow = container.scrollLeft > 0;
      this.showRightArrow = container.scrollLeft < (container.scrollWidth - container.clientWidth - 5);
    },

    // Scroll thumbnails
    scrollThumbnails(direction) {
      if (!this.$refs.thumbnails) return;

      const container = this.$refs.thumbnails;
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    },

    // Handle keyboard navigation
    handleKeyNavigation(event) {
      if (event.key === 'ArrowLeft') {
        this.navigateImage('prev');
      } else if (event.key === 'ArrowRight') {
        this.navigateImage('next');
      }
    },

    openCustomModal() {
      try {
        // Reset hover state
        this.isHovering = false;

        // Sử dụng một cách tiếp cận khác, sử dụng Fancybox nhưng với API đơn giản hơn
        const imageToShow = this.currentImage;

        // Nếu muốn sử dụng modal tự tạo thay vì Fancybox
        if (true) {
          this.zoomedImage = imageToShow;
          this.showZoomModal = true;

          // Reset zoom và kéo thả khi mở modal
          this.zoomLevel = 1;
          this.dragX = 0;
          this.dragY = 0;
          this.lastX = 0;
          this.lastY = 0;
          this.isDragging = false;

          return;
        }

        // Hoặc sử dụng Fancybox nếu cần
        Fancybox.show([{ src: imageToShow }], {
          animated: false,
          dragToClose: false,
          Image: { zoom: true }
        });
      } catch (error) {
        console.error("Lỗi khi mở ảnh phóng to:", error);
        // Backup plan - sử dụng cách đơn giản
        window.open(this.currentImage, '_blank');
      }
    },

    closeZoomModal() {
      // Thêm animation khi đóng
      const modal = document.querySelector('.custom-zoom-modal');
      if (modal) {
        modal.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        modal.style.transform = 'translateY(100%)';
        modal.style.opacity = '0';
      }

      setTimeout(() => {
        this.showZoomModal = false;
        this.zoomLevel = 1;
        this.dragX = 0;
        this.dragY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.isDragging = false;
        this.isDraggingDown = false;
        this.dragOffset = 0;
        this.backgroundOpacity = 0.95; // Reset opacity
      }, 300);
    },
    zoomIn() {
      this.zoomLevel = Math.min(3, this.zoomLevel + 0.2);
    },
    zoomOut() {
      this.zoomLevel = Math.max(0.5, this.zoomLevel - 0.2);
    },
    resetZoom() {
      this.zoomLevel = 1;
      this.dragX = 0;
      this.dragY = 0;
      this.lastX = 0;
      this.lastY = 0;
    },
    changeZoomedImage(image) {
      this.zoomedImage = image;
      this.zoomLevel = 1;
      this.dragX = 0;
      this.dragY = 0;
      this.lastX = 0;
      this.lastY = 0;
    },
    handleZoomWheel(event) {
      event.preventDefault();
      // Zoom in or out based on wheel direction
      const delta = event.deltaY * -0.001;
      const newZoom = this.zoomLevel + delta;
      this.zoomLevel = Math.min(3, Math.max(0.5, newZoom));
    },
    startDrag(event) {
      if (this.zoomLevel <= 1) return;

      this.isDragging = true;

      // Xử lý cả touch và mouse event
      const clientX = event.clientX || (event.touches && event.touches[0].clientX);
      const clientY = event.clientY || (event.touches && event.touches[0].clientY);

      this.startX = clientX - this.lastX;
      this.startY = clientY - this.lastY;

      event.preventDefault();
    },

    onDrag(event) {
      if (!this.isDragging || this.zoomLevel <= 1) return;

      // Xử lý cả touch và mouse event
      const clientX = event.clientX || (event.touches && event.touches[0].clientX);
      const clientY = event.clientY || (event.touches && event.touches[0].clientY);

      this.dragX = (clientX - this.startX) / this.zoomLevel;
      this.dragY = (clientY - this.startY) / this.zoomLevel;

      this.lastX = this.dragX;
      this.lastY = this.dragY;

      event.preventDefault();
    },

    stopDrag() {
      this.isDragging = false;
    },
    downloadImage() {
      try {
        // Lấy URL ảnh hiện tại
        const imageUrl = this.zoomedImage;

        // Tạo tên file từ tên sản phẩm
        const fileName = this.product ?
          `${this.product.itemCode || 'product'}.jpg` :
          'product-image.jpg';

        // Tạo một thẻ img tạm thời để tải ảnh
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Cho phép tải ảnh từ domain khác

        img.onload = () => {
          // Tạo canvas để vẽ ảnh
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          // Vẽ ảnh vào canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          // Chuyển canvas thành blob
          canvas.toBlob((blob) => {
            // Tạo URL từ blob
            const blobUrl = URL.createObjectURL(blob);

            // Tạo thẻ a để tải
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;

            // Thêm vào DOM và kích hoạt click
            document.body.appendChild(link);
            link.click();

            // Dọn dẹp
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(blobUrl);
            }, 100);

          }, 'image/jpeg', 0.95);
        };

        img.onerror = () => {
          this.toast.error('Không thể tải ảnh. Vui lòng thử lại.');
        };

        // Bắt đầu tải ảnh
        img.src = imageUrl;

      } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
        this.toast.error('Không thể tải ảnh. Vui lòng thử lại.');
      }
    },
    handleImageHover(event) {
      // Skip hover effect on mobile
      if (window.innerWidth <= 768) return;

      if (!this.isHovering) return;

      const rect = event.target.getBoundingClientRect();

      // Calculate mouse position relative to the image (in percentage)
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      this.hoverX = x;
      this.hoverY = y;
    },
    getHoverStyle() {
      // Skip hover effect on mobile
      if (window.innerWidth <= 768) return {};

      if (!this.isHovering) return {};

      return {
        objectPosition: `${this.hoverX}% ${this.hoverY}%`,
        transition: 'object-position 0.05s ease-out'
      };
    },
    handleTouchStart(event) {
      if (this.zoomLevel > 1) return;

      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
      this.isSwiping = true;
      this.isDraggingDown = false;
      this.dragOffset = 0;
    },

    handleTouchMove(event) {
      if (!this.isSwiping || this.zoomLevel > 1) return;

      this.touchEndX = event.touches[0].clientX;
      this.touchEndY = event.touches[0].clientY;

      // Tính toán khoảng cách kéo theo chiều dọc
      const deltaY = this.touchEndY - this.touchStartY;

      // Nếu kéo xuống đủ xa, bắt đầu hiệu ứng kéo
      if (deltaY > 50) {
        this.isDraggingDown = true;
        this.dragOffset = Math.min(deltaY * 0.5, 300); // Giới hạn khoảng cách kéo

        // Tính toán opacity dựa trên khoảng cách kéo
        const maxDrag = 300; // Khoảng cách kéo tối đa
        const opacityRange = 0.95 - 0.3; // Phạm vi opacity (từ 0.95 đến 0.3)
        const opacity = 0.95 - (this.dragOffset / maxDrag) * opacityRange;
        this.backgroundOpacity = Math.max(0.3, opacity);

        event.preventDefault();
      }
    },

    handleTouchEnd() {
      if (!this.isSwiping || this.zoomLevel > 1) return;

      const deltaX = this.touchEndX - this.touchStartX;
      const deltaY = this.touchEndY - this.touchStartY;
      const minSwipeDistance = 50;

      // Nếu đang kéo xuống và đã kéo đủ xa, đóng popup
      if (this.isDraggingDown && deltaY > 100) {
        this.closeZoomModal();
        return;
      }

      // Reset trạng thái kéo
      this.isDraggingDown = false;
      this.dragOffset = 0;
      this.backgroundOpacity = 0.95; // Reset opacity

      // Xử lý vuốt ngang nếu không phải kéo xuống
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < 50) {
        if (deltaX > 0) {
          this.slideDirection = 'right';
          this.navigateImage('prev');
        } else {
          this.slideDirection = 'left';
          this.navigateImage('next');
        }
      }

      this.isSwiping = false;
      this.touchStartX = 0;
      this.touchEndX = 0;
      this.touchStartY = 0;
      this.touchEndY = 0;
    },
    parsePrice(value) {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const numeric = Number(value.replace(/[^\d.-]/g, ''));
        return Number.isNaN(numeric) ? 0 : numeric;
      }
      return 0;
    },
    formatPrice(value) {
      const number = Number(value);
      if (!number || Number.isNaN(number) || number <= 0) {
        return 'Liên hệ';
      }
      return number.toLocaleString('vi-VN') + 'đ';
    },
    handleMainImageLoad() {
      this.imageLoading = false;
    },
    handleThumbLoad(index) {
      this.thumbLoaded = { ...this.thumbLoaded, [index]: true };
    },
    applyProductSeo() {
      if (!this.product) return;
      const collectionName = this.product.collectionName || this.product.productType || 'Vietceramics';
      const specColor = this.product.specifications?.['Màu sắc'];
      const specSize = this.product.specifications?.['Kích thước'];
      const featureHighlights = [
        this.product.productType,
        collectionName,
        specColor,
        specSize
      ].filter(Boolean).join(', ');
      const description = this.product.shortDescription ||
        `Khám phá ${this.product.name} (mã ${this.product.itemCode}) - ${collectionName} chính hãng tại Vietceramics.`;
      const metaImage = this.images[0] ||
        this.images_perspective[0] ||
        this.images_real[0] ||
        null;

      updateSeoMeta({
        title: `${this.product.name} | Vietceramics`,
        description,
        keywords: `Vietceramics,${featureHighlights}`,
        image: metaImage,
        url: window.location.href,
        type: 'product'
      });
    }
  },
  // Lifecycle hooks
  mounted() {
    this.fetchProduct();
    window.addEventListener('keydown', this.handleKeyNavigation);
  },
  watch: {
    currentImage() {
      this.imageLoading = true;
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyNavigation);
    // Close any open Fancybox
    if (typeof Fancybox !== 'undefined') {
      Fancybox.close();
    }
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
  height: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 12px rgba(151, 27, 30, 0.08);
  cursor: zoom-in;
}

.main-image:active .zoom-indicator {
  transform: translateX(-50%) scale(0.95);
  opacity: 0.9;
}

.main-image:active .main-img {
  transition: none;
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

.main-image:hover .main-img {
  transform: none;
}

.main-image-skeleton {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(90deg, #f3f3f3 25%, #e2e2e2 50%, #f3f3f3 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

.img-loading {
  opacity: 0;
  transition: opacity 0.25s ease;
}

.thumbnails-wrapper {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 3;
  display: flex;
  align-items: center;
}

.thumbnails {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 6px 0;
  max-width: 100%;
}

.thumb-nav {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 4;
}

.thumb-nav-left {
  margin-right: 8px;
}

.thumb-nav-right {
  margin-left: 8px;
}

.thumbnails::-webkit-scrollbar {
  display: none;
}


.thumbnail-item {
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: 60px;
  height: 60px;
  display: inline-block;
  flex-shrink: 0;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.thumbnail-item.active,
.thumbnail-item:hover {
  border: 2px solid #971b1e;
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

.thumb-skeleton {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background: linear-gradient(90deg, #f3f3f3 25%, #e2e2e2 50%, #f3f3f3 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  z-index: 1;
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
  .main-image {
    height: 400px;
    cursor: pointer;
  }

  .main-img {
    will-change: auto;
    transition: none;
  }

  .thumbnail-item {
    width: 50px;
    height: 50px;
  }

  .thumbnails-wrapper {
    bottom: 12px;
    left: 12px;
    right: 12px;
  }

  .nav-btn {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .main-image {
    height: 350px;
  }

  .thumbnails-wrapper {
    bottom: 10px;
    left: 10px;
    right: 10px;
  }

  .thumbnail-item {
    width: 40px;
    height: 40px;
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
  background: transparent;
  /* Nền trong suốt cho content */
}

:deep(.fancybox__image) {
  object-fit: contain !important;
  /* Hiển thị đầy đủ hình ảnh, không cắt */
  max-height: 90vh !important;
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

:deep(.is-zooming) {
  cursor: grabbing !important;
}

:deep(.is-draggable) {
  cursor: grab !important;
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
  pointer-events: none;
}

.image-type-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.main-image:hover .image-type-overlay {
  opacity: 1;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  margin-bottom: 0;
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
  pointer-events: auto;
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
  gap: 6px;
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
  font-size: 1.6rem;
  color: #971b1e;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.cert-label {
  text-align: center;
}

.cert-name {
  font-size: 0.85rem;
  color: #222;
  font-weight: 600;
}

.cert-value {
  font-size: 0.82rem;
  color: #666;
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
    width: 32px;
    height: 32px;
    font-size: 1.4rem;
  }

  .cert-name {
    font-size: 0.8rem;
  }

  .cert-value {
    font-size: 0.78rem;
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
  overflow: hidden;
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 0;
  font-size: 1rem;
  border-radius: 0;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  white-space: nowrap;
}

.breadcrumb::-webkit-scrollbar {
  display: none;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.breadcrumb-item+.breadcrumb-item::before {
  content: "/";
  color: #aaa;
  padding: 0 6px;
  flex-shrink: 0;
}

.breadcrumb-item a {
  color: #971b1e;
  text-decoration: none;
  transition: color 0.2s;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.breadcrumb-item a:hover {
  color: #b31f23;
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: #222;
  font-weight: 600;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .breadcrumb {
    font-size: 0.9rem;
  }

  .breadcrumb-item a {
    max-width: 100px;
  }

  .breadcrumb-item.active {
    max-width: 150px;
  }
}

@media (max-width: 576px) {
  .breadcrumb {
    font-size: 0.85rem;
  }

  .breadcrumb-item a {
    max-width: 80px;
  }

  .breadcrumb-item.active {
    max-width: 120px;
  }

  .breadcrumb-item+.breadcrumb-item::before {
    padding: 0 4px;
  }
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

.hidden-img {
  display: none;
}

/* Custom zoom modal styles */
.custom-zoom-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out, background 0.3s ease-out;
  will-change: transform, opacity, background;
}

.custom-zoom-container {
  position: relative;
  width: 95%;
  max-width: 1400px;
  height: 95vh;
  background: transparent;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s ease-out;
  will-change: transform;
}

/* Thêm hiệu ứng khi kéo xuống */
.custom-zoom-modal.is-dragging-down .custom-zoom-container {
  transform: scale(0.95);
  transition: transform 0.2s ease-out;
}

/* Animation khi đóng modal */
.fade-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out, background 0.3s ease-out;
}

.fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
  background: rgba(0, 0, 0, 0.3);
}

.custom-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-radius: 40px;
  margin-bottom: 16px;
  background: rgba(30, 30, 30, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
}

.toolbar-btn {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 5px;
}

.zoom-image-wrapper {
  width: 100%;
  flex-grow: 1;
  min-height: 300px;
  border-radius: 2px;
  overflow: hidden;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  margin-bottom: 0;
  /* Changed from margin-bottom: 16px */
  touch-action: pan-y pinch-zoom;
  /* Cho phép vuốt dọc và zoom */
}

.custom-thumbnails {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  max-width: 80%;
  overflow-x: auto;
  padding: 20px;
  ;
  -webkit-backdrop-filter: blur(10px);
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  z-index: 10;
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.1);
  color: #971b1e;
}

.toolbar-btn:active {
  transform: scale(0.95);
}

.toolbar-spacer {
  flex-grow: 1;
}

.zoom-image-wrapper:active {
  cursor: grabbing;
}

.custom-zoomed-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease-out;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
  will-change: transform;
}

.custom-thumbnails::-webkit-scrollbar {
  height: 8px;
}

.custom-thumbnails::-webkit-scrollbar-track {
  background: transparent;
}

.custom-thumbnails::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.thumbnails-container {
  display: flex;
  gap: 10px;
  padding: 5px 10px;
}

.zoom-thumbnail-item {
  width: 70px;
  height: 70px;
  min-width: 70px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  opacity: 0.7;
}

.zoom-thumbnail-item.active {
  border-color: #971b1e;
  opacity: 1;
  transform: scale(1.08);
}

.zoom-thumbnail-item:hover {
  opacity: 1;
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.zoom-thumbnail-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, transparent 40%);
  pointer-events: none;
}

.zoom-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .custom-zoom-container {
    width: 100%;
    padding: 10px;
  }

  .zoom-image-wrapper {
    height: calc(95vh - 220px);
  }

  .toolbar-btn {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .zoom-thumbnail-item {
    width: 60px;
    height: 60px;
    min-width: 60px;
  }

  .custom-toolbar {
    padding: 8px 12px;
    margin-bottom: 10px;
    top: 10px;
    right: 10px;
  }

  .custom-thumbnails {
    padding: 6px 15px;
    max-width: 90%;
    bottom: 15px;
  }

  .thumbnails-container {
    padding: 3px 8px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.custom-zoom-container {
  animation: container-in 0.25s ease forwards;
}

@keyframes container-in {
  from {
    opacity: 0.8;
    transform: scale(0.97);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.zoom-indicator {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(151, 27, 30, 0.9);
  border-radius: 30px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  transform-origin: center;
}

.main-image:hover .zoom-indicator {
  opacity: 1;
  animation: pulse 2s infinite;
}

.zoom-indicator i {
  font-size: 1rem;
  color: #fff;
}

.zoom-indicator span {
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
}

@keyframes pulse {
  0% {
    transform: translateX(-50%) scale(1);
  }

  50% {
    transform: translateX(-50%) scale(1.05);
  }

  100% {
    transform: translateX(-50%) scale(1);
  }
}

.zoom-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #971b1e;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.zoom-nav-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.zoom-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: translateY(-50%);
}

.zoom-nav-btn.prev-btn {
  left: 20px;
}

.zoom-nav-btn.next-btn {
  right: 20px;
}

.zoom-nav-btn i {
  font-size: 1.4rem;
}

@media (max-width: 768px) {
  .zoom-nav-btn {
    width: 40px;
    height: 40px;
  }

  .zoom-nav-btn i {
    font-size: 1.2rem;
  }

  .zoom-nav-btn.prev-btn {
    left: 10px;
  }

  .zoom-nav-btn.next-btn {
    right: 10px;
  }
}

/* Animation khi chuyển ảnh */
@keyframes slideLeft {
  0% {
    transform: translateX(100%) scale(1);
    opacity: 0;
  }

  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideRight {
  0% {
    transform: translateX(-100%) scale(1);
    opacity: 0;
  }

  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

.slide-left {
  animation: slideLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right {
  animation: slideRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Thêm hiệu ứng mờ cho ảnh khi đang trượt */
.zoom-image-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 1;
}

.zoom-image-wrapper.is-sliding::before {
  opacity: 1;
}
</style>
