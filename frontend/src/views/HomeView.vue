<template><div class="top-bar" @click.stop>
      <div class="container top-bar-inner">
        <div class="top-right-login">
          <router-link v-if="!userData" to="/login" class="btn-login-top">
            <i class="fi fi-br-user"></i>
            <span>Đăng nhập</span>
          </router-link>
          <div v-else class="user-pill" @click="toggleUserMenu">
            <i class="fi fi-br-user"></i>
            <span>{{ userData.name || userData.username }}</span>
            <i class="fi fi-br-angle-down small-icon"></i>
          </div>
          <div v-if="showUserMenu" class="home-user-menu">
            <div class="home-user-menu-item">
              <i class="fi fi-br-user"></i>
              <span>{{ userData.name || userData.username }}</span>
            </div>
            <router-link class="home-user-menu-item" to="/quote-list" @click="closeUserMenu">
              <i class="fi fi-br-file-invoice"></i>
              <span>Báo giá của tôi</span>
            </router-link>
            <router-link class="home-user-menu-item" to="/profile" @click="closeUserMenu">
              <i class="fi fi-br-settings"></i>
              <span>Tài khoản</span>
            </router-link>
            <button class="home-user-menu-item logout-btn" @click="handleLogout">
              <i class="fi fi-br-sign-out"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  <div class="home">
     
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-head">
            <div class="logo-block">
              <div class="logo-wrapper">
                <img src="@/assets/images/logo-vietceramics.png" alt="Logo Vietceramics" class="logo" />
              </div>
                <div class="logo-text">
                <span class="eyebrow-pill logo-sub">item</span>
                 
                </div>
            </div>
          </div>

          <h1 class="hero-title">
            Khơi cảm hứng cho mọi không gian
          </h1>
          <p class="hero-lead">
            Tìm nhanh mã sản phẩm, bộ sưu tập và lọc theo nhu cầu thiết kế.
          </p>

          <div class="search-box position-relative">
            <div class="search-input-wrapper">
              <i class="fi fi-br-search search-icon"></i>
              <input type="text" class="form-control search-input" placeholder="Nhập mã sản phẩm..."
                v-model="searchQuery" @input="handleSearch"
                @keydown.enter.prevent="handleEnterSearch"
                @keydown.down.prevent="moveHighlight(1)"
                @keydown.up.prevent="moveHighlight(-1)" />
            </div>

            <div class="search-results" v-if="showResults || isSearching">
              <div v-if="isSearching" class="search-loading">
                <div class="spinner"></div>
                <span>Đang tìm kiếm...</span>
              </div>
              <div v-else-if="searchResults.length === 0" class="no-results">
                Không tìm thấy kết quả
              </div>
              <div v-else class="search-items" ref="homeSearchResults">
                <div
                  v-for="(item, idx) in searchResults"
                  :key="item.id"
                  class="search-item"
                  :class="{ active: highlightedIndex === idx }"
                  role="button"
                  tabindex="0"
                  @click="goToProduct(item.product_code)"
                  @keydown.enter.prevent="goToProduct(item.product_code)"
                >
                  <div class="d-flex align-items-center">
                    <div class="search-thumb-wrapper">
                      <img :src="item.thumbnail" class="search-thumb" :alt="item.name"
                        @error="$event.target.src = 'https://placehold.co/100x100?text=vietceramics'" />
                    </div>
                    <div class="search-item-content">
                      <span class="product-name">
                        {{ item.product_name }}
                      </span>
                      <div class="collection-name">
                        <router-link
                          :to="buildCollectionLink(item)"
                          class="collection-name"
                          @click.stop
                        >
                          Bộ sưu tập: {{ item.collectionName }}
                        </router-link>
                      </div>
                    </div>
                    <div class="search-item-icon">
                      <i class="fi fi-br-angle-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="hero-showcase">
            <div class="spotlight-card" v-for="space in spaces" :key="space.id" :style="{ background: space.gradient }">
              <div class="spotlight-icon">
                <img :src="space.image" :alt="space.name" class="space-image">
              </div>
              <div class="spotlight-body">
                <p class="spotlight-eyebrow">Danh mục</p>
                <h3>{{ space.name }}</h3>
                <p class="spotlight-text">{{ space.description }}</p>
              </div>
              <router-link class="spotlight-link" :to="{ name: 'catalog', query: { productType: space.productType } }">
                Khám phá <i class="fi fi-br-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section sizes-section">
      <div class="container">
        <div class="section-header">
          <div>
            <p class="eyebrow">Lọc theo kích thước</p>
            <h2>Kích thước phổ biến</h2>
            <p class="muted">Danh sách lấy trực tiếp từ bộ lọc danh mục.</p>
          </div>
          <router-link class="section-link" :to="{ name: 'catalog' }">
            Mở bộ lọc <i class="fi fi-br-arrow-right"></i>
          </router-link>
        </div>
        <div class="chip-rail">
          <router-link v-for="size in sizeChips" :key="size.id" :to="{ name: 'catalog', query: { size: size.id } }"
            class="chip">
            {{ size.name }}
          </router-link>
        </div>
      </div>
    </section>

    <section class="section sanitary-section">
      <div class="container">
        <div class="section-header">
          <div>
            <p class="eyebrow">Thiết bị vệ sinh</p>
            <h2>Danh mục nổi bật</h2>
            <p class="muted">Chọn nhanh các nhóm sản phẩm được quan tâm nhiều.</p>
          </div>
          <router-link class="section-link" :to="{ name: 'catalog', query: { productType: 'thiết bị vệ sinh' } }">
            Xem tất cả TBVS <i class="fi fi-br-arrow-right"></i>
          </router-link>
        </div>
        <div class="pill-grid">
          <router-link v-for="category in sanitaryHighlights" :key="category.id" class="pill-card"
            :to="{ name: 'catalog', query: { productType: 'thiết bị vệ sinh', category: category.id } }">
            <span class="pill-dot"></span>
            <span class="pill-text">{{ category.name }}</span>
            <i class="fi fi-br-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import { updateSeoMeta } from '@/utils/seo'
import { getFeaturedCategories, getSizeOptions } from '@/data/catalogFilters'

const apiBaseUrl = 'https://api.vietceramics.com/api'

export default {
  name: 'HomeView',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      showResults: false,
      isSearching: false,
      userData: null,
      showUserMenu: false,
      spaces: [
        {
          id: 'pn',
          name: 'Gạch ốp lát',
          productType: 'gạch',
          image: 'https://cdn-icons-gif.flaticon.com/10966/10966480.gif',
          description: 'BST gạch ốp lát đa bề mặt, phù hợp mọi không gian.',
          gradient: 'linear-gradient(135deg, #f5f7ff 0%, #dbe3ff 100%)'
        },
        {
          id: 'tbvs',
          name: 'Thiết bị vệ sinh',
          productType: 'thiết bị vệ sinh',
          image: 'https://cdn-icons-gif.flaticon.com/17091/17091858.gif',
          description: 'Thiết bị phòng tắm cao cấp với thiết kế tinh gọn.',
          gradient: 'linear-gradient(135deg, #fff5f2 0%, #ffe1d8 100%)'
        },
        {
          id: 'kh',
          name: 'Ván sàn',
          productType: 'Ván sàn',
          image: 'https://cdn-icons-png.flaticon.com/128/5848/5848426.png',
          description: 'Ván sàn ấm áp, kết cấu chân thực cho không gian sống.',
          gradient: 'linear-gradient(135deg, #f7f4ef 0%, #eadfce 100%)'
        }
      ],
      sizes: getSizeOptions(), // tái sử dụng danh sách kích thước từ bộ lọc danh mục
      sanitaryCategories: getFeaturedCategories('thiết bị vệ sinh')
    }
  },
  computed: {
    sizeChips() {
      return this.sizes
    },
    sanitaryHighlights() {
      return this.sanitaryCategories.slice(0, 14)
    }
  },
  methods: {
    checkLoginStatus() {
      const user = localStorage.getItem('user')
      if (!user) {
        this.userData = null
        return
      }
      try {
        const parsed = JSON.parse(user)
        if (new Date(parsed.expiresAt) > new Date()) {
          this.userData = parsed
        } else {
          localStorage.removeItem('user')
          this.userData = null
        }
      } catch (e) {
        console.error('parse user error', e)
        localStorage.removeItem('user')
        this.userData = null
      }
    },
    debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func.apply(this, args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },
    async handleSearch() {
      try {
        const keyword = this.searchQuery.trim()
        if (keyword.length > 0) {
          this.isSearching = true
          const response = await axios.get(`${apiBaseUrl}/Products/Search`, {
            params: {
              keyword,
              pageIndex: 1,
              pageSize: 10
            }
          })
          // Check if response.data.data is an array
          const items = Array.isArray(response.data?.data) ? response.data.data : []
          console.log('Search results:', items)
          this.searchResults = items.map(item => ({
            id: item.id,
            product_code: item.product_code,
            product_name: item.product_name,
            product_category: item.product_category || '',
            collectionName: item.custom_field121 || item.product_category || item.custom_field68 || 'Chưa phân loại',
            thumbnail: "https://static.superstone.com.vn/products-test/hinh-gach/" + item.product_code + ".jpg"
          }))
          this.highlightedIndex = this.searchResults.length ? 0 : -1
          this.showResults = true
        } else {
          this.searchResults = []
          this.showResults = false
          this.highlightedIndex = -1
        }
      } catch (error) {
        console.error('Search error:', error)
        this.searchResults = []
        this.showResults = true
        this.highlightedIndex = -1
      } finally {
        this.isSearching = false
      }
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    closeUserMenu() {
      this.showUserMenu = false
    },
    buildCollectionLink(item) {
      const collection = item?.collectionName || '';
      const categoryRaw = item?.product_category || '';
      const isTile = categoryRaw.toLowerCase().includes('gạch');

      const query = {};
      if (isTile) {
        query.productType = 'gạch';
      }
      if (collection) {
        query.collection = collection;
      }

      return { name: 'catalog', query };
    },
    goToProduct(productCode) {
      if (!productCode) return;
      this.$router.push({ name: 'product-detail', params: { id: productCode } });
    },
    handleEnterSearch() {
      const firstItem = this.searchResults[0];
      const highlighted = this.highlightedIndex >= 0 ? this.searchResults[this.highlightedIndex] : null;
      const target = highlighted || firstItem;
      if (target && !this.isSearching) {
        this.goToProduct(target.product_code);
      } else {
        this.handleSearch();
      }
    },
    moveHighlight(direction) {
      if (!this.showResults || this.isSearching || !this.searchResults.length) return
      const total = this.searchResults.length
      const nextIndex = this.highlightedIndex === -1
        ? 0
        : (this.highlightedIndex + direction + total) % total
      this.highlightedIndex = nextIndex
      this.$nextTick(() => {
        const container = this.$refs.homeSearchResults
        const items = container?.querySelectorAll('.search-item')
        const active = items && items[nextIndex]
        if (active && container) {
          const itemTop = active.offsetTop
          const itemBottom = itemTop + active.offsetHeight
          const viewTop = container.scrollTop
          const viewBottom = viewTop + container.clientHeight
          if (itemTop < viewTop) {
            container.scrollTop = itemTop
          } else if (itemBottom > viewBottom) {
            container.scrollTop = itemBottom - container.clientHeight
          }
        }
      })
    },
    handleLogout() {
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('user-logged-out'))
      this.userData = null
      this.showUserMenu = false
      this.$router.push('/login')
    },
    applyHomeSeo() {
      const spaceLabels = this.spaces.map(space => space.name).join(', ')
      updateSeoMeta({
        title: 'Vietceramics | Không gian vật liệu cao cấp',
        description: `Khám phá ${spaceLabels} cùng hàng nghìn thiết kế gạch, thiết bị vệ sinh và Ván sàn chính hãng từ Vietceramics.`,
        keywords: `Vietceramics,${spaceLabels}`,
        image: this.spaces[0]?.image
      })
    }
  },
  mounted() {
    document.addEventListener('click', this.closeUserMenu)
    this.applyHomeSeo()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeUserMenu)
  },
  created() {
    // Debounce the search handler
    this.handleSearch = this.debounce(this.handleSearch, 300)
    this.checkLoginStatus()
  }
}
</script>

<style scoped>
.home { 
}

.hero {
  padding: 32px 0 20px;
  background: transparent;
  margin-bottom: 10px;
}

.hero-grid {
  display: block;
}

.hero-content {
  position: relative;
  margin: 0 auto;
}

.hero-content>*:not(:last-child) {
  margin-bottom: 18px;
}

.hero-title {
  margin: 12px 0 8px;
}

.hero-lead {
  margin: 0 0 10px;
}

.hero-head {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
}

.logo-block {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-wrapper {
  width: 72px;
  height: 72px;
  background: #fff;
  border-radius: 16px;
  display: grid;
  place-items: center;
}

.logo {
  height: 54px;
  width: auto;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
} 
.logo-text .logo-sub  {
    margin-top: -31px;
    font-size: 12px;
    color: #ffffff;
    position: absolute;
    right: -166px;
}
.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #0c1c2e;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.logo-sub {
  margin: 0;
  color: #4b5563;
  font-size: 14px;
}

.top-right-login {
  margin-left: auto;
  position: relative;
  z-index: 5;
}

.btn-login-top,
.user-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(12, 28, 46, 0.07);
  color: #0c1c2e;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.btn-login-top:hover,
.user-pill:hover {
  transform: translateY(-2px);
  background: rgba(12, 28, 46, 0.12);
}

.top-bar {
  padding: 10px 0;
}

.top-bar-inner {
  display: flex;
  justify-content: flex-end;
}

.home-user-menu {
  position: absolute;
  top: 44px;
  right: 0;
  background: #fff;
  border: 1px solid #e6e9ef;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  min-width: 220px;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

.home-user-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: #1f2937;
  text-decoration: none;
  background: #fff;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.home-user-menu-item:hover {
  background: #f5f7fb;
}

.home-user-menu .logout-btn {
  color: #b00020;
}

.small-icon {
  font-size: 14px;
}

.hero-title {
  margin: 20px 0 8px;
  font-size: 36px;
  line-height: 1.2;
  color: #0c1c2e;
  font-weight: 700;
}

.hero-lead {
  margin: 0 0 16px;
  color: #4b5563;
  font-size: 16px;
}
.section {
  
}
.search-box {
  width: 100%;
  margin-top: 10px;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  height: 56px;
  padding-left: 52px;
  padding-right: 16px;
  border-radius: 14px;
  font-size: 16px;
  background: #0c1c2e;
  color: #fff;
  border: none;
  box-shadow: 0 10px 30px rgba(12, 28, 46, 0.25);
}

.search-input:focus {
  outline: none;
  box-shadow: 0 12px 36px rgba(12, 28, 46, 0.3);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.65);
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 18px;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
  z-index: 1000;
  max-height: 420px;
  overflow-y: auto;
  margin-top: 0.65rem;
  scrollbar-width: thin;
  scrollbar-color: #909090 #f1f1f1;
}

.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb {
  background: #909090;
  border-radius: 3px;
}

.search-item {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f1f3f4;
  transition: background-color 0.2s;
  cursor: pointer;
}

.search-item:last-child {
  border-bottom: none;
}

.search-item:hover {
  background-color: #f8f9fa;
}

.search-item.active {
  background: #eef2ff;
  border-left: 3px solid #971b1e;
}

.search-thumb-wrapper {
  width: 60px;
  height: 60px;
  margin-right: 1rem;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f3f4f6;
}

.search-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-item-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex-wrap: nowrap;
  align-items: flex-start;
}

.product-name {
  font-size: 0.98rem;
  font-weight: 600;
  color: #0c1c2e;
  text-decoration: none;
  line-height: 1.3;
}

.product-name:hover {
  color: #b00020;
  text-decoration: underline;
}

.collection-name {
  font-size: 0.86rem;
  color: #5f6368;
  text-decoration: none;
}

.collection-name:hover {
  color: #202124;
  text-decoration: underline;
}

.search-item-icon {
  margin-left: auto;
  color: #9ca3af;
}

.search-loading {
  padding: 1rem;
  text-align: center;
  color: #5f6368;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.no-results {
  padding: 1rem;
  text-align: center;
  color: #5f6368;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quick-links {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.quick-links-label {
  color: #6b7280;
  font-weight: 600;
  font-size: 14px;
}

.quick-pill {
  background: #fff;
  border: 1px solid #e6e9ef;
  border-radius: 999px;
  padding: 8px 14px;
  color: #0c1c2e;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

.quick-pill:hover {
  transform: translateY(-2px);
  border-color: #0c1c2e;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.hero-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 12px;
  margin-bottom: 4px;
}

.spotlight-card {
  position: relative;
  border-radius: 18px;
  padding: 18px;
  overflow: hidden;
  border: 1px solid #e6e9ef;
  min-height: 190px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

.spotlight-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  display: grid;
  place-items: center;
  border: 1px solid #e6e9ef;
}

.space-image {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.spotlight-body h3 {
  margin: 4px 0;
  font-size: 18px;
  color: #0c1c2e;
}

.spotlight-eyebrow {
  margin: 0;
  font-size: 12px;
  color: #374151;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.spotlight-text {
  margin: 0;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
}

.spotlight-link {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0c1c2e;
  font-weight: 700;
  text-decoration: none;
}

.spotlight-link:hover {
  color: #b00020;
}

.section {
  padding: 36px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.section-header h2 {
  margin: 2px 0 6px;
  font-size: 24px;
  color: #0c1c2e;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
  color: #6b7280;
  font-weight: 700;
}

.muted {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: #0c1c2e;
  font-weight: 700;
}

.section-link:hover {
  color: #b00020;
}

.chip-rail {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  padding: 10px 14px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e6e9ef;
  color: #0c1c2e;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.15s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}

.chip:hover {
  transform: translateY(-2px);
  border-color: #0c1c2e;
}

.sanitary-section {
  padding-bottom: 48px;
}

.pill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.pill-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #e6e9ef;
  border-radius: 12px;
  text-decoration: none;
  color: #0c1c2e;
  font-weight: 600;
  transition: all 0.15s ease;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.05);
}

.pill-card:hover {
  transform: translateY(-2px);
  border-color: #0c1c2e;
}

.pill-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #0c1c2e;
  flex-shrink: 0;
}

.pill-text {
  flex: 1;
}

@media (max-width: 992px) {
  .hero-content {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 32px 0 24px;
  }

  .logo-wrapper {
    width: 64px;
    height: 64px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-showcase {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .hero-showcase {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
