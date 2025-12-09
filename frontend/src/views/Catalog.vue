<template>
  <div class="catalog">
    <div class="row g-0">
      <!-- Bộ lọc -->
      <div class="col-3 d-none d-xxl-block">
        <div class="filters-section">
          <div class="filters-header d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">Bộ lọc</h3>
            <button
              v-if="hasActiveFilters"
              type="button"
              class="reset-filter-btn"
              @click="clearAllFilters"
            >
              Xóa bộ lọc
            </button>
          </div>
          <div class="filter-group mb-4">
            <h4>Danh mục sản phẩm</h4>
            <div class="category-tabs">
              <button
                v-for="category in filters.categories"
                :key="category.id"
                type="button"
                class="category-tab"
                :class="{ active: activeCategoryId === category.id }"
                @click="setCategoryFilter(category.id)"
              >
                <div class="category-tab-image">
                  <img :src="category.image" :alt="category.name" loading="lazy">
                </div>
                <div class="category-tab-title">{{ category.name }}</div>
              </button>
            </div>
          </div>

          <div 
            class="filter-group mb-4 sub-category-panel" 
            v-if="displayedCategories.length"
          >
            <h5>Danh mục nổi bật</h5>
            <div class="sub-category-list">
              <button
                v-for="category in displayedCategories"
                :key="category.id"
                type="button"
                class="sub-category-pill"
                :class="{ 
                  active: selectedCategoryId === category.id,
                  'span-2': shouldSpanCategory(category.name)
                }"
                @click="selectCategory(category.id)"
              >
                {{ category.name }}
              </button>
              <button
                v-if="categoryHasMore"
                type="button"
                class="sub-category-more"
                @click="toggleFilterSection('categories')"
              >
                <i class="fi" :class="isCategoryExpanded ? 'fi-br-minus-small' : 'fi-br-plus-small'"></i>
                {{ isCategoryExpanded ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>
          </div>

          <div 
            class="filter-group mb-4 sub-category-panel" 
            v-if="isTileCategory && displayedCollections.length"
          >
            <h5>Bộ sưu tập nổi bật</h5>
            <div class="sub-category-list">
              <button
                v-for="child in displayedCollections"
                :key="child.id"
                type="button"
                class="sub-category-pill"
                :class="{ active: selectedCollectionId === child.id }"
                @click="selectSubCategory(child.id)"
              >
                {{ child.name }}
              </button>
              <button
                v-if="collectionHasMore"
                type="button"
                class="sub-category-more"
                @click="toggleFilterSection('collections')"
              >
                <i class="fi" :class="isCollectionExpanded ? 'fi-br-minus-small' : 'fi-br-plus-small'"></i>
                {{ isCollectionExpanded ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>
          </div>

          <div 
            class="filter-group mb-4 sub-category-panel" 
            v-if="displayedColors.length"
          >
            <h5>Bảng màu gợi ý</h5>
            <div class="filter-chip-list">
              <button
                v-for="color in displayedColors"
                :key="color.id"
                type="button"
                class="filter-chip color-chip"
                :class="{ active: selectedColorId === color.id }"
                @click="selectColor(color.id)"
              >
                <span class="color-swatch" :style="{ backgroundColor: color.swatch }"></span>
                <span>{{ color.name }}</span>
              </button>
              <button
                v-if="colorHasMore"
                type="button"
                class="sub-category-more"
                @click="toggleFilterSection('colors')"
              >
                <i class="fi" :class="isColorExpanded ? 'fi-br-minus-small' : 'fi-br-plus-small'"></i>
                {{ isColorExpanded ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>
          </div>

          <div 
            class="filter-group mb-4 sub-category-panel" 
            v-if="displayedSizes.length"
          >
            <h5>Kích thước phổ biến</h5>
            <div class="filter-chip-list">
              <button
                v-for="size in displayedSizes"
                :key="size.id"
                type="button"
                class="filter-chip size-chip"
                :class="{ active: selectedSizeId === size.id }"
                @click="selectSize(size.id)"
              >
                <span class="size-label">{{ size.name }}</span>
              </button>
              <button
                v-if="sizeHasMore"
                type="button"
                class="sub-category-more"
                @click="toggleFilterSection('sizes')"
              >
                <i class="fi" :class="isSizeExpanded ? 'fi-br-minus-small' : 'fi-br-plus-small'"></i>
                {{ isSizeExpanded ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>
          </div>

          <div class="filter-group mb-4 sub-category-panel price-filter-group">
            <h5>Khoảng giá (VND)</h5>
            <div class="price-inputs">
              <input type="number" class="form-control" placeholder="Từ" min="0" v-model="priceInputs.from">
              <span class="price-separator">-</span>
              <input type="number" class="form-control" placeholder="Đến" min="0" v-model="priceInputs.to">
              <button class="btn btn-outline-primary" @click="applyPriceFilter">Áp dụng</button>
            </div>
            <div class="form-check form-switch sale-toggle">
              <input class="form-check-input" type="checkbox" id="sale-only-toggle" v-model="saleOnly">
              <label class="form-check-label" for="sale-only-toggle">Chỉ hiển thị sản phẩm giảm giá</label>
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
              <div v-else>Hiển thị {{ totalRecords || products.length }} sản phẩm</div>
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
        <div v-else>
          <div v-if="products.length === 0" class="no-products-alert">
            <div class="no-products-icon">
              <i class="fi fi-br-search-alt"></i>
            </div>
            <h5>Chưa có sản phẩm phù hợp</h5>
            <p>Vui lòng điều chỉnh bộ lọc hoặc thử lại với lựa chọn khác.</p>
            <button class="reset-filter-btn" @click="clearAllFilters">Đặt lại bộ lọc</button>
          </div>
          <div v-else class="row g-3">
            <div v-for="product in sortedProducts" :key="product.itemCode || product.id" class="col-6 col-md-4 col-lg-3 col-xxl-3">
              <div class="card h-100">
                <div class="image-wrapper">
                  <span v-if="product.isSale" class="sale-badge">Sale</span>
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
                    <div class="image-skeleton-shimmer"></div>
                  </div>
                </div>
                <div class="card-body">
                  <h5 class="card-title">{{ product.name }}</h5>
                  <p class="card-text">Mã: {{ product.itemCode }}</p>
                  <div class="price-block">
                    <template v-if="product.priceSale !== null || product.priceBase !== null">
                      <span 
                        v-if="product.isSale && product.priceSale !== null" 
                        class="price-sale"
                      >
                        {{ formatPrice(product.priceSale) }}
                      </span>
                      <span 
                        v-if="product.priceBase !== null" 
                        :class="['price-base', { 'text-decoration-line-through': product.isSale && product.priceSale !== null }]"
                      >
                        {{ formatPrice(product.priceBase) }}
                      </span>
                    </template>
                    <span v-else class="price-contact">Liên hệ</span>
                  </div>
                  <router-link
                    class="btn btn-primary"
                    :to="{ name: 'product-detail', params: { id: product.itemCode || product.id } }"
                  >
                    Xem chi tiết
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Phân trang -->
        <nav class="mt-4" v-if="products.length">
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
          <div class="filters-header d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">Bộ lọc</h3>
            <button
              v-if="hasActiveFilters"
              type="button"
              class="reset-filter-btn"
              @click="clearAllFilters"
            >
              Xóa bộ lọc
            </button>
          </div>

          <!-- (Removed) Loại sản phẩm - simplified to categories only -->

          <div class="filter-group mb-4">
            <h4>Danh mục sản phẩm</h4>
            <div class="category-tabs">
              <button
                v-for="category in filters.categories"
                :key="category.id"
                type="button"
                class="category-tab"
                :class="{ active: activeCategoryId === category.id }"
                @click="setCategoryFilter(category.id)"
              >
                <div class="category-tab-image">
                  <img :src="category.image" :alt="category.name" loading="lazy">
                </div>
                <div class="category-tab-title">{{ category.name }}</div>
              </button>
            </div>
          </div>

          <div 
            class="filter-group mb-4 sub-category-panel" 
            v-if="displayedCategories.length"
          >
            <h5>Danh mục nổi bật</h5>
            <div class="sub-category-list">
              <button
                v-for="category in displayedCategories"
                :key="category.id"
                type="button"
                class="sub-category-pill"
                :class="{ 
                  active: selectedCategoryId === category.id,
                  'span-2': shouldSpanCategory(category.name)
                }"
                @click="selectCategory(category.id)"
              >
                {{ category.name }}
              </button>
              <button
                v-if="categoryHasMore"
                type="button"
                class="sub-category-more"
                @click="toggleFilterSection('categories')"
              >
                <i class="fi" :class="isCategoryExpanded ? 'fi-br-minus-small' : 'fi-br-plus-small'"></i>
                {{ isCategoryExpanded ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>
          </div>

          <div 
            class="filter-group mb-4 sub-category-panel" 
            v-if="isTileCategory && displayedCollections.length"
          >
            <h5>Bộ sưu tập nổi bật</h5>
            <div class="sub-category-list">
              <button
                v-for="child in displayedCollections"
                :key="child.id"
                type="button"
                class="sub-category-pill"
                :class="{ active: selectedCollectionId === child.id }"
                @click="selectSubCategory(child.id)"
              >
                {{ child.name }}
              </button>
              <button
                v-if="collectionHasMore"
                type="button"
                class="sub-category-more"
                @click="toggleFilterSection('collections')"
              >
                <i class="fi" :class="isCollectionExpanded ? 'fi-br-minus-small' : 'fi-br-plus-small'"></i>
                {{ isCollectionExpanded ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>
          </div>

          <div 
            class="filter-group mb-4 sub-category-panel" 
            v-if="displayedColors.length"
          >
            <h5>Bảng màu gợi ý</h5>
            <div class="filter-chip-list">
              <button
                v-for="color in displayedColors"
                :key="color.id"
                type="button"
                class="filter-chip color-chip"
                :class="{ active: selectedColorId === color.id }"
                @click="selectColor(color.id)"
              >
                <span class="color-swatch" :style="{ backgroundColor: color.swatch }"></span>
                <span>{{ color.name }}</span>
              </button>
              <button
                v-if="colorHasMore"
                type="button"
                class="sub-category-more"
                @click="toggleFilterSection('colors')"
              >
                <i class="fi" :class="isColorExpanded ? 'fi-br-minus-small' : 'fi-br-plus-small'"></i>
                {{ isColorExpanded ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>
          </div>

          <div 
            class="filter-group mb-4 sub-category-panel" 
            v-if="displayedSizes.length"
          >
            <h5>Kích thước phổ biến</h5>
            <div class="filter-chip-list">
              <button
                v-for="size in displayedSizes"
                :key="size.id"
                type="button"
                class="filter-chip size-chip"
                :class="{ active: selectedSizeId === size.id }"
                @click="selectSize(size.id)"
              >
                <span class="size-label">{{ size.name }}</span>
              </button>
              <button
                v-if="sizeHasMore"
                type="button"
                class="sub-category-more"
                @click="toggleFilterSection('sizes')"
              >
                <i class="fi" :class="isSizeExpanded ? 'fi-br-minus-small' : 'fi-br-plus-small'"></i>
                {{ isSizeExpanded ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>
          </div>

          <div class="filter-group mb-4 sub-category-panel price-filter-group">
            <h5>Khoảng giá (VND)</h5>
            <div class="price-inputs">
              <input type="number" class="form-control" placeholder="Từ" min="0" v-model="priceInputs.from">
              <span class="price-separator">-</span>
              <input type="number" class="form-control" placeholder="Đến" min="0" v-model="priceInputs.to">
            </div>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <button class="btn btn-outline-primary flex-grow-1 me-2" @click="applyPriceFilter">Áp dụng</button>
              <div class="form-check form-switch sale-toggle m-0">
                <input class="form-check-input" type="checkbox" id="sale-only-toggle-mobile" v-model="saleOnly">
                <label class="form-check-label" for="sale-only-toggle-mobile">Sale</label>
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
import { updateSeoMeta } from '@/utils/seo'
import { productService } from '@/services/productService'

const rawColorData = `
Màu nâu nhạt
Màu đen vân đá,Light Gold
Màu vàng chanh
Màu xanh dương biển sâu
Trắng,Xám
Mạ vàng 24K
ĐEN,XÁM ĐẬM
Nikel xước
Cam
Màu xám
XANH ĐẬM
Màu xanh lam băng
màu nâu họa tiết vân gỗ + xanh cây thùa
màu gỗ Wenge
Màu xanh da trời
Mạ crôm
Trắng,Cam
Đen,Xám
Trắng kem
màu đồng cổ xưa
crôm,Xám
Sứ màu nâu hạnh nhân
Vàng trầm / đen mờ
Trắng,Màu hồng
màu lá vàng
Trắng,Hồng
Cam ,Đen mờ
Vàng,Xanh dương
Xám than chì vân gỗ
Màu đen tuyền
Màu chì
Màu lá bạc,Màu trắng thủy tinh
Xanh dương
Màu vàng mờ
KEM ĐẬM
Nhiều màu
Trắng
Brushed Chrome
Màu nâu
Sứ màu xám
Màu trắng thủy tinh,Light Gold
Mạ màu đen mờ
Màu đồng đỏ
màu đen kim loại (nhám)
Màu trắng bóng
màu sắt mờ
màu sắt xước, sắt bóng
Màu xanh Coral
Màu trắng hoa tuyết nhung
XÁM NHẠT
màu màu niken
Màu nâu mờ
Tên Màu Sắc
Màu vàng,Trắng
màu nâu gỉ sắt
Vàng đồng
crôm xước
Light Gold,Màu trắng thủy tinh
Màu niken xước mờ
Màu trắng thủy tinh
Vàng sáng
Màu nâu họa tiết vân gỗ + hồng phấn
crôm,Đen mờ
XANH DƯƠNG; XANH LÁ
Màu trắng chấm nhỏ
màu đồng thiếc ấm xước
Màu nhôm cổ xưa
XÁM ĐẬM
Xám than đá
Màu crôm,Màu trắng thủy tinh
Nâu hạt dẻ/trắng xám đá cẩm thạch,Sứ màu trắng
Đen,Trắng,Xám
Màu trắng vân đá,Light Gold
White Alpin
Màu đen mờ,Màu trắng thủy tinh
Đen,Vàng
Trắng mờ
Sứ nâu gỗ
màu đỏ san hô
Màu trắng mờ
Màu Lá Nhôm Cổ
Sứ màu hạnh nhân
Màu niken mịn/ Màu đen
,Đen,Trắng
Đen,Trắng
màu đồng đỏ xước
,Trắng
Màu xám sáng
Crôm
màu đồng thiếc ấm
Màu đen bóng thủy tinh
crôm,Chrome
Xám bóng
Vàng xước
NULL
Sứ màu kem
màu vàng đất
đồng đỏ xước
Vàng,Xanh lá
chrome matt
màu nâu họa tiết vân gỗ + vàng đất
Sứ màu trắng,Nâu hạt dẻ/trắng xám đá cẩm thạch
White Alpin CeramicPlus
Màu trắng vân đá
Màu trắng/Màu đồng đỏ
Màu trắng xám
Màu trắng vân đá,Màu trắng,Màu niken mịn
Màu đen huyền
màu vàng đồng
Trắng,Vàng,Xanh dương
Màu nâu đen
Xanh biển
Vàng
Trắng,Xanh lá,Tím
Màu Lá Nhôm Cổ,Màu đen huyền,Màu đen vân đá
Gray Pearl,crôm
Sứ đen gỗ mun
Trắng,Đỏ,Xanh dương
Màu trắng,Polished Nickel
Đỏ trầm
màu sắt xước
Màu xám đen
Màu hồng phấn
XANH NHẠT
Hồng phấn
Mạ niken xước mờ
Frost
Trắng,Vàng
màu trắng
Nâu,Màu trắng thủy tinh
Màu bạch kim
Màu trắng đục
Xanh dương,Trắng
Màu đen xước
ĐA SẮC
Trắng,Xanh lá
Vàng chanh
Mạ đen mờ
Màu xám kim loại
Đen,Đỏ,Trắng
Màu xanh hổ phách
ĐEN,KEM
màu đồng đỏ (PVD)
Mạ vàng 14K
Đỏ
NÂU ĐẬM
Màu xám đậm
Đen,màu đồng đỏ xước
HỒNG
American Walnut
Không phân loại
màu niken
Màu vàng nghệ
Màu đen
màu đen mờ / màu đen kim loại
Màu niken bóng
Màu xanh chi thùa
Sứ màu đen bóng
Màu trắng bóng,Màu đồng đỏ
Màu đen huyền,Đen,Nâu
Đen,Crôm
Màu thép không gỉ
Màu xanh lục rừng rậm
Màu xanh riêu
Màu vàng nhạt/Màu đen
Đen đậm
Màu trắng bóng,Màu crôm
Sứ siêu trắng
màu đen sơn tĩnh điện
KEM
,Đen,Vàng
màu đen sơn tĩnh điện / màu crôm
Màu vân gỗ đen
Màu xám bóng
Cam,Crôm
Đen
Màu đen huyền/Trắng sáng
màu kim lại đen xước
màu niken xước
Màu đồng xước
Trắng,màu đồng đỏ
Trắng,Xanh dương
,Trắng,Crôm
Xanh lá sẫm
Màu crôm mờ
Xám,Trắng
TÍM
Màu đồng
Màu trắng,Light Gold
Màu trắng bóng,Màu vàng
Màu xanh cổ vịt 
Đỏ rượu
Xanh da trời
NÂU
màu đen đá cẩm thạch Marquina
Màu đen vân đá,Màu crôm
,Trắng,Xanh dương
màu vàng đồng xước
Cam,Đen
Màu crôm,Màu trắng
Xanh lá
Màu nâu đỏ nhạt
Chrome
White Matt
Trắng,Tím
Màu niken/ Màu đen
Màu niken mịn
Trắng,Đỏ
Nâu sáng gỗ Elm
brushed stainless steel
niken xước
Trắng,màu đồng đỏ (PVD)
Vàng,crôm
Crôm,Hồng
màu khói (mờ)
Màu xanh dương đậm
Màu xám be
crôm,Trắng
Trắng,crôm
,Trắng,Đen
Màu đỏ đô
màu kim loại đen
Vàng nhạt
màu đá River Stone
Trắng,Xanh lá,Vàng
màu sắt bóng,Xám
Hồng be
Màu crôm
Đen mờ
Nâu sẫm vân gỗ
Màu crom
màu nâu họa tiết vân gỗ + đỏ san hô
Đen,Đỏ
Đen,Cam
Màu niken,Màu trắng
Bạc
màu sắt bóng
Sứ nâu hạnh nhân
Sứ màu trắng
Màu nâu đất 
Nâu gỗ nhạt
Xám
Mạ vàng 14K,Màu trắng
đồng thiếc ấm xước
Màu Crôm,Trắng
Màu xanh cây thùa
Màu trắng,Màu crôm
Màu trắng vân đá,Màu trắng,Light Gold
Màu đồng đỏ,Màu đen mờ
Màu đen/Màu đồng đỏ
màu kim loại đen xước
Màu trắng,Màu crôm,Màu trắng bóng
XANH LÁ NHẠT
màu trắng đá Calacatta
màu vàng xước
Đỏ,Đen
,Crôm
Màu kem chấm nhò,Màu trắng chấm nhỏ
màu đồng thiếc ấm)
Gray Pearl
Xanh xám
Màu vàng
Màu đồng đỏ/Màu đen
Màu crôm,Màu trắng/Màu đồng đỏ
Glass Glossy Black
Màu đen kim loại
Màu trắng bóng,Màu bạch kim
màu đồng thiếc giả cổ
Màu đồng tối
Màu đen huyền/Màu kem
Light Gold
0
KEM NHẠT
màu đồng đỏ (nhám)
Sứ trắng mờ
Màu đồng đỏ,Trắng
Màu crôm/Màu đen
Màu crôm,Vàng
Màu đen,Màu trắng thủy tinh
Vàng trầm
màu trắng sơn tĩnh điện
Trắng,Đen
màu gỗ đỏ
Màu đen mờ
Màu đồng kim loại
Màu niken đen
Màu nhôm bóng
NÂU NHẠT
Màu xanh lá
màu gỗ tếch (mờ)
Màu xám bê tông
Màu trắng,Màu Niken cổ xưa
Nâu hạt dẻ
`

const skipColorNames = new Set(['null', '0', 'tên màu sắc', 'không phân loại', ''])

const slugify = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-+/g, '-')
  .toLowerCase()

const normalizeProductTypeId = (value) => {
  if (!value) return null
  return value
    .toString()
    .trim()
    .toLowerCase()
}

const normalizeText = (text = '') => text
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()

const fallbackHashColor = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  return color
}

const clamp = (val, min = 0, max = 255) => Math.min(Math.max(val, min), max)

const adjustColor = (hex, percent = 0) => {
  if (!hex) return hex
  const normalized = hex.replace('#', '')
  const num = parseInt(normalized, 16)
  if (Number.isNaN(num)) return hex
  const amt = Math.round(2.55 * percent)
  const r = clamp((num >> 16) + amt)
  const g = clamp(((num >> 8) & 0x00ff) + amt)
  const b = clamp((num & 0x0000ff) + amt)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

const guessColorFromName = (label) => {
  if (!label) return fallbackHashColor(label)
  const normalized = normalizeText(label)
  const segments = normalized.split(/[,;+\/]/).map(part => part.trim()).filter(Boolean)
  const primary = segments[0] || normalized

  const resolveBaseColor = (text) => {
    if (!text) return null
    if (text.includes('den') || text.includes('black') || text.includes('huyen')) return '#1f1f1f'
    if (text.includes('trang') || text.includes('white') || text.includes('snow')) return '#f8f9fa'
    if (text.includes('xanh')) {
      if (text.includes('bien') || text.includes('duong') || text.includes('ocean') || text.includes('lam') || text.includes('troi')) {
        return '#1e88e5'
      }
      if (text.includes('la') || text.includes('leaf') || text.includes('cay') || text.includes('forest') || text.includes('nhom')) {
        return '#2ecc71'
      }
      if (text.includes('riu') || text.includes('rieu')) {
        return '#4c956c'
      }
      if (text.includes('co vit')) {
        return '#228b22'
      }
      return '#1abc9c'
    }
    if (text.includes('xam') || text.includes('ghi') || text.includes('cement') || text.includes('betong')) return '#7f8c8d'
    if (text.includes('vang 24k') || text.includes('24k') || text.includes('pvd')) return '#d4af37'
    if (text.includes('vang dong') || text.includes('dong') || text.includes('bronze') || text.includes('copper')) return '#b87333'
    if (text.includes('vang') || text.includes('gold')) return '#f2c94c'
    if (text.includes('cam') || text.includes('orange') || text.includes('amber')) return '#ffa94d'
    if (text.includes('hong') || text.includes('pink')) return '#f78fb3'
    if (text.includes('do') || text.includes('red')) return '#d63031'
    if (text.includes('tim') || text.includes('purple') || text.includes('violet')) return '#b39ddb'
    if (text.includes('nau') || text.includes('go') || text.includes('wood') || text.includes('teak') || text.includes('wenge')) return '#8d5524'
    if (text.includes('kem') || text.includes('be') || text.includes('ivory')) return '#f7e0c4'
    if (text.includes('bac kim') || text.includes('bach kim') || text.includes('platinum')) return '#e5e4e2'
    if (text.includes('bac') || text.includes('silver') || text.includes('chrome') || text.includes('crom') || text.includes('niken') || text.includes('nickel') || text.includes('inox') || text.includes('metal') || text.includes('kim loai')) return '#c0c0c0'
    if (text.includes('bong') && text.includes('glass')) return '#ececec'
    if (text.includes('crystal')) return '#dfe7fd'
    return null
  }

  const baseColor = resolveBaseColor(primary) || resolveBaseColor(normalized)

  let adjustment = 0
  if (normalized.includes('nhat') || normalized.includes('light') || normalized.includes('pastel') || normalized.includes('sang')) {
    adjustment += 20
  }
  if (normalized.includes('dam') || normalized.includes('dark') || normalized.includes('sau')) {
    adjustment -= 20
  }
  if (normalized.includes('mo') || normalized.includes('matte') || normalized.includes('matt')) {
    adjustment -= 5
  }
  if (normalized.includes('bong') || normalized.includes('gloss')) {
    adjustment += 5
  }

  const resultColor = baseColor || fallbackHashColor(label)
  return adjustment ? adjustColor(resultColor, adjustment) : resultColor
}

const buildSharedColors = () => {
  const entries = rawColorData.split('\n').map(item => item.trim()).filter(Boolean)
  const map = new Map()
  entries.forEach(name => {
    const normalized = name.trim()
    if (!normalized) return
    if (skipColorNames.has(normalized.toLowerCase())) return
    const id = slugify(normalized)
    if (!id || map.has(id)) return
    map.set(id, {
      id,
      name: normalized,
      swatch: guessColorFromName(normalized)
    })
  })
  return Array.from(map.values())
}

const sharedColorOptions = buildSharedColors()
const cloneSharedColors = () => sharedColorOptions.map(color => ({ ...color }))

const rawSizeData = `
40 x 80
16.5 x 16.5
16.3 x 51.7
90 x 90
90 X 180
7.5 x 30
120 x 278
50 x 120
10 x 30
30 x 60
100 x 100
80 x 160
45 x 90
75 X 150
60 x 60
30 x 30
80 x 80
11 x 54
100 x 200
120 x 120
20 x 20
30 x 120
6 x 24
120 x 280
60 x 120
15 x 90
20 x 120
`

const sharedSizes = rawSizeData
  .split('\n')
  .map(item => item.trim())
  .filter(Boolean)
  .map(label => ({
    id: label.toLowerCase(),
    name: label
  }))
const cloneSharedSizes = () => sharedSizes.map(size => ({ ...size }))

const rawFeaturedCategories = `
Gạch gốm ốp lát
Gạch cắt
Van vòi Lavabo đặt bàn 1 lỗ
Mặt nạ bộ trộn nước âm tường
Linh kiện
Lavabo đặt bàn
Thanh treo khăn
Van vòi lavabo gắn tường - phần lắp ngoài
Gạch men ốp tường
Giá treo giấy vệ sinh
Bát sen gắn tường
Các sản phẩm khác
Van vòi bồn tắm đặt sàn
Vòi xịt vệ sinh
Sen tay
Thanh trượt, gác sen, sen tay, dây, cục cấp nước
Bồn tắm thường - tự đứng
Móc treo
Van vòi Lavabo đặt bàn 3 lỗ
Bát sen gắn trần
Sen tắm gắn trần - bộ phận lắp ngoài
Bình đựng xà phòng
Lọ / cốc
Nắp bồn cầu thông thường
Van vòi bồn tắm gắn thành bồn
Ván sợi bằng gỗ
Nút nhấn két nước âm tường
Sen tắm hông
Phụ kiện vòi nước lavabo
Sen tay, dây sen, gác sen, cục cấp nước
Cục cấp nước cho sen tay
Khay đựng xà phòng
Thân bồn cầu treo tường
Gương
Vòng treo khăn
Bộ xả nhấn - lavabo có lổ xả tràn
Van vòi Lavabo gắn tường
Nẹp
Giá treo áo
Lavabo âm bàn
`

const featuredCategoryNames = rawFeaturedCategories
  .split('\n')
  .map(item => item.trim())
  .filter(name => name && name.toLowerCase() !== 'null')

const tileFeaturedNames = ['Gạch gốm ốp lát', 'Gạch cắt', 'Gạch men ốp tường']
const nonTileFeaturedNames = featuredCategoryNames.filter(name => !tileFeaturedNames.includes(name))
const toFeaturedOption = (name) => ({ id: name, name })
const cloneFeaturedCategories = (type) => {
  const source = type === 'gạch' ? tileFeaturedNames : nonTileFeaturedNames
  return source.map(toFeaturedOption)
}

const rawCollections = `
fVENTI20
GOCCIA
ACCESSORIES
Marble 2
ANELLO
RETTANGOLO ACCESSORIES
Origini
INMAGINE
MARBLE 1
EMPORIO SHOWER
RETTANGOLO K
RETTANGOLO
CONO
UNIVERSAL
EMPORIO
VIA MANZONI
MARBLE 4
RILIEVO
ARCHITECTURA
EMPORIO ACCESSORIES
ORIGIN
GOCCIA ACCESSORIES
Ricambi e accessori
RETTANGOLO SHOWER
CONO ACCESSORIES
GESSI 316
INGRANAGGIO
CONO SHOWER
COLOUR
SHOWER316
ELEGANZA ACCESSORIES
AFILO
ISPA
ELEGANZA
VI-CLEAN
ISPA ACCESSORIES
SHUI COMFORT
MIMI
ELEGANZA SHOWER
INCISO ACCESSORIES
JUNO
VIA TORTONA
CLASSIC
`

const sharedCollections = rawCollections
  .split('\n')
  .map(item => item.trim())
  .filter(Boolean)
  .map(name => ({ id: name, name }))
const cloneSharedCollections = () => sharedCollections.map(item => ({ ...item }))

export default {
  ///POST http://item.vietceramics.vn/vi/loc-san-pham?space=TBVS

  name: 'Catalog',
  data() {
    return {
      currentPage: 1,
      sortOption: 'newest',
      itemsPerPage: 12,
      filterPreviewLimit: 6,
      priceRange: [null, null],
      priceInputs: {
        from: '',
        to: ''
      },
      saleOnly: false,
      selectedFilters: {
        categories: ['gạch']
      },
      activeCategoryId: 'gạch',
      selectedCategoryId: null,
      selectedCollectionId: null,
      selectedColorId: null,
      selectedSizeId: null,
      totalRecords: 0,
      totalPagesFromApi: 1,
      expandedSections: {
        categories: [],
        collections: [],
        colors: [],
        sizes: []
      },
      showMobileFilter: false,
      updatingFromRoute: false,
      products: [],
      loading: false,
      imageLoaded: {},
      filters: {
        categories: [
          { 
            id: 'gạch', 
            name: 'Gạch',
            image: 'https://cdn-icons-gif.flaticon.com/10966/10966480.gif',
            categories: cloneFeaturedCategories('gạch'),
            collections: cloneSharedCollections(),
            colors: cloneSharedColors(),
            sizes: cloneSharedSizes()
          },
          { 
            id: 'thiết bị vệ sinh', 
            name: 'Thiết bị vệ sinh',
            image: 'https://cdn-icons-gif.flaticon.com/17091/17091858.gif',
            categories: cloneFeaturedCategories('thiết bị vệ sinh'),
            collections: [
              { id: 'flow', name: 'Flow' },
              { id: 'emporio shower', name: 'Emporio Shower' },
              { id: 'signature bath', name: 'Signature Bath' },
              { id: 'urban wellness', name: 'Urban Wellness' },
              { id: 'zen series', name: 'Zen Series' },
              { id: 'artisan bath', name: 'Artisan Bath' },
              { id: 'pure touch', name: 'Pure Touch' }
            ],
            colors: cloneSharedColors(),
            sizes: cloneSharedSizes()
          },
          { 
            id: 'sàn gỗ', 
            name: 'Sàn gỗ',
            image: 'https://cdn-icons-png.flaticon.com/128/5848/5848426.png',
            categories: cloneFeaturedCategories('sàn gỗ'),
            collections: [
              { id: 'signature wood', name: 'Signature Wood' },
              { id: 'coastal wood', name: 'Coastal Wood' },
              { id: 'herringbone studio', name: 'Herringbone Studio' },
              { id: 'nordic oak', name: 'Nordic Oak' },
              { id: 'urban rustic', name: 'Urban Rustic' },
              { id: 'heritage plank', name: 'Heritage Plank' },
              { id: 'eco deck', name: 'Eco Deck' }
            ],
            colors: cloneSharedColors(),
            sizes: cloneSharedSizes()
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
      return Math.max(1, this.totalPagesFromApi || 1)
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
    },
    activeCategory() {
      if (!this.filters?.categories?.length) return null
      const selectedId = this.activeCategoryId || this.selectedFilters.categories[0]
      return this.filters.categories.find(cat => cat.id === selectedId) || this.filters.categories[0]

    },
    displayedCategories() {
      if (!this.activeCategory?.categories) return []
      const list = this.activeCategory.categories
      return this.isSectionExpanded('categories')
        ? list
        : list.slice(0, this.filterPreviewLimit)
    },
    categoryHasMore() {
      return !!(this.activeCategory?.categories && this.activeCategory.categories.length > this.filterPreviewLimit)
    },
    isCategoryExpanded() {
      return this.isSectionExpanded('categories')
    },
    displayedCollections() {
      const list = this.activeCategory?.collections || []
      return this.isSectionExpanded('collections')
        ? list
        : list.slice(0, this.filterPreviewLimit)
    },
    collectionHasMore() {
      const list = this.activeCategory?.collections || []
      return list.length > this.filterPreviewLimit
    },
    isCollectionExpanded() {
      return this.isSectionExpanded('collections')
    },
    displayedColors() {
      const list = this.activeCategory?.colors || []
      return this.isSectionExpanded('colors')
        ? list
        : list.slice(0, this.filterPreviewLimit)
    },
    colorHasMore() {
      const list = this.activeCategory?.colors || []
      return list.length > this.filterPreviewLimit
    },
    isColorExpanded() {
      return this.isSectionExpanded('colors')
    },
    displayedSizes() {
      const list = this.activeCategory?.sizes || []
      return this.isSectionExpanded('sizes')
        ? list
        : list.slice(0, this.filterPreviewLimit)
    },
    sizeHasMore() {
      const list = this.activeCategory?.sizes || []
      return list.length > this.filterPreviewLimit
    },
    isSizeExpanded() {
      return this.isSectionExpanded('sizes')
    },
    isTileCategory() {
      return (this.activeCategory?.id || '').toLowerCase() === 'gạch'
    },
    hasActiveFilters() {
      const defaultProductType = this.selectedFilters.categories && this.selectedFilters.categories[0] === 'gạch'
      return !defaultProductType ||
        !!(
          this.selectedCategoryId ||
          this.selectedCollectionId ||
          this.selectedColorId ||
          this.selectedSizeId ||
          this.saleOnly ||
          (this.priceRange[0] != null) ||
          (this.priceRange[1] != null)
        )
    }
  },
  methods: {
    applyRouteState(query = {}) {
      this.updatingFromRoute = true
      const page = parseInt(query.page, 10)
      this.currentPage = Number.isNaN(page) || page < 1 ? 1 : page

      const allowedSorts = ['newest', 'name', 'popular']
      const sort = query.sort && allowedSorts.includes(query.sort) ? query.sort : 'newest'
      this.sortOption = sort

      let resolvedCategoryParam = query.category || null
      let routeProductType = normalizeProductTypeId(query.productType || null)
      if (!routeProductType && resolvedCategoryParam) {
        const isTopLevelCategory = this.filters.categories.some(cat => cat.id === resolvedCategoryParam)
        if (isTopLevelCategory) {
          routeProductType = normalizeProductTypeId(resolvedCategoryParam)
          resolvedCategoryParam = null
        }
      }
      routeProductType = routeProductType || this.selectedFilters.categories[0] || null
      if (routeProductType) {
        this.activeCategoryId = routeProductType
        if (this.selectedFilters.categories[0] !== routeProductType) {
          this.selectedFilters.categories = [routeProductType]
        }
      } else {
        this.activeCategoryId = null
        this.selectedFilters.categories = []
      }

      this.selectedCategoryId = resolvedCategoryParam
      this.selectedCollectionId = query.collection || null
      this.selectedColorId = query.color || null
      this.selectedSizeId = query.size || null

      const priceFrom = query.priceFrom !== undefined ? Number(query.priceFrom) : null
      const priceTo = query.priceTo !== undefined ? Number(query.priceTo) : null
      this.priceRange = [Number.isNaN(priceFrom) ? null : priceFrom, Number.isNaN(priceTo) ? null : priceTo]
      this.priceInputs = {
        from: this.priceRange[0] != null ? String(this.priceRange[0]) : '',
        to: this.priceRange[1] != null ? String(this.priceRange[1]) : ''
      }

      this.saleOnly = query.saleOnly === 'true' || query.saleOnly === '1'

      this.$nextTick(() => {
        this.updatingFromRoute = false
      })
    },
    updateRouteQuery(partialQuery = {}) {
      const nextQuery = { ...this.$route.query }

      Object.entries(partialQuery).forEach(([key, value]) => {
        const isDefaultPage = key === 'page' && (Number(value) || 1) === 1
        const isDefaultSort = key === 'sort' && (value === 'newest' || !value)
        const shouldRemove =
          value === undefined ||
          value === null ||
          value === '' ||
          isDefaultPage ||
          isDefaultSort

        if (shouldRemove) {
          delete nextQuery[key]
        } else {
          nextQuery[key] = String(value)
        }
      })

      this.$router.replace({ query: nextQuery }).catch(() => {})
    },
    async loadProducts() {
      this.loading = true
      this.products = []
      this.imageLoaded = {}

      try {
        const params = {
          pageIndex: this.currentPage,
          pageSize: this.itemsPerPage
        }

        const productType = this.selectedFilters.categories && this.selectedFilters.categories.length
          ? this.selectedFilters.categories[0]
          : null
        if (productType) {
          params.productType = productType
        }
        if (this.selectedCategoryId) {
          params.category = this.selectedCategoryId
        }
        if (this.selectedCollectionId) {
          params.collection = this.selectedCollectionId
        }
        if (this.selectedColorId) {
          params.color = this.selectedColorId
        }
        if (this.selectedSizeId) {
          params.size = this.selectedSizeId
        }
        if (this.priceRange[0] !== null && this.priceRange[0] !== undefined) {
          params.priceFrom = this.priceRange[0]
        }
        if (this.priceRange[1] !== null && this.priceRange[1] !== undefined) {
          params.priceTo = this.priceRange[1]
        }
        if (this.saleOnly) {
          params.isSale = true
        }

        const resp = await axios.get('https://api.vietceramics.com/api/Products/Search', {
          params
        })

        const items = resp.data?.data || resp.data?.ListItems || resp.data?.Items || resp.data || []

        const firstItem = items && items.length ? items[0] : null
        const totalRecords = resp.data?.totalRecords ?? firstItem?.total_records ?? 0
        const totalPages = resp.data?.totalPages ?? firstItem?.total_pages ?? Math.max(1, Math.ceil((totalRecords || 1) / this.itemsPerPage))
        this.totalRecords = totalRecords || (items.length ? (this.currentPage - 1) * this.itemsPerPage + items.length : 0)
        this.totalPagesFromApi = totalPages

        const normalizePrice = (value) => {
          if (value === null || value === undefined || value === '') return null
          const num = Number(value)
          return Number.isNaN(num) ? null : num
        }

        const productItems = (items || []).map(item => {
          const code = item.product_code || item.productCode || item.ProductCode || item.No_ || item.ItemCode || item.Code || item.code || item.id
          const name = item.product_name || item.productName || item.ProductName || item.Name || item.name || item.Title || ''
          const productId = item.id || code || Math.random().toString(36).slice(2, 9)
          this.imageLoaded[productId] = false

          const imageUrl = item.avatar || item.custom_field143 || (code ? `http://toppstiles.com.vn/products-test/hinh-gach/${code}.jpg` : '')
          const priceBase = normalizePrice(item.price_base ?? item.priceBase ?? item.unit_price ?? item.price_sale)
          const priceSale = normalizePrice(item.price_sale ?? item.priceSale)
          const isSaleFlag = item.is_sale === true || item.is_sale === 1 || item.is_sale === '1' || item.is_sale === 'true'

          return {
            id: productId,
            name,
            itemCode: code || '',
            image: imageUrl,
            priceBase,
            priceSale,
            isSale: Boolean(isSaleFlag),
            category: item.product_category || '',
            collectionName: item.custom_field121 || '',
            colorName: item.custom_field90 || item.custom_field149 || '',
            sizeName: item.custom_field141 || item.custom_field104 || '',
            description: item.description || item.sale_description || ''
          }
        })

        this.products = productItems
      } catch (error) {
        console.error('Error loading products:', error)
        this.products = []
        this.totalRecords = 0
        this.totalPagesFromApi = 1
      } finally {
        this.loading = false
        this.applyCatalogSeo()
      }
    },
    handleImageError(event, productId) {
      const imgEl = event.target
      const product = this.products.find(p => p.id === productId)

      // Nếu đã thử fallback mà vẫn lỗi, dùng placeholder luôn
      if (!product || product.fallbackAttempted) {
        imgEl.src = this.getPlaceholderImage()
        this.imageLoaded[productId] = true
        return
      }

      product.fallbackAttempted = true

      // Thử lấy hình phối cảnh trước, sau đó tới hình thực tế
      this.resolveFallbackImage(product)
        .then((fallbackSrc) => {
          if (fallbackSrc) {
            imgEl.src = fallbackSrc
          } else {
            imgEl.src = this.getPlaceholderImage()
            this.imageLoaded[productId] = true
          }
        })
        .catch(() => {
          imgEl.src = this.getPlaceholderImage()
          this.imageLoaded[productId] = true
        })
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
    async resolveFallbackImage(product) {
      if (product.cachedFallbackImage !== undefined) {
        return product.cachedFallbackImage
      }

      const code = product.itemCode || product.id
      if (!code) {
        product.cachedFallbackImage = null
        return null
      }

      const collectionName = product.collectionName || ''

      // Ưu tiên hình phối cảnh, sau đó hình thực tế
      const perspectiveImages = await productService.getProductImages(code, 'perspective', collectionName)
      if (perspectiveImages && perspectiveImages.length) {
        product.cachedFallbackImage = perspectiveImages[0]
        return product.cachedFallbackImage
      }

      const realImages = await productService.getProductImages(code, 'real', collectionName)
      if (realImages && realImages.length) {
        product.cachedFallbackImage = realImages[0]
        return product.cachedFallbackImage
      }

      product.cachedFallbackImage = null
      return null
    },
    getPlaceholderImage() {
      return 'https://placehold.co/100/971b1e/white?text=%0AKH%C3%94NG%20C%C3%93%20H%C3%8CNH%20%E1%BA%A2NH&font=Roboto'
    },
    formatPrice(price) {
      const number = Number(price);
      if (!number || Number.isNaN(number) || number <= 0) {
        return 'Liên hệ'
      }
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(number)
    },
    setCategoryFilter(categoryId) {
      if (this.activeCategoryId === categoryId) return
      this.activeCategoryId = categoryId
      this.selectedFilters.categories = [categoryId]
    },
    selectCategory(categoryId) {
      this.selectedCategoryId = this.selectedCategoryId === categoryId ? null : categoryId
    },
    selectSubCategory(subCategoryId) {
      this.selectedCollectionId = this.selectedCollectionId === subCategoryId ? null : subCategoryId
    },
    selectColor(colorId) {
      this.selectedColorId = this.selectedColorId === colorId ? null : colorId
    },
    selectSize(sizeId) {
      this.selectedSizeId = this.selectedSizeId === sizeId ? null : sizeId
    },
    toggleFilterSection(section) {
      const categoryId = this.activeCategory?.id
      if (!categoryId || !this.expandedSections[section]) return
      if (this.expandedSections[section].includes(categoryId)) {
        this.expandedSections[section] = this.expandedSections[section].filter(id => id !== categoryId)
      } else {
        this.expandedSections[section] = [...this.expandedSections[section], categoryId]
      }
    },
    isSectionExpanded(section) {
      const categoryId = this.activeCategory?.id
      if (!categoryId) return false
      return (this.expandedSections[section] || []).includes(categoryId)
    },
    resetSelectionsForCategory(categoryId) {
      this.selectedCategoryId = null
      this.selectedCollectionId = null
      this.selectedColorId = null
      this.selectedSizeId = null
      if (!categoryId) return
      Object.keys(this.expandedSections).forEach(section => {
        this.expandedSections[section] = this.expandedSections[section].filter(id => id !== categoryId)
      })
    },
    clearAllFilters() {
      this.updatingFromRoute = true
      this.selectedFilters.categories = ['gạch']
      this.activeCategoryId = 'gạch'
      this.selectedCategoryId = null
      this.selectedCollectionId = null
      this.selectedColorId = null
      this.selectedSizeId = null
      this.priceRange = [null, null]
      this.priceInputs = { from: '', to: '' }
      this.saleOnly = false
      this.currentPage = 1
      Object.keys(this.expandedSections).forEach(section => {
        this.expandedSections[section] = []
      })
      this.updatingFromRoute = false
      this.updateRouteQuery({
        productType: 'gạch',
        category: undefined,
        collection: undefined,
        color: undefined,
        size: undefined,
        priceFrom: undefined,
        priceTo: undefined,
        saleOnly: undefined,
        page: 1
      })
    },
    shouldSpanCategory(name = '') {
      if (!name) return false
      return name.length > 20
    },
    applyPriceFilter() {
      const fromValue = this.priceInputs.from !== '' ? Number(this.priceInputs.from) : null
      const toValue = this.priceInputs.to !== '' ? Number(this.priceInputs.to) : null

      const normalizedFrom = Number.isNaN(fromValue) ? null : fromValue
      const normalizedTo = Number.isNaN(toValue) ? null : toValue

      if (normalizedFrom !== null && normalizedTo !== null && normalizedFrom > normalizedTo) {
        this.priceRange = [normalizedTo, normalizedFrom]
        this.priceInputs.from = normalizedTo
        this.priceInputs.to = normalizedFrom
      } else {
        this.priceRange = [normalizedFrom, normalizedTo]
      }

      if (this.updatingFromRoute) return
      this.currentPage = 1
      const priceFromParam = this.priceRange[0] != null ? this.priceRange[0] : undefined
      const priceToParam = this.priceRange[1] != null ? this.priceRange[1] : undefined
      this.updateRouteQuery({
        priceFrom: priceFromParam,
        priceTo: priceToParam,
        page: 1
      })
    },
    goToPage(page) {
      const target = Number(page)
      if (Number.isNaN(target) || target === this.currentPage) return
      if (target < 1 || target > this.totalPages) return
      this.currentPage = target
    },
    applyCatalogSeo() {
      const typeName = this.activeCategory?.name || 'Danh mục Vietceramics'
      const selectedCategory = this.activeCategory?.categories?.find(cat => cat.id === this.selectedCategoryId)
      const selectedCollection = this.activeCategory?.collections?.find(col => col.id === this.selectedCollectionId)
      const selectedColor = this.activeCategory?.colors?.find(color => color.id === this.selectedColorId)
      const selectedSize = this.activeCategory?.sizes?.find(size => size.id === this.selectedSizeId)
      const saleText = this.saleOnly ? 'sản phẩm đang giảm giá' : 'bộ sưu tập mới nhất'

      const filters = [
        selectedCategory?.name,
        selectedCollection?.name,
        selectedColor?.name,
        selectedSize?.name
      ].filter(Boolean)

      const filterSummary = filters.length ? filters.join(', ') : null
      const titleParts = ['Vietceramics', typeName]
      if (selectedCategory?.name) {
        titleParts[1] += ` - ${selectedCategory.name}`
      }
      const pageTitle = titleParts.join(' | ')
      const count = this.totalRecords || this.products.length
      const description = filterSummary
        ? `Tìm ${count} ${saleText} cho ${filterSummary} thuộc nhóm ${typeName.toLowerCase()} tại Vietceramics.`
        : `Khám phá ${count} ${typeName.toLowerCase()} ${saleText} tại Vietceramics.`
      const keywords = ['Vietceramics', typeName, filterSummary].filter(Boolean).join(',')
      const heroImage = this.products[0]?.image

      updateSeoMeta({
        title: pageTitle,
        description,
        keywords,
        image: heroImage,
        url: window.location.href
      })
    }
  },
  watch: {
    '$route.query': {
      handler(newQuery) {
        this.applyRouteState(newQuery || {})
        this.loadProducts()
      },
      immediate: true
    },
    currentPage(newPage) {
      if (this.updatingFromRoute) return
      this.updateRouteQuery({ page: newPage })
    },
    sortOption(newSort) {
      if (this.updatingFromRoute) return
      this.updateRouteQuery({ sort: newSort })
    },
    'selectedFilters.categories': {
      handler(newVal) {
        if (this.updatingFromRoute) return
        const productType = newVal && newVal.length ? newVal[0] : undefined
        if (productType) {
          this.activeCategoryId = productType
          this.resetSelectionsForCategory(productType)
        } else {
          this.activeCategoryId = null
          this.resetSelectionsForCategory(null)
        }
        this.currentPage = 1
        this.updateRouteQuery({
          productType,
          page: 1
        })
      }
    },
    selectedCategoryId(newVal) {
      if (this.updatingFromRoute) return
      this.currentPage = 1
      this.updateRouteQuery({
        category: newVal,
        page: 1
      })
    },
    selectedCollectionId(newVal) {
      if (this.updatingFromRoute) return
      this.currentPage = 1
      this.updateRouteQuery({
        collection: newVal,
        page: 1
      })
    },
    selectedColorId(newVal) {
      if (this.updatingFromRoute) return
      this.currentPage = 1
      this.updateRouteQuery({
        color: newVal,
        page: 1
      })
    },
    selectedSizeId(newVal) {
      if (this.updatingFromRoute) return
      this.currentPage = 1
      this.updateRouteQuery({
        size: newVal,
        page: 1
      })
    },
    saleOnly(newVal) {
      if (this.updatingFromRoute) return
      this.currentPage = 1
      this.updateRouteQuery({
        saleOnly: newVal ? 'true' : undefined,
        page: 1
      })
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

.reset-filter-btn {
  border: 1px solid #971b1e;
  color: #971b1e;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.15rem 0.75rem;
  background: transparent;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.reset-filter-btn:hover {
  background: #971b1e;
  color: #fff;
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

.no-products-alert {
  padding: 2rem;
  text-align: center;
  border: 2px dashed #e9ecef;
  border-radius: 16px;
  background: #fff;
  margin-bottom: 2rem;
}

.no-products-icon {
  font-size: 2.5rem;
  color: #971b1e;
  margin-bottom: 1rem;
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

.image-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  z-index: 2;
}

.image-skeleton-shimmer {
  width: 90%;
  height: 90%;
  border-radius: 16px;
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  background-size: 200% 100%;
  animation: loading-skeleton 1.5s infinite;
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

.price-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  margin-bottom: 0.75rem;
}

.price-sale {
  color: #c92a2a;
  font-weight: 700;
}

.price-base {
  color: #6c757d;
  font-size: 0.95rem;
}
.price-contact {
  color: #971b1e;
  font-weight: 700;
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

.sale-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ff6b6b;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
  z-index: 2;
  text-transform: uppercase;
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

.category-tabs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #dee2e6;
  background: #fff;
  border-radius: 16px;
  padding: 0.85rem;
  width: 100%;
  text-align: left;
  color: #212529;
  font-weight: 600;
  transition: background 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}

.category-tab-image {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: #fff8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.category-tab-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.category-tab-title {
  font-size: 1rem;
  letter-spacing: 0.02em;
}

.category-tab:hover {
  border-color: #971b1e;
  box-shadow: 0 8px 20px rgba(151,27,30,0.12);
  transform: translateX(6px);
}

.category-tab.active {
  background: linear-gradient(135deg, rgba(151,27,30,0.95), rgba(151,27,30,0.75));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 12px 30px rgba(151,27,30,0.25);
}

.category-tab.active .category-tab-image {
  background: rgba(255,255,255,0.2);
}

.sub-category-panel {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px dashed #dee2e6;
}

.sub-category-panel h5 {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sub-category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sub-category-pill {
  border: 1px solid #e9ecef;
  background: #fff;
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  font-size: 0.9rem;
  color: #495057;
  transition: all 0.2s;
  max-width: 180px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-category-pill.span-2 {
  grid-column: span 2;
}

.sub-category-pill:hover {
  border-color: #971b1e;
  color: #971b1e;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(151,27,30,0.12);
}

.sub-category-pill.active {
  background: #971b1e;
  border-color: #971b1e;
  color: #fff;
  box-shadow: 0 6px 14px rgba(151,27,30,0.2);
}

.filter-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-chip {
  border: 1px solid #e9ecef;
  background: #fff;
  border-radius: 14px;
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
  color: #495057;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.filter-chip:hover {
  border-color: #971b1e;
  color: #971b1e;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(151,27,30,0.12);
}

.filter-chip.active {
  background: #971b1e;
  border-color: #971b1e;
  color: #fff;
  box-shadow: 0 6px 14px rgba(151,27,30,0.2);
}

.color-chip .color-swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.12);
}

.size-chip .size-label {
  font-weight: 600;
  letter-spacing: 0.03em;
}

.sub-category-more {
  border: 1px dashed #c0c7d1;
  background: transparent;
  color: #971b1e;
  border-radius: 999px;
  padding: 0.4rem 1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s;
}

.sub-category-more:hover {
  background: rgba(151,27,30,0.08);
  border-color: #971b1e;
}

.price-filter-group .price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-filter-group .price-inputs .form-control {
  width: 100%;
}

.price-filter-group .price-separator {
  color: #6c757d;
  font-weight: 600;
}

.sale-toggle {
  margin-top: 0.75rem;
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
