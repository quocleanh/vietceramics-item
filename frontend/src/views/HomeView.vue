<template>
  <div class="home">
    <!-- Hero section với logo và search -->
    <div class="hero-section d-flex align-items-center mt-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-9 text-center">
            <!-- Logo -->
            <div class="logo-wrapper mb-1">
              <img src="https://file.hstatic.net/200000095849/file/logo1_d8e1f1e6412b479384fe672d8f1fd97f.jpg"
                alt="Vietceramics" class="logo">
            </div>

            <!-- Search Box -->
            <div class="search-box position-relative">
              <div class="search-input-wrapper">
                <i class="fi fi-br-search search-icon"></i>
                <input type="text" class="form-control search-input" placeholder="Nhập mã sản phẩm..."
                  v-model="searchQuery" @input="handleSearch" />
              </div>

              <!-- Search Results -->
              <div class="search-results" v-if="showResults || isSearching">
                <div v-if="isSearching" class="search-loading">
                  <div class="spinner"></div>
                  <span>Đang tìm kiếm...</span>
                </div>
                <div v-else-if="searchResults.length === 0" class="no-results">
                  Không tìm thấy kết quả
                </div>
                <div v-else class="search-items">
                  <div v-for="item in searchResults" :key="item.id" class="search-item">
                    <div class="d-flex align-items-center">
                      <div class="search-thumb-wrapper">
                        <img :src="item.thumbnail" class="search-thumb" :alt="item.name"
                          @error="$event.target.src = 'https://via.placeholder.com/60x60?text=No+Image'" />
                      </div>
                      <div class="search-item-content">
                        <router-link :to="'/san-pham/' + item.id" class="product-name">
                          {{ item.name }}
                        </router-link>
                        <div class="collection-name">
                          {{ item.collectionName }}
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
          </div>
        </div>
      </div>
    </div>

    <!-- Phân loại theo không gian -->
    <div class="spaces-section py-5 align-items-center">
      <div class="container">
        <div class="spaces-grid">
          <div class="space-item" v-for="space in spaces" :key="space.id">
            <router-link :to="'/danh-muc?space=' + space.id" class="space-card text-center">
              <div class="space-icon mb-2">
                <img :src="space.image" :alt="space.name" class="space-image">
              </div>
              <h3 class="space-title">{{ space.name }}</h3>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Kích thước phổ biến -->
    <div class="sizes-section pb-5 pt-2">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="size-tags d-flex flex-wrap justify-content-center gap-2">
              <router-link v-for="size in sizes" :key="size.id" :to="'/danh-muc?size=' + size.id"
                class="btn btn-outline-dark rounded-pill">
                {{ size.name }}
              </router-link>
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
  name: 'HomeView',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      showResults: false,
      isSearching: false,
      spaces: [
        {
          id: 'pn',
          name: 'Phòng ngủ',
          icon: 'fa-solid fa-bed',
          image: 'https://cdn-icons-gif.flaticon.com/8996/8996751.gif'
        },
        {
          id: 'pk',
          name: 'Phòng khách',
          icon: 'fa-solid fa-couch',
          image: 'https://cdn-icons-gif.flaticon.com/16677/16677972.gif'
        },
        {
          id: 'pt',
          name: 'Phòng tắm',
          icon: 'fa-solid fa-bath',
          image: 'https://cdn-icons-gif.flaticon.com/17695/17695859.gif'
        },
        {
          id: 'pb',
          name: 'Nhà bếp',
          icon: 'fa-solid fa-kitchen-set',
          image: 'https://cdn-icons-gif.flaticon.com/8761/8761661.gif'
        },
        {
          id: 'nt',
          name: 'Ngoài trời',
          icon: 'fa-solid fa-sun',
          image: 'https://cdn-icons-gif.flaticon.com/13708/13708021.gif'
        },
        {
          id: 'tbvs',
          name: 'Thiêt bị vệ sinh phòng tắm',
          icon: 'fa-solid fa-briefcase',
          image: 'https://cdn-icons-gif.flaticon.com/9576/9576158.gif'
        }
        ,
        {
          id: 'kh',
          name: 'Khác',
          icon: 'fa-solid fa-briefcase',
          image: 'https://cdn-icons-gif.flaticon.com/16046/16046415.gif'
        }
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
      ]
    }
  },
  methods: {
    debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },
    async handleSearch() {
      try {
        if (this.searchQuery.length > 0) {
          this.isSearching = true
          console.log('Searching for:', this.searchQuery)
          const response = await axios.post('/api/Init/SuggestByCode', {
            keyword: this.searchQuery
          })
          
          console.log('Search response:', response.data)
          // Check if response.data is an array
          const items = Array.isArray(response.data) ? response.data : []
          if (items.length > 0) {
            // Transform API response to our format
            this.searchResults = items.slice(0, 10).map(item => ({
              id: item.No_,
              itemCode: item.No_,
              name: item.Name || 'Gạch ' + item.No_,
              collectionName: item.Class || 'Chưa phân loại',
              thumbnail: `http://toppstiles.com.vn/products-test/hinh-gach/${item.No_}.jpg`
            }))
            console.log('Transformed results:', this.searchResults)
          } else {
            this.searchResults = []
          }
          this.showResults = true
        } else {
          this.searchResults = []
          this.showResults = false
        }
      } catch (error) {
        console.error('Search error:', error)
        this.searchResults = []
        this.showResults = true
      } finally {
        this.isSearching = false
      }
    }
  },
  created() {
    // Debounce the search handler
    this.handleSearch = this.debounce(this.handleSearch, 300)
  }
}
</script>

<style scoped>
.hero-section {
  background-color: white;
  display: flex;
  align-items: center;
  padding-top: 2rem;
}

.logo {
  max-height: 70px;
  width: auto;
  margin-bottom: 1.5rem;
}

.search-box {
  max-width: 895px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  height: 55px;
  padding-left: 50px;
  padding-right: 20px;
  border-radius: 23px;
  font-size: 16px;
  background: #000000;
  color: #ffffff;
}

.search-input:hover {
  background: #000000;
  color: #ffffff;
}

.search-input:focus {
  background: #000000;
  color: #ffffff;
}


.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #ffffff;
  font-size: 16px;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(32, 33, 36, 0.2);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 0.5rem;
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

.search-results::-webkit-scrollbar-thumb:hover {
  background: #606060;
}

.search-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f3f4;
  transition: background-color 0.2s;
}

.search-item-icon {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: auto;
}

.search-item:last-child {
  border-bottom: none;
}

.search-item:hover {
  background-color: #f8f9fa;
}

.search-thumb-wrapper {
  width: 60px;
  height: 60px;
  margin-right: 1rem;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.search-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-item-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-wrap: nowrap;
  align-content: flex-start;
  align-items: flex-start;
}

.product-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #202124;
  text-decoration: none;
  line-height: 1.3;
}

.product-name:hover {
  color: #000;
  text-decoration: underline;
}

.collection-name {
  font-size: 0.85rem;
  color: #5f6368;
}

.collection-name:hover {
  color: #202124;
  text-decoration: underline;
}

/* Space cards styling */
.spaces-section {
  padding: 2rem 0;
  margin: 0 auto;
  max-width: 1200px;
}

.spaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.5rem;
  padding: 0 1rem;
}

.space-item {
  display: flex;
  justify-content: center;
}

.space-card {
  background: white;
  padding: 0.65rem 0.4rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.2s ease;
  width: 110px;
  text-decoration: none;
  display: block;
}

.space-card:hover {
  transform: translateY(-3px);
}

.space-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.space-icon {
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 0.5rem !important;
}

.space-icon i {
  font-size: 24px;
}

.space-title {
  font-size: 0.75rem;
  margin: 0;
  color: #202124;
  font-weight: 500;
  line-height: 1.2;
}

/* Size tags styling */
.size-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
}

.size-tags .btn {
  padding: 6px 12px;
  font-size: 0.85rem;
  border: 1px solid #000;
  color: #000;
  background: transparent;
  transition: all 0.2s ease;
  min-width: 100px;
  align-items: center;
}

.size-tags .btn:hover {
  background-color: #000;
  color: #fff;
  transform: translateY(-2px);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #000;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: #000;
}

@media (max-width: 768px) {
  .hero-section {
    padding-top: 1rem;
  }

  .logo {
    max-height: 60px;
    margin-bottom: 1rem;
  }

  .spaces-section {
    padding: 1.5rem 0;
  }

  .spaces-grid {
    padding: 0 0.75rem;
  }

  .space-card {
    width: 95px;
    padding: 0.5rem 0.35rem;
  }

  .space-icon {
    width: 32px;
    height: 32px;
    margin-bottom: 0.4rem !important;
  }

  .space-image {
    width: 32px;
    height: 32px;
  }

  .space-title {
    font-size: 0.7rem;
  }

  .size-tags .btn {
    padding: 5px 10px;
    font-size: 0.75rem;
    min-width: 110px;
  }
}

@media (max-width: 576px) {
  .spaces-section {
    padding: 1rem 0;
  }

  .spaces-grid {
    padding: 0 0.5rem;
  }

  .space-card {
    width: 85px;
    padding: 0.4rem 0.3rem;
  }

  .space-icon {
    width: 28px;
    height: 28px;
  }

  .space-image {
    width: 28px;
    height: 28px;
  }

  .space-title {
    font-size: 0.65rem;
  }
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
</style>