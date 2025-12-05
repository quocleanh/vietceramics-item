<template>
    <header v-if="!isHomePage" class="bg-danger">
        <div class="container">
            <!-- Desktop Layout -->
            <nav class="d-none d-md-flex row align-items-center py-2">
                <!-- Logo bên trái - col-2 -->
                <div class="col-3">
                    <router-link class="navbar-brand" to="/">
                        <img src="@/assets/images/logo-footer.png"
                            alt="Vietceramics" height="50">
                    </router-link>
                </div>

                <!-- Thanh tìm kiếm ở giữa - col-8 -->
                <div class="col-6">
                    <div class="search-box position-relative">
                        <div class="input-group">
                            <input type="text" 
                                class="form-control rounded-start-pill" 
                                placeholder="Nhập mã sản phẩm..."
                                v-model="searchQuery" 
                                @input="handleSearch">
                            <button class="btn btn-outline-light rounded-end-pill search-icon-btn" type="button">
                                <i class="fi fi-br-search"></i>
                            </button>
                        </div>

                        <!-- Search Results -->
                        <div class="search-results" v-if="showResults || isSearching">
                            <div class="search-header d-flex justify-content-between align-items-center p-2">
                                <span class="search-title">Kết quả tìm kiếm</span>
                                <button class="btn-close" @click="closeSearch">
                                    <i class="fi fi-br-cross"></i>
                                </button>
                            </div>
                            <div v-if="isSearching" class="search-loading">
                                <div class="spinner"></div>
                                <span>Đang tìm kiếm...</span>
                            </div>
                            <div v-else-if="searchResults.length === 0" class="no-results">
                                Không tìm thấy kết quả
                            </div>
                            <div v-else v-for="item in searchResults" :key="item.id" class="search-item">
                                <div class="d-flex">
                                    <div class="search-thumb-wrapper">
                                        <img :src="item.thumbnail" class="search-thumb" :alt="item.name" 
                                            @error="$event.target.src='https://placehold.co/100x100?text=vietceramics'" />
                                    </div>
                                    <div class="search-item-content">
                                        <router-link :to="'/san-pham/' + item.id" class="product-name" @click="closeSearch">
                                            {{ item.name }} - {{ item.itemCode }}
                                        </router-link>
                                        <div class="collection-name">
                                            {{ item.collectionName }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Login bên phải - col-3 -->
                <div class="col-md-3 d-flex justify-content-end">
                    <div class="header-buttons">
                        <router-link class="btn btn-outline-light me-2" to="/quote-list">
                            <i class="fi fi-br-file-invoice me-2"></i> Báo giá
                        </router-link>
                        <router-link to="/login" class="btn-login" v-if="!userData">
                            <i class="fi fi-br-user"></i>
                            <span>Đăng nhập</span>
                        </router-link>
                        <div class="user-menu" v-else>
                            <button class="btn-user" @click="toggleMenu">
                                <i class="fi fi-br-user"></i>
                                <span class="d-none d-md-inline">{{ userData.name || userData.username }}</span>
                            </button>
                            <!-- Desktop Dropdown Menu -->
                            <div class="dropdown-menu" v-if="isMenuOpen">
                                <router-link class="dropdown-item" to="/profile" @click="closeMenu">
                                    <i class="fi fi-br-user"></i>
                                    <span>Thông tin cá nhân</span>
                                </router-link>
                                <router-link class="dropdown-item" to="/orders" @click="closeMenu">
                                    <i class="fi fi-br-shopping-cart"></i>
                                    <span>Đơn hàng</span>
                    </router-link>
                                <button class="dropdown-item logout-btn" @click="handleLogout">
                                    <i class="fi fi-br-sign-out"></i>
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Mobile Layout -->
            <nav class="d-flex d-md-none align-items-center py-2">
                <!-- Nút search bên trái -->
                <div class="col-2">
                    <button class="btn btn-outline-light search-toggle-btn" @click="toggleSearch">
                        <i class="fi fi-br-search"></i>
                    </button>
                </div>

                <!-- Logo ở giữa -->
                <div class="col-7 text-center">
                    <router-link class="navbar-brand" to="/">
                        <img src="@/assets/images/logo-footer.png"
                            alt="Vietceramics" height="40">
                    </router-link>
                </div>

                <!-- Login và báo giá bên phải -->
                <div class="col-3 text-end d-flex justify-content-end gap-2">
                    <router-link class="btn btn-outline-light" to="/quote-list">
                        <i class="fi fi-br-file-invoice"></i>
                    </router-link>
                    <router-link to="/login" class="btn btn-outline-light" v-if="!userData">
                        <i class="fi fi-br-user"></i>
                    </router-link>
                    <div class="user-menu" v-else>
                        <button class="btn-user" @click="toggleMenu">
                            <i class="fi fi-br-user"></i>
                        </button>
                        <!-- Mobile Menu -->
                        <div class="mobile-menu" v-if="isMenuOpen">
                            <div class="mobile-menu-header">
                                <div class="user-info">
                                    <i class="fi fi-br-user"></i>
                                    <span>{{ userData.name || userData.username }}</span>
                                </div>
                                <button class="close-btn" @click="closeMenu">
                                    <i class="fi fi-br-cross"></i>
                                </button>
                            </div>
                            <div class="mobile-menu-content">
                                <router-link class="mobile-menu-item" to="/profile" @click="closeMenu">
                                    <i class="fi fi-br-user"></i>
                                    <span>Thông tin cá nhân</span>
                                </router-link>
                                <router-link class="mobile-menu-item" to="/orders" @click="closeMenu">
                                    <i class="fi fi-br-shopping-cart"></i>
                                    <span>Đơn hàng</span>
                                </router-link>
                                <button class="mobile-menu-item logout-btn" @click="handleLogout">
                                    <i class="fi fi-br-sign-out"></i>
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        </div>
                        <div class="menu-overlay" v-if="isMenuOpen" @click="closeMenu"></div>
                    </div>
                </div>
            </nav>

            <!-- Mobile Search Box (ẩn/hiện) -->
            <div v-if="showMobileSearch" class="d-md-none mobile-search-box mt-2 pb-3">
                <div class="input-group">
                    <input type="text" 
                        class="form-control rounded-start-pill" 
                        placeholder="Nhập mã sản phẩm..."
                        v-model="searchQuery" 
                        @input="handleSearch">
                    <button class="btn btn-outline-light rounded-end-pill search-icon-btn" type="button">
                        <i class="fi fi-br-search"></i>
                    </button>
                </div>

                <!-- Search Results -->
                <div class="search-results" v-if="showResults || isSearching">
                    <div class="search-header d-flex justify-content-between align-items-center p-2">
                        <span class="search-title">Kết quả tìm kiếm</span>
                        <button class="btn-close" @click="closeSearch">
                            <i class="fi fi-br-cross"></i>
                        </button>
                    </div>
                    <div v-if="isSearching" class="search-loading">
                        <div class="spinner"></div>
                        <span>Đang tìm kiếm...</span>
                    </div>
                    <div v-else-if="searchResults.length === 0" class="no-results">
                        Không tìm thấy kết quả
                    </div>
                    <div v-else v-for="item in searchResults" :key="item.id" class="search-item">
                        <div class="d-flex">
                            <div class="search-thumb-wrapper">
                                <img :src="item.thumbnail" class="search-thumb" :alt="item.name" 
                                    @error="$event.target.src='https://placehold.co/100x100?text=vietceramics'" />
                            </div>
                            <div class="search-item-content">
                                <router-link :to="'/san-pham/' + item.id" class="product-name" @click="closeSearch">
                                    {{ item.name }} - {{ item.itemCode }}
                                </router-link>
                                <div class="collection-name">
                                    {{ item.collectionName }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search Overlay -->
            <div v-if="showResults || isSearching" class="search-overlay" @click="closeSearch"></div>
        </div>
    </header>

</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const apiBaseUrl = 'https://api.vietceramics.com/api'
const cdnBaseUrl = (import.meta.env.VITE_CDN_BASE_URL || 'http://toppstiles.com.vn/products-test/').trim()

// State
const isMenuOpen = ref(false)
const userData = ref(null)
const searchQuery = ref('')
const searchResults = ref([])
const showResults = ref(false)
const isSearching = ref(false)
const showMobileSearch = ref(false)

// Computed
const isHomePage = computed(() => route.name === 'home')

// Methods
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
    isMenuOpen.value = false
}

const checkLoginStatus = () => {
    const user = localStorage.getItem('user')
    if (user) {
        try {
            const parsedUser = JSON.parse(user)
            if (new Date(parsedUser.expiresAt) > new Date()) {
                userData.value = parsedUser
            } else {
                handleLogout()
            }
        } catch (e) {
            console.error('Error parsing user data:', e)
            handleLogout()
        }
    } else {
        userData.value = null
    }
}

const handleLogout = () => {
    localStorage.removeItem('user')
    userData.value = null
    isMenuOpen.value = false
    
    toast.success('Đăng xuất thành công!', {
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

    router.push('/')
}

const handleUserLogin = (event) => {
    if (event && event.detail) {
        userData.value = event.detail
        isMenuOpen.value = false
    }
}

const handleSearch = debounce(async () => {
    try {
        const keyword = searchQuery.value.trim()
        if (!keyword.length) {
            searchResults.value = []
            showResults.value = false
            return
        }

        isSearching.value = true
        const response = await axios.get(`${apiBaseUrl}/Products/Search`, {
            params: {
                keyword,
                pageIndex: 1,
                pageSize: 10
            }
        })
        
        // Check if response.data.data is an array
        const items = Array.isArray(response.data?.data) ? response.data.data : []
        if (items.length > 0) {
            // Transform API response to our format
            searchResults.value = items.slice(0, 10).map(item => {
                const productId = item.product_code || item.id
                return {
                    id: productId,
                    itemCode: productId,
                    name: item.product_name || productId || 'Sản phẩm',
                    collectionName: item.custom_field121 || item.product_category || item.custom_field68 || 'Chưa phân loại',
                    thumbnail: item.avatar || `${cdnBaseUrl}hinh-gach/${productId}.jpg`
                }
            })
            console.log('Transformed results:', searchResults.value)
        } else {
            searchResults.value = []
        }
        showResults.value = true
    } catch (error) {
        console.error('Search error:', error)
        searchResults.value = []
        showResults.value = true
    } finally {
        isSearching.value = false
    }
}, 300)

const toggleSearch = () => {
    showMobileSearch.value = !showMobileSearch.value
}

const closeSearch = () => {
    showResults.value = false;
    searchQuery.value = '';
    searchResults.value = [];
}

// Debounce function
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Lifecycle hooks
onMounted(() => {
    checkLoginStatus()
    window.addEventListener('user-logged-in', handleUserLogin)
})

onUnmounted(() => {
    window.removeEventListener('user-logged-in', handleUserLogin)
})

</script>

<style scoped>
header {
    background-color: #971b1e !important;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

/* Add padding to body to prevent content from being hidden under fixed header */
body {
    padding-top: 60px;
}

@media (max-width: 768px) {
    body {
        padding-top: 50px;
    }
}

.search-box {
    max-width: 600px;
    margin: 0 auto;
}

.search-box .form-control {
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
}

.search-box .form-control::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.search-box .form-control:focus {
    background-color: rgba(255, 255, 255, 0.15);
    color: white;
    box-shadow: none;
    border-color: rgba(255, 255, 255, 0.3);
}

.search-icon-btn {
    border-color: rgba(255, 255, 255, 0.2);
    color: white;
}

.search-icon-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
}

.btn-outline-light {
    border-color: rgba(255, 255, 255, 0.2);
}

.btn-outline-light:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
}

/* Search Results Styling */
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Mobile specific styles */
@media (max-width: 768px) {
    header {
        padding: 0.5rem 0;
    }

    .container {
        padding: 0 1rem;
    }

    /* Mobile Layout */
    nav.d-flex {
        padding: 0.5rem 0;
    }

    /* Logo */
    .navbar-brand img {
        height: 35px;
    }

    /* Search */
    .search-toggle-btn {
        padding: 0.375rem;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .mobile-search-box {
        padding: 0.5rem 0;
    }

    .mobile-search-box .form-control {
        height: 40px;
        font-size: 14px;
    }

    .mobile-search-box .search-icon-btn {
        height: 40px;
        width: 40px;
    }

    /* Buttons */
    .btn-outline-light {
        padding: 0.375rem;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn-outline-light i {
        margin: 0 !important;
        font-size: 1rem;
    }

    /* User Menu */
    .btn-user {
        padding: 0.375rem;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        justify-content: center;
        background: transparent;
        border: none;
        color: white;
    }

    .btn-user:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    /* Mobile Menu */
    .mobile-menu {
        max-height: 70vh;
    }

    .mobile-menu-header {
        padding: 0.75rem 1rem;
    }

    .user-info {
        font-size: 1rem;
    }

    .close-btn {
        padding: 0.375rem;
    }

    .mobile-menu-content {
        padding: 0.5rem;
    }

    .mobile-menu-item {
        padding: 0.75rem 1rem;
        font-size: 0.95rem;
    }

    .mobile-menu-item i {
        width: 24px;
        font-size: 1.1rem;
    }

    /* Search Results */
    .search-results {
        max-height: 60vh;
    }

    .search-item {
        padding: 0.5rem 0.75rem;
    }

    .search-thumb-wrapper {
        width: 50px;
        height: 50px;
    }

    .product-name {
        font-size: 0.9rem;
    }

    .collection-name {
        font-size: 0.8rem;
    }

    /* Adjust spacing */
    .col-2, .col-3, .col-7 {
        padding: 0 0.25rem;
    }

    .gap-2 {
        gap: 0.25rem;
    }

    /* Hide desktop elements */
    .d-none {
        display: none !important;
    }

    /* Show mobile elements */
    .d-md-none {
        display: flex !important;
    }
}

/* Small mobile devices */
@media (max-width: 576px) {
    .container {
        padding: 0 0.75rem;
    }

    .navbar-brand img {
        height: 30px;
    }

    .btn-outline-light,
    .btn-user,
    .search-toggle-btn {
        width: 35px;
        height: 35px;
    }

    .mobile-menu-item {
        padding: 0.625rem 0.75rem;
        font-size: 0.9rem;
    }

    .search-results {
        max-height: 50vh;
    }
}

.search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
    pointer-events: none;
}

.search-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    position: sticky;
    top: 0;
    z-index: 1;
}

.search-title {
    font-size: 0.9rem;
    font-weight: 500;
    color: #495057;
}

.btn-close {
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    color: #6c757d;
    font-size: 0.9rem;
}

.btn-close:hover {
    color: #495057;
}

.search-results {
    position: fixed;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 4px 6px rgba(32, 33, 36, 0.2);
    z-index: 1000;
    max-height: 80vh;
    width: 90%;
    max-width: 600px;
    overflow-y: auto;
    margin-top: 0.5rem;
    scrollbar-width: thin;
    scrollbar-color: #909090 #f1f1f1;
}

.mobile-search-box .search-results {
    position: fixed;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    max-height: 50vh;
    border-radius: 12px 12px 0 0;
    margin-top: 0;
    width: 100%;
    max-width: 100%;
    transform: none;
}

/* Desktop specific styles */
@media (min-width: 768px) {
    .search-overlay {
        top: 60px; /* Height of the header */
    }

    .search-results {
        top: 60px; /* Height of the header */
    }
}

/* Mobile specific styles */
@media (max-width: 768px) {
    .search-overlay {
        top: 50px; /* Height of the mobile header */
    }

    .search-results {
        top: 50px; /* Height of the mobile header */
    }
}

.discount-badge {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #dc3545;
    color: white;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0 0 0 0.5rem;
    z-index: 1;
}

.discount-price {
    color: #dc3545;
    font-weight: 600;
}

.original-price {
    text-decoration: line-through;
    color: #6c757d;
    font-size: 0.9rem;
    margin-left: 0.5rem;
}

.price-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .discount-badge {
        font-size: 0.7rem;
        padding: 0.2rem 0.4rem;
    }

    .discount-price {
        font-size: 0.9rem;
    }

    .original-price {
        font-size: 0.8rem;
    }
}

.header-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: nowrap;
}

.btn-login {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #971b1e;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
}

.btn-login:hover {
    background: #7a1618;
    transform: translateY(-1px);
}

.user-menu {
    position: relative;
    display: inline-block;
}

.btn-user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #971b1e;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-user:hover {
    background: #7a1618;
    transform: translateY(-1px);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    min-width: 200px;
    z-index: 1000;
    margin-top: 0.5rem;
    display: block !important;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    width: 100%;
    background: none;
    border: none;
    color: #666;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    border-radius: 4px;
}

.dropdown-item:hover {
    background: #f8f9fa;
    color: #971b1e;
}

.dropdown-item i {
    width: 20px;
    text-align: center;
}

.logout-btn {
    color: #dc3545;
}

.logout-btn:hover {
    background: #f8f9fa;
    color: #dc3545;
}

/* Mobile Menu */
.mobile-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-radius: 12px 12px 0 0;
    z-index: 1001;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideUp 0.2s ease;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
}

.mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #f1f3f4;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #333;
    font-weight: 500;
}

.close-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
}

.mobile-menu-content {
    padding: 0.5rem;
}

.mobile-menu-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    width: 100%;
    background: none;
    border: none;
    color: #666;
    font-size: 1rem;
    cursor: pointer;
    text-decoration: none;
    border-radius: 8px;
}

.mobile-menu-item:hover {
    background: #f8f9fa;
    color: #971b1e;
}

.menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    backdrop-filter: blur(2px);
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .btn-user {
        padding: 0.375rem;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        justify-content: center;
        background: transparent;
        border: none;
        color: white;
    }

    .btn-user:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .dropdown-menu {
        display: none !important;
    }
}

@media (min-width: 769px) {
    .mobile-menu {
        display: none !important;
    }
    
    .menu-overlay {
        display: none !important;
    }
}

/* Desktop Layout */
.header-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: nowrap;
}

.btn-outline-light {
    white-space: nowrap;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .header-buttons {
        gap: 0.25rem;
    }

    .btn-outline-light {
        padding: 0.5rem 0.5rem;
        font-size: 0.85rem;
    }

    .btn-outline-light i {
        margin-right: 0.25rem !important;
    }
}

@media (max-width: 768px) {
    /* ... existing mobile styles ... */
}
</style>
