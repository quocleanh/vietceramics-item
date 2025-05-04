<template>
  <div class="catalog">
    <div class="row g-0">
      <!-- Bộ lọc -->
      <div class="col-3 d-none d-xxl-block">
        <div class="filters-section">
          <h3>Bộ lọc</h3>

          
          <!-- Danh mục 3 cấp -->
          <div class="filter-group mb-4">
            <h4>Danh mục sản phẩm</h4>
            <div class="category-filter">
              <!-- Cấp 1 -->
              <div class="category-level mb-2" v-for="level1 in filters.categories" :key="level1.id">
                <div class="category-header" @click="toggleCategory(level1.id)">
                  <input type="checkbox" :id="'cat-' + level1.id" v-model="selectedFilters.categories" :value="level1.id">
                  <label :for="'cat-' + level1.id">{{ level1.name }}</label>
                  <i class="fi" :class="level1.expanded ? 'fi-br-angle-down' : 'fi-br-angle-right'"></i>
                </div>
                
                <!-- Cấp 2 -->
                <div class="category-level-2 ms-3" v-if="level1.expanded">
                  <div class="category-level mb-2" v-for="level2 in level1.children" :key="level2.id">
                    <div class="category-header" @click="toggleCategory(level2.id)">
                      <input type="checkbox" :id="'cat-' + level2.id" v-model="selectedFilters.categories" :value="level2.id">
                      <label :for="'cat-' + level2.id">{{ level2.name }}</label>
                      <i class="fi" :class="level2.expanded ? 'fi-br-angle-down' : 'fi-br-angle-right'"></i>
                    </div>
                    
                    <!-- Cấp 3 -->
                    <div class="category-level-3 ms-3" v-if="level2.expanded">
                      <div class="form-check" v-for="level3 in level2.children" :key="level3.id">
                        <input class="form-check-input" type="checkbox" :id="'cat-' + level3.id" 
                          v-model="selectedFilters.categories" :value="level3.id">
                        <label class="form-check-label" :for="'cat-' + level3.id">
                          {{ level3.name }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Không gian sử dụng -->
          <div class="filter-group mb-4">
            <h4>Không gian sử dụng</h4>
            <div class="form-check" v-for="space in filters.spaces" :key="space.id">
              <input class="form-check-input" type="checkbox" :id="space.id" v-model="selectedFilters.spaces"
                :value="space.id">
              <label class="form-check-label" :for="space.id">
                {{ space.name }}
              </label>
            </div>
          </div>

          <!-- Kích thước -->
          <div class="filter-group mb-4">
            <h4>Kích thước</h4>
            <div class="form-check" v-for="size in filters.sizes" :key="size.id">
              <input class="form-check-input" type="checkbox" :id="size.id" v-model="selectedFilters.sizes"
                :value="size.id">
              <label class="form-check-label" :for="size.id">
                {{ size.name }}
              </label>
            </div>
          </div>

          <!-- Màu sắc -->
          <div class="filter-group mb-4">
            <h4>Màu sắc</h4>
            <div class="color-options">
              <div v-for="color in filters.colors" :key="color.id" class="color-option"
                :class="{ active: selectedFilters.colors.includes(color.id) }"
                :style="{ backgroundColor: color.code }" @click="toggleColor(color.id)"></div>
            </div>
          </div>

          <!-- Khoảng giá -->
          <div class="filter-group mb-4">
            <h4>Khoảng giá</h4>
            <div class="price-range-slider">
              <div class="d-flex justify-content-between mb-2">
                <span class="price-value">{{ formatPrice(priceRange[0]) }}</span>
                <span class="price-value">{{ formatPrice(priceRange[1]) }}</span>
              </div>
              <div class="range-slider">
                <input type="range" class="form-range" min="0" max="2000000000" step="1000000" 
                  v-model="priceRange[0]" @input="updatePriceRange">
                <input type="range" class="form-range" min="0" max="2000000000" step="1000000" 
                  v-model="priceRange[1]" @input="updatePriceRange">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh sách sản phẩm -->
      <div class="col-12 col-xxl-9 px-3">
        <!-- Nút mở filter cho thiết bị nhỏ -->
        <button class="btn btn-outline-secondary d-block d-xxl-none mb-3" @click="showMobileFilter = true">
          <img src="https://cdn-icons-png.flaticon.com/128/7094/7094575.png" width="20" height="20" alt="Filter" class="me-2">
          Bộ lọc
        </button>

        <div class="products-header d-flex justify-content-between align-items-center mb-4">
          <div class="results-count">
            <div v-if="loading">Đang tải sản phẩm...</div>
            <div v-else>Hiển thị {{ products.length }} sản phẩm</div>
          </div>
          <div class="sort-options">
            <select class="form-select" v-model="sortOption">
              <option value="newest">Mới nhất</option>
              <option value="name">Tên A-Z</option>
              <option value="popular">Phổ biến nhất</option>
            </select>
          </div>
        </div>

        <!-- Skeleton loading -->
        <div v-if="loading" class="row">
          <div v-for="i in 12" :key="i" class="col-md-3 mb-3 col-sm-6 col-6">
            <div class="card h-100 skeleton-card">
              <div class="skeleton-img"></div>
              <div class="card-body">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-button"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product list -->
        <div v-else class="row g-3">
          <div v-for="product in sortedProducts" :key="product.id" class="col-6 col-md-4 col-lg-3 col-xxl-3">
            <div class="card h-100">
              <div class="image-wrapper">
                <img 
                  v-lazy="product.image" 
                  class="card-img-top main-img"
                  :alt="product.name"
                  :data-product-id="product.id"
                  @error="handleImageError($event, product.id)"
                  @load="handleImageLoad($event)"
                  loading="lazy"
                >
                <div class="image-loading-overlay" v-show="!imageLoaded[product.id]">
                  <div class="spinner-border spinner-border-sm text-primary"></div>
                </div>
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text">Mã: {{ product.itemCode }}</p>
                <router-link :to="'/san-pham/' + product.id" class="btn btn-primary">
                  Xem chi tiết
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Phân trang -->
        <nav class="mt-4">
          <ul class="pagination justify-content-center custom-pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">
                <i class="fi fi-br-angle-left"></i>
              </a>
            </li>
            <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: currentPage === page, ellipsis: page === '...' }">
              <a v-if="page !== '...'" class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
              <span v-else class="page-link">...</span>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
                <i class="fi fi-br-angle-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Mobile Filter Popup -->
    <div v-if="showMobileFilter" class="mobile-filter-overlay">
      <div class="mobile-filter-content">
        <button class="btn btn-danger mb-3" @click="showMobileFilter = false">Đóng</button>
        <div class="filters-section">
          <h3>Bộ lọc</h3>

          <!-- Loại sản phẩm -->
          <div class="filter-group mb-4">
            <h4>Loại sản phẩm</h4>
            <div class="form-check" v-for="type in filters.productTypes" :key="type.id">
              <input class="form-check-input" type="checkbox" :id="'mobile-' + type.id"
                v-model="selectedFilters.productTypes" :value="type.id">
              <label class="form-check-label" :for="'mobile-' + type.id">
                {{ type.name }}
              </label>
            </div>
          </div>

          <!-- Danh mục 3 cấp -->
          <div class="filter-group mb-4">
            <h4>Danh mục sản phẩm</h4>
            <div class="category-filter">
              <!-- Cấp 1 -->
              <div class="category-level mb-2" v-for="level1 in filters.categories" :key="level1.id">
                <div class="category-header" @click="toggleCategory(level1.id)">
                  <input type="checkbox" :id="'mobile-cat-' + level1.id" v-model="selectedFilters.categories" :value="level1.id">
                  <label :for="'mobile-cat-' + level1.id">{{ level1.name }}</label>
                  <i class="fi" :class="level1.expanded ? 'fi-br-angle-down' : 'fi-br-angle-right'"></i>
                </div>
                
                <!-- Cấp 2 -->
                <div class="category-level-2 ms-3" v-if="level1.expanded">
                  <div class="category-level mb-2" v-for="level2 in level1.children" :key="level2.id">
                    <div class="category-header" @click="toggleCategory(level2.id)">
                      <input type="checkbox" :id="'mobile-cat-' + level2.id" v-model="selectedFilters.categories" :value="level2.id">
                      <label :for="'mobile-cat-' + level2.id">{{ level2.name }}</label>
                      <i class="fi" :class="level2.expanded ? 'fi-br-angle-down' : 'fi-br-angle-right'"></i>
                    </div>
                    
                    <!-- Cấp 3 -->
                    <div class="category-level-3 ms-3" v-if="level2.expanded">
                      <div class="form-check" v-for="level3 in level2.children" :key="level3.id">
                        <input class="form-check-input" type="checkbox" :id="'mobile-cat-' + level3.id" 
                          v-model="selectedFilters.categories" :value="level3.id">
                        <label class="form-check-label" :for="'mobile-cat-' + level3.id">
                          {{ level3.name }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Không gian sử dụng -->
          <div class="filter-group mb-4">
            <h4>Không gian sử dụng</h4>
            <div class="form-check" v-for="space in filters.spaces" :key="space.id">
              <input class="form-check-input" type="checkbox" :id="'mobile-' + space.id"
                v-model="selectedFilters.spaces" :value="space.id">
              <label class="form-check-label" :for="'mobile-' + space.id">
                {{ space.name }}
              </label>
            </div>
          </div>

          <!-- Kích thước -->
          <div class="filter-group mb-4">
            <h4>Kích thước</h4>
            <div class="form-check" v-for="size in filters.sizes" :key="size.id">
              <input class="form-check-input" type="checkbox" :id="'mobile-' + size.id"
                v-model="selectedFilters.sizes" :value="size.id">
              <label class="form-check-label" :for="'mobile-' + size.id">
                {{ size.name }}
              </label>
            </div>
          </div>

          <!-- Màu sắc -->
          <div class="filter-group mb-4">
            <h4>Màu sắc</h4>
            <div class="color-options">
              <div v-for="color in filters.colors" :key="color.id" class="color-option"
                :class="{ active: selectedFilters.colors.includes(color.id) }"
                :style="{ backgroundColor: color.code }" @click="toggleColor(color.id)"></div>
            </div>
          </div>

          <!-- Khoảng giá -->
          <div class="filter-group mb-4">
            <h4>Khoảng giá</h4>
            <div class="price-range-slider">
              <div class="d-flex justify-content-between mb-2">
                <span class="price-value">{{ formatPrice(priceRange[0]) }}</span>
                <span class="price-value">{{ formatPrice(priceRange[1]) }}</span>
              </div>
              <div class="range-slider">
                <input type="range" class="form-range" min="0" max="2000000000" step="1000000" 
                  v-model="priceRange[0]" @input="updatePriceRange">
                <input type="range" class="form-range" min="0" max="2000000000" step="1000000" 
                  v-model="priceRange[1]" @input="updatePriceRange">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  ///POST http://item.vietceramics.vn/vi/loc-san-pham?space=TBVS

  name: 'Catalog',
  data() {
    return {
      currentPage: 1,
      sortOption: 'newest',
      priceRange: [0, 2000000000],
      selectedFilters: {
        productTypes: [],
        spaces: [],
        sizes: [],
        colors: [],
        categories: []
      },
      showMobileFilter: false,
      products: [],
      loading: false,
      imageLoaded: {},
      // Data mẫu cho bộ lọc
      filters: {
        productTypes: [
          { id: 'tile', name: 'Gạch ốp lát' },
          { id: 'sanitary', name: 'Thiết bị vệ sinh' },
          { id: 'decoration', name: 'Gạch trang trí' }
        ],
        spaces: [
          { id: 'pn', name: 'Phòng ngủ' },
          { id: 'pk', name: 'Phòng khách' },
          { id: 'pt', name: 'Phòng tắm' },
          { id: 'pb', name: 'Nhà bếp' },
          { id: 'nt', name: 'Ngoài trời' },
          { id: 'tbvs', name: 'Thiết bị vệ sinh' },
          { id: 'kh', name: 'Khác' }
        ],
        sizes: [
          { id: '1000x1000', name: '1000 x 1000 mm' },
          { id: '1200x1200', name: '1200 x 1200 mm' },
          { id: '1200x2400', name: '1200 x 2400 mm' },
          { id: '150x600', name: '150 x 600 mm' },
          { id: '105x900', name: '105 x 900 mm' },
          { id: '1500x3000', name: '1500 x 3000 mm' },
          { id: '200x1000', name: '200 x 1000 mm' },
          { id: '200x1200', name: '200 x 1200 mm' },
          { id: '200x750', name: '200 x 750 mm' },
          { id: '230x1200', name: '230 x 1200 mm' },
          { id: '300x300', name: '300 x 300 mm' },
          { id: '300x600', name: '300 x 600 mm' },
          { id: '400x800', name: '400 x 800 mm' },
          { id: '450x900', name: '450 x 900 mm' },
          { id: '600x1200', name: '600 x 1200 mm' },
          { id: '600x600', name: '600 x 600 mm' },
          { id: '750x750', name: '750 x 750 mm' },
          { id: '800x1600', name: '800 x 1600 mm' },
          { id: '800x800', name: '800 x 800 mm' },
          { id: '900x1800', name: '900 x 1800 mm' },
          { id: '900x900', name: '900 x 900 mm' },
          { id: '315x1000', name: '315 x 1000 mm' },
          { id: '200x200', name: '200 x 200 mm' },
          { id: '300x900', name: '300 x 900 mm' },
          { id: '330x1000', name: '330 x 1000 mm' },
          { id: '750x1500', name: '750 x 1500 mm' }
        ],
        colors: [
          { id: 'white', code: '#ffffff' },
          { id: 'black', code: '#000000' },
          { id: 'gray', code: '#808080' },
          { id: 'beige', code: '#f5f5dc' }
        ],
        categories: [
          {
            id: 'bathroom',
            name: 'Thiết bị phòng tắm',
            expanded: false,
            children: [
              {
                id: 'bathroom-sink',
                name: 'Bồn rửa mặt',
                expanded: false,
                children: [
                  { id: 'wall-mounted-sink', name: 'Bồn rửa mặt treo tường' },
                  { id: 'countertop-sink', name: 'Bồn rửa mặt đặt bàn' },
                  { id: 'pedestal-sink', name: 'Bồn rửa mặt có chân' }
                ]
              },
              {
                id: 'toilet',
                name: 'Bồn cầu',
                expanded: false,
                children: [
                  { id: 'one-piece-toilet', name: 'Bồn cầu liền khối' },
                  { id: 'two-piece-toilet', name: 'Bồn cầu rời' },
                  { id: 'wall-hung-toilet', name: 'Bồn cầu treo tường' }
                ]
              }
            ]
          },
          {
            id: 'tile',
            name: 'Gạch ốp lát',
            expanded: false,
            children: [
              {
                id: 'wall-tile',
                name: 'Gạch ốp tường',
                expanded: false,
                children: [
                  { id: 'ceramic-wall', name: 'Gạch ceramic ốp tường' },
                  { id: 'porcelain-wall', name: 'Gạch porcelain ốp tường' }
                ]
              },
              {
                id: 'floor-tile',
                name: 'Gạch lát nền',
                expanded: false,
                children: [
                  { id: 'ceramic-floor', name: 'Gạch ceramic lát nền' },
                  { id: 'porcelain-floor', name: 'Gạch porcelain lát nền' }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  computed: {
    sortedProducts() {
      let sorted = [...this.products]
      switch (this.sortOption) {
        case 'name':
          sorted.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'popular':
          // TODO: Implement popularity sorting
          break
        default: // newest
          sorted.sort((a, b) => b.id - a.id)
      }
      return sorted
    },
    totalPages() {
      return Math.ceil(this.products.length / 12) // 12 sản phẩm mỗi trang
    },
    visiblePages() {
      // Hiển thị tối đa 5 trang, ... nếu nhiều
      const pages = []
      if (this.totalPages <= 5) {
        for (let i = 1; i <= this.totalPages; i++) pages.push(i)
      } else {
        if (this.currentPage <= 3) {
          pages.push(1, 2, 3, 4, '...', this.totalPages)
        } else if (this.currentPage >= this.totalPages - 2) {
          pages.push(1, '...', this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages)
        } else {
          pages.push(1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', this.totalPages)
        }
      }
      return pages
    }
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        this.products = [] // Clear products before loading
        
        // Tạo object để track trạng thái ảnh
        this.imageLoaded = {}

        const response = await axios.post('/api/SearchhProduct/_Filter', {
          language: 'vi',
          key: '',
          pageIndex: this.currentPage,
          pageSize: 12,
          minPrice: this.priceRange[0],
          maxPrice: this.priceRange[1]
        }, {
          params: {
            space: this.$route.query.space || '',
            size: this.$route.query.size || '',
            sort: this.sortOption
          }
        })
        
        const productItems = response.data.ListItems.map(item => {
          const productId = item.No_
          // Set default image loading state
          this.imageLoaded[productId] = false
          
          return {
            id: productId,
            name: item.Name || 'Gạch ' + item.No_,
            itemCode: item.No_,
            image: `http://toppstiles.com.vn/products-test/hinh-gach/${item.No_}.jpg`,
            collectionName: item.Class || 'Chưa phân loại',
            description: item.Description || ''
          }
        })
        
        // Delay products loading for smoother UX
        setTimeout(() => {
          this.products = productItems
          this.loading = false
        }, 300)
      } catch (error) {
        console.error('Error loading products:', error)
        this.products = []
        this.loading = false
      }
    },
    handleImageError(event, productId) {
      // Replace broken image with placeholder
      event.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
      this.imageLoaded[productId] = true
    },
    handleImageLoad(event) {
      // Đánh dấu ảnh đã load xong
      const img = event.target;
      const productId = img.getAttribute('data-product-id') || 
                        img.closest('.card')?.getAttribute('data-product-id');
      
      if (productId) {
        this.imageLoaded[productId] = true;
      }
      
      // Đảm bảo ảnh sẽ cover đầy container bằng CSS thay vì tính toán tỷ lệ
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.objectPosition = 'center';
    },
    toggleColor(colorId) {
      const index = this.selectedFilters.colors.indexOf(colorId)
      if (index === -1) {
        this.selectedFilters.colors.push(colorId)
      } else {
        this.selectedFilters.colors.splice(index, 1)
      }
    },
    applyFilters() {
      this.currentPage = 1
      this.loadProducts()
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(price)
    },
    updatePriceRange() {
      // Đảm bảo giá tối thiểu không lớn hơn giá tối đa
      if (this.priceRange[0] > this.priceRange[1]) {
        this.priceRange[0] = this.priceRange[1]
      }
      this.loadProducts()
    },
    toggleCategory(categoryId) {
      // Tìm category trong cấp 1
      let category = this.filters.categories.find(cat => cat.id === categoryId)
      if (category) {
        category.expanded = !category.expanded
        return
      }

      // Tìm category trong cấp 2
      for (let level1 of this.filters.categories) {
        category = level1.children.find(cat => cat.id === categoryId)
        if (category) {
          category.expanded = !category.expanded
          return
        }
      }
    }
  },
  watch: {
    '$route.query': {
      handler() {
        this.loadProducts()
      },
      immediate: true
    },
    currentPage() {
      this.loadProducts()
    },
    sortOption() {
      this.loadProducts()
    }
  }
}
</script>

<style scoped>
.catalog {
  padding: 15px;
}

.filters-section {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  height: 100%;
}

.filter-group h4 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #dee2e6;
}

.color-option.active {
  border-color: #0d6efd;
}

.card {
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: box-shadow 0.3s, transform 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background: #fff;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(151,27,30,0.15), 0 1.5px 6px rgba(0,0,0,0.08);
  transform: translateY(-4px) scale(1.025);
  z-index: 2;
}

.image-wrapper {
  position: relative;
  height: 200px;
  background-color: #f8f9fa;
  overflow: hidden;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  transition: opacity 0.3s, transform 0.3s;
  background: #f8f9fa;
}

.card:hover .card-img-top {
  opacity: 0.92;
  transform: scale(1.04);
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 0.5rem 1.2rem 0.5rem;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.5rem;
  text-align: center;
}

.card-text {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 0.75rem;
  text-align: center;
}

.btn-primary {
  background: #971b1e;
  border: none;
  border-radius: 20px;
  font-weight: 500;
  padding: 0.45rem 1.2rem;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(151,27,30,0.08);
}

.card:hover .btn-primary {
  background: #7a1618;
  transform: scale(1.07);
  box-shadow: 0 4px 16px rgba(151,27,30,0.15);
}

@media (max-width: 992px) {
  .card-img-top, .image-wrapper {
    height: 140px;
    min-height: 140px;
  }
}

@media (max-width: 768px) {
  .row {
    --bs-gutter-x: 0;
  }

  .col-md-3 {
    width: 33.333333%;
    padding: 0.25rem;
  }

  .card-img-top, .image-wrapper {
    height: 120px;
    min-height: 120px;
  }

  .card-body {
    padding: 0.5rem 0.25rem 0.75rem 0.25rem;
  }

  .card-title {
    font-size: 0.9rem;
    line-height: 1.2;
    margin-bottom: 0.25rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 2.4em;
  }

  .card-text {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btn-primary {
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
  }

  .main-image {
    height: 300px;
  }
}

@media (max-width: 576px) {
  .col-md-3 {
    width: 50%;
  }

  .card-img-top, .image-wrapper {
    height: 100px;
    min-height: 100px;
  }

  .card-title {
    font-size: 0.85rem;
    height: 2.2em;
  }

  .card-text {
    font-size: 0.75rem;
  }

  .main-image {
    height: 100vw;
    max-height: 100vw;
    min-height: 100vw;
  }
}

.custom-pagination {
  --bs-pagination-bg: #fff;
  --bs-pagination-border-color: #eee;
  --bs-pagination-hover-bg: #f8f9fa;
  --bs-pagination-active-bg: #971b1e;
  --bs-pagination-active-border-color: #971b1e;
  --bs-pagination-color: #971b1e;
  --bs-pagination-active-color: #fff;
  --bs-pagination-border-radius: 2rem;
  --bs-pagination-padding-x: 1rem;
  --bs-pagination-padding-y: 0.5rem;
  --bs-pagination-font-size: 1.1rem;
  --bs-pagination-box-shadow: 0 2px 8px rgba(151,27,30,0.08);
  font-weight: 500;
}

.custom-pagination .page-item {
  margin: 0 0.15rem;
  border-radius: 2rem;
  box-shadow: var(--bs-pagination-box-shadow);
  transition: box-shadow 0.2s, transform 0.2s;
}

.custom-pagination .page-item.active .page-link {
  background: var(--bs-pagination-active-bg);
  color: var(--bs-pagination-active-color);
  border-color: var(--bs-pagination-active-border-color);
  box-shadow: 0 4px 16px rgba(151,27,30,0.15);
  font-weight: 700;
  transform: scale(1.08);
}

.custom-pagination .page-link {
  border-radius: 2rem !important;
  color: var(--bs-pagination-color);
  border: 1.5px solid var(--bs-pagination-border-color);
  background: var(--bs-pagination-bg);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s;
  min-width: 2.5rem;
  text-align: center;
  font-size: 1.08rem;
  padding: 0.45rem 0.9rem;
}

.custom-pagination .page-link:hover {
  background: var(--bs-pagination-hover-bg);
  color: #7a1618;
  box-shadow: 0 2px 8px rgba(151,27,30,0.10);
  transform: scale(1.04);
}

.custom-pagination .page-item.disabled .page-link {
  color: #bbb;
  background: #f8f9fa;
  border-color: #eee;
  cursor: not-allowed;
}

.custom-pagination .page-item.ellipsis .page-link {
  background: transparent;
  border: none;
  color: #bbb;
  cursor: default;
  pointer-events: none;
  font-size: 1.2rem;
  box-shadow: none;
}

@media (max-width: 576px) {
  .custom-pagination .page-link {
    min-width: 2rem;
    font-size: 0.98rem;
    padding: 0.35rem 0.6rem;
  }
}

.mobile-filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  z-index: 1050;
  overflow-y: auto;
  padding: 1rem;
}

.mobile-filter-content {
  max-width: 600px;
  margin: 0 auto;
}

/* Skeleton styles */
.skeleton-card {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  overflow: hidden;
}

.skeleton-img {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-skeleton 1.5s infinite;
}

.skeleton-title {
  height: 24px;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-skeleton 1.5s infinite;
  border-radius: 4px;
}

.skeleton-text {
  height: 16px;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-skeleton 1.5s infinite;
  border-radius: 4px;
  width: 70%;
}

.skeleton-button {
  height: 38px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-skeleton 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading-skeleton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.price-range-slider {
  padding: 0 0.5rem;
}

.range-slider {
  position: relative;
  height: 1.5rem;
  padding: 0;
  margin: 0.5rem 0;
}

.range-slider input[type="range"] {
  position: absolute;
  width: 100%;
  pointer-events: none;
  -webkit-appearance: none;
  background: transparent;
}

.range-slider input[type="range"]::-webkit-slider-thumb {
  pointer-events: auto;
  -webkit-appearance: none;
  background: #971b1e;
  border: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
}

.range-slider input[type="range"]::-moz-range-thumb {
  pointer-events: auto;
  background: #971b1e;
  border: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
}

.range-slider input[type="range"]::-webkit-slider-runnable-track {
  background: #dee2e6;
  height: 4px;
  border-radius: 2px;
}

.range-slider input[type="range"]::-moz-range-track {
  background: #dee2e6;
  height: 4px;
  border-radius: 2px;
}

.range-slider::before {
  content: '';
  position: absolute;
  height: 4px;
  background: #971b1e;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  z-index: 1;
}

.price-value {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.category-filter {
  padding: 0.5rem 0;
}

.category-level {
  position: relative;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0;
}

.category-header:hover {
  color: #971b1e;
}

.category-header i {
  margin-left: auto;
  font-size: 0.9rem;
  color: #666;
  transition: transform 0.2s;
}

.category-level-2,
.category-level-3 {
  margin-top: 0.5rem;
}

.category-level-2 .form-check,
.category-level-3 .form-check {
  margin-bottom: 0.25rem;
}

.category-level-2 .form-check-label,
.category-level-3 .form-check-label {
  font-size: 0.95rem;
}

/* Product list layout */
@media (min-width: 1336px) {
  .col-3 {
    width: 25%;
  }
  .col-9 {
    width: 75%;
  }
  
  .image-wrapper {
    height: 220px;
  }

  .card-body {
    padding: 1rem;
  }

  .card-title {
    font-size: 1.1rem;
    line-height: 1.4;
    margin-bottom: 0.75rem;
  }

  .card-text {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }

  .btn-primary {
    padding: 0.5rem 1.25rem;
    font-size: 0.95rem;
  }
}

@media (min-width: 1024px) and (max-width: 1335px) {
  .image-wrapper {
    height: 200px;
  }

  .card-body {
    padding: 0.875rem;
  }

  .card-title {
    font-size: 1.05rem;
    line-height: 1.3;
    margin-bottom: 0.625rem;
  }

  .card-text {
    font-size: 0.9rem;
    margin-bottom: 0.875rem;
  }

  .btn-primary {
    padding: 0.45rem 1.1rem;
    font-size: 0.9rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .image-wrapper {
    height: 180px;
  }

  .card-body {
    padding: 0.75rem;
  }

  .card-title {
    font-size: 1rem;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }

  .card-text {
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }

  .btn-primary {
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 767px) {
  .row {
    --bs-gutter-x: 20px;
  }

  .image-wrapper {
    height: 160px;
  }

  .card-body {
    padding: 0.625rem;
  }

  .card-title {
    font-size: 0.95rem;
    line-height: 1.2;
    margin-bottom: 0.375rem;
  }

  .card-text {
    font-size: 0.8rem;
    margin-bottom: 0.625rem;
  }

  .btn-primary {
    padding: 0.35rem 0.875rem;
    font-size: 0.8rem;
  }
}

/* Common card styles */
.card {
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: box-shadow 0.3s, transform 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background: #fff;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(151,27,30,0.15), 0 1.5px 6px rgba(0,0,0,0.08);
  transform: translateY(-4px) scale(1.025);
  z-index: 2;
}

.image-wrapper {
  position: relative;
  background-color: #f8f9fa;
  overflow: hidden;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  transition: opacity 0.3s, transform 0.3s;
  background: #f8f9fa;
}

.card:hover .card-img-top {
  opacity: 0.92;
  transform: scale(1.04);
}

.card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #222;
  font-weight: 600;
}

.card-text {
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-primary {
  background: #971b1e;
  border: none;
  border-radius: 20px;
  font-weight: 500;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(151,27,30,0.08);
}

.card:hover .btn-primary {
  background: #7a1618;
  transform: scale(1.07);
  box-shadow: 0 4px 16px rgba(151,27,30,0.15);
}

.main-image {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  overflow: hidden;
}

.main-img {
  max-width: 100%;
  max-height: 100%;
  object-position: center;
  transition: all 0.3s ease;
}
</style>