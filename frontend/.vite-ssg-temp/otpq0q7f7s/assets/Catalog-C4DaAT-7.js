import axios from "axios";
import { _ as _export_sfc, u as updateSeoMeta, g as getSizeOptions, a as getFeaturedCategories } from "../main.mjs";
import { p as productService } from "./productService-DiWauF2M.js";
import { resolveComponent, resolveDirective, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrGetDirectiveProps, ssrRenderComponent } from "vue/server-renderer";
import "hookable";
import "vue-router";
import "vue-toastification";
import "qrcode.vue";
import "bootstrap-vue-3";
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
`;
const skipColorNames = /* @__PURE__ */ new Set(["null", "0", "tên màu sắc", "không phân loại", ""]);
const normalizeProductTypeId = (value) => {
  if (!value) return null;
  return value.toString().trim().toLowerCase();
};
const normalizeText = (text = "") => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const fallbackHashColor = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = hash >> i * 8 & 255;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};
const clamp = (val, min = 0, max = 255) => Math.min(Math.max(val, min), max);
const adjustColor = (hex, percent = 0) => {
  if (!hex) return hex;
  const normalized = hex.replace("#", "");
  const num = parseInt(normalized, 16);
  if (Number.isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = clamp((num >> 16) + amt);
  const g = clamp((num >> 8 & 255) + amt);
  const b = clamp((num & 255) + amt);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};
const guessColorFromName = (label) => {
  if (!label) return fallbackHashColor(label);
  const normalized = normalizeText(label);
  const segments = normalized.split(/[,;+\/]/).map((part) => part.trim()).filter(Boolean);
  const primary = segments[0] || normalized;
  const resolveBaseColor = (text) => {
    if (!text) return null;
    if (text.includes("den") || text.includes("black") || text.includes("huyen")) return "#1f1f1f";
    if (text.includes("trang") || text.includes("white") || text.includes("snow")) return "#f8f9fa";
    if (text.includes("xanh")) {
      if (text.includes("bien") || text.includes("duong") || text.includes("ocean") || text.includes("lam") || text.includes("troi")) {
        return "#1e88e5";
      }
      if (text.includes("la") || text.includes("leaf") || text.includes("cay") || text.includes("forest") || text.includes("nhom")) {
        return "#2ecc71";
      }
      if (text.includes("riu") || text.includes("rieu")) {
        return "#4c956c";
      }
      if (text.includes("co vit")) {
        return "#228b22";
      }
      return "#1abc9c";
    }
    if (text.includes("xam") || text.includes("ghi") || text.includes("cement") || text.includes("betong")) return "#7f8c8d";
    if (text.includes("vang 24k") || text.includes("24k") || text.includes("pvd")) return "#d4af37";
    if (text.includes("vang dong") || text.includes("dong") || text.includes("bronze") || text.includes("copper")) return "#b87333";
    if (text.includes("vang") || text.includes("gold")) return "#f2c94c";
    if (text.includes("cam") || text.includes("orange") || text.includes("amber")) return "#ffa94d";
    if (text.includes("hong") || text.includes("pink")) return "#f78fb3";
    if (text.includes("do") || text.includes("red")) return "#d63031";
    if (text.includes("tim") || text.includes("purple") || text.includes("violet")) return "#b39ddb";
    if (text.includes("nau") || text.includes("go") || text.includes("wood") || text.includes("teak") || text.includes("wenge")) return "#8d5524";
    if (text.includes("kem") || text.includes("be") || text.includes("ivory")) return "#f7e0c4";
    if (text.includes("bac kim") || text.includes("bach kim") || text.includes("platinum")) return "#e5e4e2";
    if (text.includes("bac") || text.includes("silver") || text.includes("chrome") || text.includes("crom") || text.includes("niken") || text.includes("nickel") || text.includes("inox") || text.includes("metal") || text.includes("kim loai")) return "#c0c0c0";
    if (text.includes("bong") && text.includes("glass")) return "#ececec";
    if (text.includes("crystal")) return "#dfe7fd";
    return null;
  };
  const baseColor = resolveBaseColor(primary) || resolveBaseColor(normalized);
  let adjustment = 0;
  if (normalized.includes("nhat") || normalized.includes("light") || normalized.includes("pastel") || normalized.includes("sang")) {
    adjustment += 20;
  }
  if (normalized.includes("dam") || normalized.includes("dark") || normalized.includes("sau")) {
    adjustment -= 20;
  }
  if (normalized.includes("mo") || normalized.includes("matte") || normalized.includes("matt")) {
    adjustment -= 5;
  }
  if (normalized.includes("bong") || normalized.includes("gloss")) {
    adjustment += 5;
  }
  const resultColor = baseColor || fallbackHashColor(label);
  return adjustment ? adjustColor(resultColor, adjustment) : resultColor;
};
const buildSharedColors = () => {
  const entries = rawColorData.split("\n").map((item) => item.trim()).filter(Boolean);
  const map = /* @__PURE__ */ new Map();
  entries.forEach((name) => {
    const normalized = name.trim();
    if (!normalized) return;
    if (skipColorNames.has(normalized.toLowerCase())) return;
    const key = normalized.toLowerCase();
    if (map.has(key)) return;
    map.set(key, {
      id: normalized,
      // dùng đúng text hiển thị
      name: normalized,
      swatch: guessColorFromName(normalized)
    });
  });
  return Array.from(map.values());
};
const sharedColorOptions = buildSharedColors();
const cloneSharedColors = () => sharedColorOptions.map((color) => ({ ...color }));
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
`;
const sharedCollections = rawCollections.split("\n").map((item) => item.trim()).filter(Boolean).map((name) => ({ id: name, name }));
const cloneSharedCollections = () => sharedCollections.map((item) => ({ ...item }));
const _sfc_main = {
  ///POST http://item.vietceramics.vn/vi/loc-san-pham?space=TBVS
  name: "Catalog",
  data() {
    return {
      currentPage: 1,
      sortOption: "newest",
      itemsPerPage: 12,
      filterPreviewLimit: 6,
      priceRange: [null, null],
      priceInputs: {
        from: "",
        to: ""
      },
      saleOnly: false,
      selectedFilters: {
        categories: ["gạch"]
      },
      activeCategoryId: "gạch",
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
      isLoggedIn: false,
      filters: {
        categories: [
          {
            id: "gạch",
            name: "Gạch",
            image: "https://cdn-icons-gif.flaticon.com/10966/10966480.gif",
            categories: getFeaturedCategories("gạch"),
            collections: cloneSharedCollections(),
            colors: cloneSharedColors(),
            sizes: getSizeOptions()
          },
          {
            id: "thiết bị vệ sinh",
            name: "Thiết bị vệ sinh",
            image: "https://cdn-icons-gif.flaticon.com/17091/17091858.gif",
            categories: getFeaturedCategories("thiết bị vệ sinh"),
            collections: [
              { id: "flow", name: "Flow" },
              { id: "emporio shower", name: "Emporio Shower" },
              { id: "signature bath", name: "Signature Bath" },
              { id: "urban wellness", name: "Urban Wellness" },
              { id: "zen series", name: "Zen Series" },
              { id: "artisan bath", name: "Artisan Bath" },
              { id: "pure touch", name: "Pure Touch" }
            ],
            colors: cloneSharedColors(),
            sizes: getSizeOptions()
          },
          {
            id: "Ván sàn",
            name: "Ván sàn",
            image: "https://cdn-icons-png.flaticon.com/128/5848/5848426.png",
            categories: getFeaturedCategories("Ván sàn"),
            collections: [
              { id: "signature wood", name: "Signature Wood" },
              { id: "coastal wood", name: "Coastal Wood" },
              { id: "herringbone studio", name: "Herringbone Studio" },
              { id: "nordic oak", name: "Nordic Oak" },
              { id: "urban rustic", name: "Urban Rustic" },
              { id: "heritage plank", name: "Heritage Plank" },
              { id: "eco deck", name: "Eco Deck" }
            ],
            colors: cloneSharedColors(),
            sizes: getSizeOptions()
          }
        ]
      }
    };
  },
  computed: {
    sortedProducts() {
      let sorted = [...this.products];
      switch (this.sortOption) {
        case "name":
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "popular":
          break;
        default:
          sorted.sort((a, b) => b.id - a.id);
      }
      return sorted;
    },
    totalPages() {
      return Math.max(1, this.totalPagesFromApi || 1);
    },
    visiblePages() {
      const pages = [];
      if (this.totalPages <= 5) {
        for (let i = 1; i <= this.totalPages; i++) pages.push(i);
      } else {
        if (this.currentPage <= 3) {
          pages.push(1, 2, 3, 4, "...", this.totalPages);
        } else if (this.currentPage >= this.totalPages - 2) {
          pages.push(1, "...", this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages);
        } else {
          pages.push(1, "...", this.currentPage - 1, this.currentPage, this.currentPage + 1, "...", this.totalPages);
        }
      }
      return pages;
    },
    activeCategory() {
      var _a, _b;
      if (!((_b = (_a = this.filters) == null ? void 0 : _a.categories) == null ? void 0 : _b.length)) return null;
      const selectedId = this.activeCategoryId || this.selectedFilters.categories[0];
      return this.filters.categories.find((cat) => cat.id === selectedId) || this.filters.categories[0];
    },
    displayedCategories() {
      var _a;
      if (!((_a = this.activeCategory) == null ? void 0 : _a.categories)) return [];
      const list = this.activeCategory.categories;
      return this.isSectionExpanded("categories") ? list : list.slice(0, this.filterPreviewLimit);
    },
    categoryHasMore() {
      var _a;
      return !!(((_a = this.activeCategory) == null ? void 0 : _a.categories) && this.activeCategory.categories.length > this.filterPreviewLimit);
    },
    isCategoryExpanded() {
      return this.isSectionExpanded("categories");
    },
    displayedCollections() {
      var _a;
      const list = ((_a = this.activeCategory) == null ? void 0 : _a.collections) || [];
      return this.isSectionExpanded("collections") ? list : list.slice(0, this.filterPreviewLimit);
    },
    collectionHasMore() {
      var _a;
      const list = ((_a = this.activeCategory) == null ? void 0 : _a.collections) || [];
      return list.length > this.filterPreviewLimit;
    },
    isCollectionExpanded() {
      return this.isSectionExpanded("collections");
    },
    displayedColors() {
      var _a;
      const list = ((_a = this.activeCategory) == null ? void 0 : _a.colors) || [];
      return this.isSectionExpanded("colors") ? list : list.slice(0, this.filterPreviewLimit);
    },
    colorHasMore() {
      var _a;
      const list = ((_a = this.activeCategory) == null ? void 0 : _a.colors) || [];
      return list.length > this.filterPreviewLimit;
    },
    isColorExpanded() {
      return this.isSectionExpanded("colors");
    },
    displayedSizes() {
      var _a;
      const list = ((_a = this.activeCategory) == null ? void 0 : _a.sizes) || [];
      return this.isSectionExpanded("sizes") ? list : list.slice(0, this.filterPreviewLimit);
    },
    sizeHasMore() {
      var _a;
      const list = ((_a = this.activeCategory) == null ? void 0 : _a.sizes) || [];
      return list.length > this.filterPreviewLimit;
    },
    isSizeExpanded() {
      return this.isSectionExpanded("sizes");
    },
    isTileCategory() {
      var _a;
      return (((_a = this.activeCategory) == null ? void 0 : _a.id) || "").toLowerCase() === "gạch";
    },
    hasActiveFilters() {
      const defaultProductType = this.selectedFilters.categories && this.selectedFilters.categories[0] === "gạch";
      return !defaultProductType || !!(this.selectedCategoryId || this.selectedCollectionId || this.selectedColorId || this.selectedSizeId || this.saleOnly || this.priceRange[0] != null || this.priceRange[1] != null);
    }
  },
  methods: {
    updateLoginStatus() {
      try {
        const user = localStorage.getItem("user");
        this.isLoggedIn = Boolean(user);
      } catch (err) {
        this.isLoggedIn = false;
      }
    },
    applyRouteState(query = {}) {
      this.updatingFromRoute = true;
      const page = parseInt(query.page, 10);
      this.currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
      const allowedSorts = ["newest", "name", "popular"];
      const sort = query.sort && allowedSorts.includes(query.sort) ? query.sort : "newest";
      this.sortOption = sort;
      let resolvedCategoryParam = query.category || null;
      let routeProductType = normalizeProductTypeId(query.productType || null);
      if (!routeProductType && resolvedCategoryParam) {
        const isTopLevelCategory = this.filters.categories.some((cat) => cat.id === resolvedCategoryParam);
        if (isTopLevelCategory) {
          routeProductType = normalizeProductTypeId(resolvedCategoryParam);
          resolvedCategoryParam = null;
        }
      }
      routeProductType = routeProductType || this.selectedFilters.categories[0] || null;
      if (routeProductType) {
        this.activeCategoryId = routeProductType;
        if (this.selectedFilters.categories[0] !== routeProductType) {
          this.selectedFilters.categories = [routeProductType];
        }
      } else {
        this.activeCategoryId = null;
        this.selectedFilters.categories = [];
      }
      this.selectedCategoryId = resolvedCategoryParam;
      this.selectedCollectionId = query.collection || null;
      this.selectedColorId = query.color || null;
      this.selectedSizeId = query.size || null;
      const priceFrom = query.priceFrom !== void 0 ? Number(query.priceFrom) : null;
      const priceTo = query.priceTo !== void 0 ? Number(query.priceTo) : null;
      this.priceRange = [Number.isNaN(priceFrom) ? null : priceFrom, Number.isNaN(priceTo) ? null : priceTo];
      this.priceInputs = {
        from: this.priceRange[0] != null ? String(this.priceRange[0]) : "",
        to: this.priceRange[1] != null ? String(this.priceRange[1]) : ""
      };
      this.saleOnly = query.saleOnly === "true" || query.saleOnly === "1";
      this.$nextTick(() => {
        this.updatingFromRoute = false;
      });
    },
    updateRouteQuery(partialQuery = {}) {
      const nextQuery = { ...this.$route.query };
      Object.entries(partialQuery).forEach(([key, value]) => {
        const isDefaultPage = key === "page" && (Number(value) || 1) === 1;
        const isDefaultSort = key === "sort" && (value === "newest" || !value);
        const shouldRemove = value === void 0 || value === null || value === "" || isDefaultPage || isDefaultSort;
        if (shouldRemove) {
          delete nextQuery[key];
        } else {
          nextQuery[key] = String(value);
        }
      });
      this.$router.replace({ query: nextQuery }).catch(() => {
      });
    },
    async loadProducts() {
      var _a, _b, _c, _d, _e;
      this.loading = true;
      this.products = [];
      this.imageLoaded = {};
      try {
        const params = {
          pageIndex: this.currentPage,
          pageSize: this.itemsPerPage
        };
        const productType = this.selectedFilters.categories && this.selectedFilters.categories.length ? this.selectedFilters.categories[0] : null;
        if (productType) {
          params.productType = productType;
        }
        if (this.selectedCategoryId) {
          params.category = this.selectedCategoryId;
        }
        if (this.selectedCollectionId) {
          params.collection = this.selectedCollectionId;
        }
        if (this.selectedColorId) {
          params.color = this.selectedColorId;
        }
        if (this.selectedSizeId) {
          params.size = this.selectedSizeId;
        }
        if (this.priceRange[0] !== null && this.priceRange[0] !== void 0) {
          params.priceFrom = this.priceRange[0];
        }
        if (this.priceRange[1] !== null && this.priceRange[1] !== void 0) {
          params.priceTo = this.priceRange[1];
        }
        if (this.saleOnly) {
          params.isSale = true;
        }
        const resp = await axios.get("https://api.vietceramics.com/api/Products/Search", {
          params
        });
        const items = ((_a = resp.data) == null ? void 0 : _a.data) || ((_b = resp.data) == null ? void 0 : _b.ListItems) || ((_c = resp.data) == null ? void 0 : _c.Items) || resp.data || [];
        const firstItem = items && items.length ? items[0] : null;
        const totalRecords = ((_d = resp.data) == null ? void 0 : _d.totalRecords) ?? (firstItem == null ? void 0 : firstItem.total_records) ?? 0;
        const totalPages = ((_e = resp.data) == null ? void 0 : _e.totalPages) ?? (firstItem == null ? void 0 : firstItem.total_pages) ?? Math.max(1, Math.ceil((totalRecords || 1) / this.itemsPerPage));
        this.totalRecords = totalRecords || (items.length ? (this.currentPage - 1) * this.itemsPerPage + items.length : 0);
        this.totalPagesFromApi = totalPages;
        const normalizePrice = (value) => {
          if (value === null || value === void 0 || value === "") return null;
          const num = Number(value);
          return Number.isNaN(num) ? null : num;
        };
        const productItems = (items || []).map((item) => {
          const code = item.product_code || item.productCode || item.ProductCode || item.No_ || item.ItemCode || item.Code || item.code || item.id;
          const name = item.product_name || item.productName || item.ProductName || item.Name || item.name || item.Title || "";
          const productId = item.id || code || Math.random().toString(36).slice(2, 9);
          this.imageLoaded[productId] = false;
          const productImageUrl = code ? `http://toppstiles.com.vn/products-test/hinh-gach/${code}.jpg` : "";
          const fallbackAvatar = item.avatar || item.custom_field143 || "";
          const imageUrl = productImageUrl || fallbackAvatar;
          const priceBase = normalizePrice(item.price_base ?? item.priceBase ?? item.unit_price ?? item.price_sale);
          const priceSale = normalizePrice(item.price_sale ?? item.priceSale);
          const isSaleFlag = item.is_sale === true || item.is_sale === 1 || item.is_sale === "1" || item.is_sale === "true";
          return {
            id: productId,
            name,
            itemCode: code || "",
            image: imageUrl,
            priceBase,
            priceSale,
            isSale: Boolean(isSaleFlag),
            category: item.product_category || "",
            collectionName: item.custom_field121 || "",
            colorName: item.custom_field90 || item.custom_field149 || "",
            sizeName: item.custom_field141 || item.custom_field104 || "",
            description: item.description || item.sale_description || ""
          };
        });
        this.products = productItems;
      } catch (error) {
        console.error("Error loading products:", error);
        this.products = [];
        this.totalRecords = 0;
        this.totalPagesFromApi = 1;
      } finally {
        this.loading = false;
        this.applyCatalogSeo();
      }
    },
    handleImageError(event, productId) {
      const imgEl = event.target;
      const product = this.products.find((p) => p.id === productId);
      if (!product || product.fallbackAttempted) {
        imgEl.src = this.getPlaceholderImage();
        this.imageLoaded[productId] = true;
        return;
      }
      product.fallbackAttempted = true;
      this.resolveFallbackImage(product).then((fallbackSrc) => {
        if (fallbackSrc) {
          imgEl.src = fallbackSrc;
        } else {
          imgEl.src = this.getPlaceholderImage();
          this.imageLoaded[productId] = true;
        }
      }).catch(() => {
        imgEl.src = this.getPlaceholderImage();
        this.imageLoaded[productId] = true;
      });
    },
    handleImageLoad(event) {
      var _a;
      const img = event.target;
      const productId = img.getAttribute("data-product-id") || ((_a = img.closest(".card")) == null ? void 0 : _a.getAttribute("data-product-id"));
      if (productId) {
        this.imageLoaded[productId] = true;
      }
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.objectPosition = "center";
    },
    async resolveFallbackImage(product) {
      if (product.cachedFallbackImage !== void 0) {
        return product.cachedFallbackImage;
      }
      const code = product.itemCode || product.id;
      if (!code) {
        product.cachedFallbackImage = null;
        return null;
      }
      const collectionName = product.collectionName || "";
      const productImages = await productService.getProductImages(code, "product", collectionName);
      if (productImages && productImages.length) {
        product.cachedFallbackImage = productImages[0];
        return product.cachedFallbackImage;
      }
      const perspectiveImages = await productService.getProductImages(code, "perspective", collectionName);
      if (perspectiveImages && perspectiveImages.length) {
        product.cachedFallbackImage = perspectiveImages[0];
        return product.cachedFallbackImage;
      }
      const realImages = await productService.getProductImages(code, "real", collectionName);
      if (realImages && realImages.length) {
        product.cachedFallbackImage = realImages[0];
        return product.cachedFallbackImage;
      }
      product.cachedFallbackImage = null;
      return null;
    },
    getPlaceholderImage() {
      return "https://placehold.co/100/971b1e/white?text=%0AKH%C3%94NG%20C%C3%93%20H%C3%8CNH%20%E1%BA%A2NH&font=Roboto";
    },
    formatPrice(price) {
      const number = Number(price);
      if (!number || Number.isNaN(number) || number <= 0) {
        return "Liên hệ";
      }
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
      }).format(number);
    },
    setCategoryFilter(categoryId) {
      if (this.activeCategoryId === categoryId) return;
      this.activeCategoryId = categoryId;
      this.selectedFilters.categories = [categoryId];
    },
    selectCategory(categoryId) {
      this.selectedCategoryId = this.selectedCategoryId === categoryId ? null : categoryId;
    },
    selectSubCategory(subCategoryId) {
      this.selectedCollectionId = this.selectedCollectionId === subCategoryId ? null : subCategoryId;
    },
    selectColor(colorId) {
      this.selectedColorId = this.selectedColorId === colorId ? null : colorId;
    },
    selectSize(sizeId) {
      this.selectedSizeId = this.selectedSizeId === sizeId ? null : sizeId;
    },
    toggleFilterSection(section) {
      var _a;
      const categoryId = (_a = this.activeCategory) == null ? void 0 : _a.id;
      if (!categoryId || !this.expandedSections[section]) return;
      if (this.expandedSections[section].includes(categoryId)) {
        this.expandedSections[section] = this.expandedSections[section].filter((id) => id !== categoryId);
      } else {
        this.expandedSections[section] = [...this.expandedSections[section], categoryId];
      }
    },
    isSectionExpanded(section) {
      var _a;
      const categoryId = (_a = this.activeCategory) == null ? void 0 : _a.id;
      if (!categoryId) return false;
      return (this.expandedSections[section] || []).includes(categoryId);
    },
    resetSelectionsForCategory(categoryId) {
      this.selectedCategoryId = null;
      this.selectedCollectionId = null;
      this.selectedColorId = null;
      this.selectedSizeId = null;
      if (!categoryId) return;
      Object.keys(this.expandedSections).forEach((section) => {
        this.expandedSections[section] = this.expandedSections[section].filter((id) => id !== categoryId);
      });
    },
    clearAllFilters() {
      this.updatingFromRoute = true;
      this.selectedFilters.categories = ["gạch"];
      this.activeCategoryId = "gạch";
      this.selectedCategoryId = null;
      this.selectedCollectionId = null;
      this.selectedColorId = null;
      this.selectedSizeId = null;
      this.priceRange = [null, null];
      this.priceInputs = { from: "", to: "" };
      this.saleOnly = false;
      this.currentPage = 1;
      Object.keys(this.expandedSections).forEach((section) => {
        this.expandedSections[section] = [];
      });
      this.updatingFromRoute = false;
      this.updateRouteQuery({
        productType: "gạch",
        category: void 0,
        collection: void 0,
        color: void 0,
        size: void 0,
        priceFrom: void 0,
        priceTo: void 0,
        saleOnly: void 0,
        page: 1
      });
    },
    shouldSpanCategory(name = "") {
      if (!name) return false;
      return name.length > 20;
    },
    applyPriceFilter() {
      const fromValue = this.priceInputs.from !== "" ? Number(this.priceInputs.from) : null;
      const toValue = this.priceInputs.to !== "" ? Number(this.priceInputs.to) : null;
      const normalizedFrom = Number.isNaN(fromValue) ? null : fromValue;
      const normalizedTo = Number.isNaN(toValue) ? null : toValue;
      if (normalizedFrom !== null && normalizedTo !== null && normalizedFrom > normalizedTo) {
        this.priceRange = [normalizedTo, normalizedFrom];
        this.priceInputs.from = normalizedTo;
        this.priceInputs.to = normalizedFrom;
      } else {
        this.priceRange = [normalizedFrom, normalizedTo];
      }
      if (this.updatingFromRoute) return;
      this.currentPage = 1;
      const priceFromParam = this.priceRange[0] != null ? this.priceRange[0] : void 0;
      const priceToParam = this.priceRange[1] != null ? this.priceRange[1] : void 0;
      this.updateRouteQuery({
        priceFrom: priceFromParam,
        priceTo: priceToParam,
        page: 1
      });
    },
    goToPage(page) {
      const target = Number(page);
      if (Number.isNaN(target) || target === this.currentPage) return;
      if (target < 1 || target > this.totalPages) return;
      this.currentPage = target;
    },
    applyCatalogSeo() {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const typeName = ((_a = this.activeCategory) == null ? void 0 : _a.name) || "Danh mục Vietceramics";
      const selectedCategory = (_c = (_b = this.activeCategory) == null ? void 0 : _b.categories) == null ? void 0 : _c.find((cat) => cat.id === this.selectedCategoryId);
      const selectedCollection = (_e = (_d = this.activeCategory) == null ? void 0 : _d.collections) == null ? void 0 : _e.find((col) => col.id === this.selectedCollectionId);
      const selectedColor = (_g = (_f = this.activeCategory) == null ? void 0 : _f.colors) == null ? void 0 : _g.find((color) => color.id === this.selectedColorId);
      const selectedSize = (_i = (_h = this.activeCategory) == null ? void 0 : _h.sizes) == null ? void 0 : _i.find((size) => size.id === this.selectedSizeId);
      const saleText = this.saleOnly ? "sản phẩm đang giảm giá" : "bộ sưu tập mới nhất";
      const filters = [
        selectedCategory == null ? void 0 : selectedCategory.name,
        selectedCollection == null ? void 0 : selectedCollection.name,
        selectedColor == null ? void 0 : selectedColor.name,
        selectedSize == null ? void 0 : selectedSize.name
      ].filter(Boolean);
      const filterSummary = filters.length ? filters.join(", ") : null;
      const titleParts = ["Vietceramics", typeName];
      if (selectedCategory == null ? void 0 : selectedCategory.name) {
        titleParts[1] += ` - ${selectedCategory.name}`;
      }
      const pageTitle = titleParts.join(" | ");
      const count = this.totalRecords || this.products.length;
      const description = filterSummary ? `Tìm ${count} ${saleText} cho ${filterSummary} thuộc nhóm ${typeName.toLowerCase()} tại Vietceramics.` : `Khám phá ${count} ${typeName.toLowerCase()} ${saleText} tại Vietceramics.`;
      const keywords = ["Vietceramics", typeName, filterSummary].filter(Boolean).join(",");
      const heroImage = (_j = this.products[0]) == null ? void 0 : _j.image;
      updateSeoMeta({
        title: pageTitle,
        description,
        keywords,
        image: heroImage,
        url: window.location.href
      });
    }
  },
  mounted() {
    this.updateLoginStatus();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", this.updateLoginStatus);
    }
  },
  beforeUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", this.updateLoginStatus);
    }
  },
  watch: {
    "$route.query": {
      handler(newQuery) {
        this.applyRouteState(newQuery || {});
        this.loadProducts();
      },
      immediate: true
    },
    currentPage(newPage) {
      if (this.updatingFromRoute) return;
      this.updateRouteQuery({ page: newPage });
    },
    sortOption(newSort) {
      if (this.updatingFromRoute) return;
      this.updateRouteQuery({ sort: newSort });
    },
    "selectedFilters.categories": {
      handler(newVal) {
        if (this.updatingFromRoute) return;
        const productType = newVal && newVal.length ? newVal[0] : void 0;
        if (productType) {
          this.activeCategoryId = productType;
          this.resetSelectionsForCategory(productType);
        } else {
          this.activeCategoryId = null;
          this.resetSelectionsForCategory(null);
        }
        this.currentPage = 1;
        this.updateRouteQuery({
          productType,
          page: 1
        });
      }
    },
    selectedCategoryId(newVal) {
      if (this.updatingFromRoute) return;
      this.currentPage = 1;
      this.updateRouteQuery({
        category: newVal,
        page: 1
      });
    },
    selectedCollectionId(newVal) {
      if (this.updatingFromRoute) return;
      this.currentPage = 1;
      this.updateRouteQuery({
        collection: newVal,
        page: 1
      });
    },
    selectedColorId(newVal) {
      if (this.updatingFromRoute) return;
      this.currentPage = 1;
      this.updateRouteQuery({
        color: newVal,
        page: 1
      });
    },
    selectedSizeId(newVal) {
      if (this.updatingFromRoute) return;
      this.currentPage = 1;
      this.updateRouteQuery({
        size: newVal,
        page: 1
      });
    },
    saleOnly(newVal) {
      if (this.updatingFromRoute) return;
      this.currentPage = 1;
      this.updateRouteQuery({
        saleOnly: newVal ? "true" : void 0,
        page: 1
      });
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _directive_lazy = resolveDirective("lazy");
  let _temp0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "catalog" }, _attrs))} data-v-53193a45><div class="row g-0" data-v-53193a45><div class="col-3 d-none d-xxl-block" data-v-53193a45><div class="filters-section" data-v-53193a45><div class="filters-header d-flex justify-content-between align-items-center mb-3" data-v-53193a45><h3 class="mb-0" data-v-53193a45>Bộ lọc</h3>`);
  if ($options.hasActiveFilters) {
    _push(`<button type="button" class="reset-filter-btn" data-v-53193a45> Xóa bộ lọc </button>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="filter-group mb-4" data-v-53193a45><h4 data-v-53193a45>Danh mục sản phẩm</h4><div class="category-tabs" data-v-53193a45><!--[-->`);
  ssrRenderList($data.filters.categories, (category) => {
    _push(`<button type="button" class="${ssrRenderClass([{ active: $data.activeCategoryId === category.id }, "category-tab"])}" data-v-53193a45><div class="category-tab-image" data-v-53193a45><img${ssrRenderAttr("src", category.image)}${ssrRenderAttr("alt", category.name)} loading="lazy" data-v-53193a45></div><div class="category-tab-title" data-v-53193a45>${ssrInterpolate(category.name)}</div></button>`);
  });
  _push(`<!--]--></div></div>`);
  if ($options.displayedCategories.length) {
    _push(`<div class="filter-group mb-4 sub-category-panel" data-v-53193a45><h5 data-v-53193a45>Danh mục nổi bật</h5><div class="sub-category-list" data-v-53193a45><!--[-->`);
    ssrRenderList($options.displayedCategories, (category) => {
      _push(`<button type="button" class="${ssrRenderClass([{
        active: $data.selectedCategoryId === category.id,
        "span-2": $options.shouldSpanCategory(category.name)
      }, "sub-category-pill"])}" data-v-53193a45>${ssrInterpolate(category.name)}</button>`);
    });
    _push(`<!--]-->`);
    if ($options.categoryHasMore) {
      _push(`<button type="button" class="sub-category-more" data-v-53193a45><i class="${ssrRenderClass([$options.isCategoryExpanded ? "fi-br-minus-small" : "fi-br-plus-small", "fi"])}" data-v-53193a45></i> ${ssrInterpolate($options.isCategoryExpanded ? "Thu gọn" : "Xem thêm")}</button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.isTileCategory && $options.displayedCollections.length) {
    _push(`<div class="filter-group mb-4 sub-category-panel" data-v-53193a45><h5 data-v-53193a45>Bộ sưu tập nổi bật</h5><div class="sub-category-list" data-v-53193a45><!--[-->`);
    ssrRenderList($options.displayedCollections, (child) => {
      _push(`<button type="button" class="${ssrRenderClass([{ active: $data.selectedCollectionId === child.id }, "sub-category-pill"])}" data-v-53193a45>${ssrInterpolate(child.name)}</button>`);
    });
    _push(`<!--]-->`);
    if ($options.collectionHasMore) {
      _push(`<button type="button" class="sub-category-more" data-v-53193a45><i class="${ssrRenderClass([$options.isCollectionExpanded ? "fi-br-minus-small" : "fi-br-plus-small", "fi"])}" data-v-53193a45></i> ${ssrInterpolate($options.isCollectionExpanded ? "Thu gọn" : "Xem thêm")}</button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.displayedColors.length) {
    _push(`<div class="filter-group mb-4 sub-category-panel" data-v-53193a45><h5 data-v-53193a45>Bảng màu gợi ý</h5><div class="filter-chip-list" data-v-53193a45><!--[-->`);
    ssrRenderList($options.displayedColors, (color) => {
      _push(`<button type="button" class="${ssrRenderClass([{ active: $data.selectedColorId === color.id }, "filter-chip color-chip"])}" data-v-53193a45><span class="color-swatch" style="${ssrRenderStyle({ backgroundColor: color.swatch })}" data-v-53193a45></span><span data-v-53193a45>${ssrInterpolate(color.name)}</span></button>`);
    });
    _push(`<!--]-->`);
    if ($options.colorHasMore) {
      _push(`<button type="button" class="sub-category-more" data-v-53193a45><i class="${ssrRenderClass([$options.isColorExpanded ? "fi-br-minus-small" : "fi-br-plus-small", "fi"])}" data-v-53193a45></i> ${ssrInterpolate($options.isColorExpanded ? "Thu gọn" : "Xem thêm")}</button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.displayedSizes.length) {
    _push(`<div class="filter-group mb-4 sub-category-panel" data-v-53193a45><h5 data-v-53193a45>Kích thước phổ biến</h5><div class="filter-chip-list" data-v-53193a45><!--[-->`);
    ssrRenderList($options.displayedSizes, (size) => {
      _push(`<button type="button" class="${ssrRenderClass([{ active: $data.selectedSizeId === size.id }, "filter-chip size-chip"])}" data-v-53193a45><span class="size-label" data-v-53193a45>${ssrInterpolate(size.name)}</span></button>`);
    });
    _push(`<!--]-->`);
    if ($options.sizeHasMore) {
      _push(`<button type="button" class="sub-category-more" data-v-53193a45><i class="${ssrRenderClass([$options.isSizeExpanded ? "fi-br-minus-small" : "fi-br-plus-small", "fi"])}" data-v-53193a45></i> ${ssrInterpolate($options.isSizeExpanded ? "Thu gọn" : "Xem thêm")}</button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="filter-group mb-4 sub-category-panel price-filter-group" data-v-53193a45><h5 data-v-53193a45>Khoảng giá (VND)</h5><div class="price-inputs" data-v-53193a45><input type="number" class="form-control" placeholder="Từ" min="0"${ssrRenderAttr("value", $data.priceInputs.from)} data-v-53193a45><span class="price-separator" data-v-53193a45>-</span><input type="number" class="form-control" placeholder="Đến" min="0"${ssrRenderAttr("value", $data.priceInputs.to)} data-v-53193a45><button class="btn btn-outline-primary" data-v-53193a45>Áp dụng</button></div><div class="form-check form-switch sale-toggle" data-v-53193a45><input class="form-check-input" type="checkbox" id="sale-only-toggle"${ssrIncludeBooleanAttr(Array.isArray($data.saleOnly) ? ssrLooseContain($data.saleOnly, null) : $data.saleOnly) ? " checked" : ""} data-v-53193a45><label class="form-check-label" for="sale-only-toggle" data-v-53193a45>Chỉ hiển thị sản phẩm giảm giá</label></div></div></div></div><div class="col-12 col-xxl-9 px-3" data-v-53193a45><button class="btn btn-outline-secondary d-block d-xxl-none mb-3" data-v-53193a45><img src="https://cdn-icons-png.flaticon.com/128/7094/7094575.png" width="20" height="20" alt="Filter" class="me-2" data-v-53193a45> Bộ lọc </button><div class="products-header d-flex justify-content-between align-items-center mb-4" data-v-53193a45><div class="results-count" data-v-53193a45>`);
  if ($data.loading) {
    _push(`<div data-v-53193a45>Đang tải sản phẩm...</div>`);
  } else {
    _push(`<div data-v-53193a45>Hiển thị ${ssrInterpolate($data.totalRecords || $data.products.length)} sản phẩm</div>`);
  }
  _push(`</div><div class="sort-options" data-v-53193a45><select class="form-select" data-v-53193a45><option value="newest" data-v-53193a45${ssrIncludeBooleanAttr(Array.isArray($data.sortOption) ? ssrLooseContain($data.sortOption, "newest") : ssrLooseEqual($data.sortOption, "newest")) ? " selected" : ""}>Mới nhất</option><option value="name" data-v-53193a45${ssrIncludeBooleanAttr(Array.isArray($data.sortOption) ? ssrLooseContain($data.sortOption, "name") : ssrLooseEqual($data.sortOption, "name")) ? " selected" : ""}>Tên A-Z</option><option value="popular" data-v-53193a45${ssrIncludeBooleanAttr(Array.isArray($data.sortOption) ? ssrLooseContain($data.sortOption, "popular") : ssrLooseEqual($data.sortOption, "popular")) ? " selected" : ""}>Phổ biến nhất</option></select></div></div>`);
  if ($data.loading) {
    _push(`<div class="row" data-v-53193a45><!--[-->`);
    ssrRenderList(12, (i) => {
      _push(`<div class="col-md-3 mb-3 col-sm-6 col-6" data-v-53193a45><div class="card h-100 skeleton-card" data-v-53193a45><div class="skeleton-img" data-v-53193a45></div><div class="card-body" data-v-53193a45><div class="skeleton-title" data-v-53193a45></div><div class="skeleton-text" data-v-53193a45></div><div class="skeleton-button" data-v-53193a45></div></div></div></div>`);
    });
    _push(`<!--]--></div>`);
  } else {
    _push(`<div data-v-53193a45>`);
    if ($data.products.length === 0) {
      _push(`<div class="no-products-alert" data-v-53193a45><div class="no-products-icon" data-v-53193a45><i class="fi fi-br-search-alt" data-v-53193a45></i></div><h5 data-v-53193a45>Chưa có sản phẩm phù hợp</h5><p data-v-53193a45>Vui lòng điều chỉnh bộ lọc hoặc thử lại với lựa chọn khác.</p><button class="reset-filter-btn" data-v-53193a45>Đặt lại bộ lọc</button></div>`);
    } else {
      _push(`<div class="row g-3" data-v-53193a45><!--[-->`);
      ssrRenderList($options.sortedProducts, (product) => {
        _push(`<div class="col-6 col-md-4 col-lg-3 col-xxl-3" data-v-53193a45><div class="card h-100" data-v-53193a45><div class="image-wrapper" data-v-53193a45>`);
        if (product.isSale) {
          _push(`<span class="sale-badge" data-v-53193a45>Sale</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<img${ssrRenderAttrs(_temp0 = mergeProps({
          class: "card-img-top main-img",
          alt: product.name,
          "data-product-id": product.id,
          loading: "lazy"
        }, ssrGetDirectiveProps(_ctx, _directive_lazy, product.image)))} data-v-53193a45>${"textContent" in _temp0 ? ssrInterpolate(_temp0.textContent) : _temp0.innerHTML ?? ""}<div class="image-loading-overlay" style="${ssrRenderStyle(!$data.imageLoaded[product.id] ? null : { display: "none" })}" data-v-53193a45><div class="image-skeleton-shimmer" data-v-53193a45></div></div></div><div class="card-body" data-v-53193a45><h5 class="card-title" data-v-53193a45>${ssrInterpolate(product.name)}</h5><p class="card-text" data-v-53193a45>Mã: ${ssrInterpolate(product.itemCode)}</p><div class="price-block" data-v-53193a45>`);
        if ($data.isLoggedIn) {
          _push(`<!--[-->`);
          if (product.priceSale !== null || product.priceBase !== null) {
            _push(`<!--[-->`);
            if (product.isSale && product.priceSale !== null) {
              _push(`<span class="price-sale" data-v-53193a45>${ssrInterpolate($options.formatPrice(product.priceSale))}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (product.priceBase !== null) {
              _push(`<span class="${ssrRenderClass(["price-base", { "text-decoration-line-through": product.isSale && product.priceSale !== null }])}" data-v-53193a45>${ssrInterpolate($options.formatPrice(product.priceBase))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          } else {
            _push(`<span class="price-contact" data-v-53193a45>Liên hệ</span>`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<span class="price-contact login-required" data-v-53193a45>Đăng nhập để xem giá</span>`);
        }
        _push(`</div>`);
        _push(ssrRenderComponent(_component_router_link, {
          class: "btn btn-primary",
          to: { name: "product-detail", params: { id: product.itemCode || product.id } }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Xem chi tiết `);
            } else {
              return [
                createTextVNode(" Xem chi tiết ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]--></div>`);
    }
    _push(`</div>`);
  }
  if ($data.products.length) {
    _push(`<nav class="mt-4" data-v-53193a45><ul class="pagination justify-content-center custom-pagination" data-v-53193a45><li class="${ssrRenderClass([{ disabled: $data.currentPage === 1 }, "page-item"])}" data-v-53193a45><a class="page-link" href="#" data-v-53193a45><i class="fi fi-br-angle-left" data-v-53193a45></i></a></li><!--[-->`);
    ssrRenderList($options.visiblePages, (page) => {
      _push(`<li class="${ssrRenderClass([{ active: $data.currentPage === page, ellipsis: page === "..." }, "page-item"])}" data-v-53193a45>`);
      if (page !== "...") {
        _push(`<a class="page-link" href="#" data-v-53193a45>${ssrInterpolate(page)}</a>`);
      } else {
        _push(`<span class="page-link" data-v-53193a45>...</span>`);
      }
      _push(`</li>`);
    });
    _push(`<!--]--><li class="${ssrRenderClass([{ disabled: $data.currentPage === $options.totalPages }, "page-item"])}" data-v-53193a45><a class="page-link" href="#" data-v-53193a45><i class="fi fi-br-angle-right" data-v-53193a45></i></a></li></ul></nav>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
  if ($data.showMobileFilter) {
    _push(`<div class="mobile-filter-overlay" data-v-53193a45><div class="mobile-filter-content" data-v-53193a45><button class="btn btn-danger mb-3" data-v-53193a45>Đóng</button><div class="filters-section" data-v-53193a45><div class="filters-header d-flex justify-content-between align-items-center mb-3" data-v-53193a45><h3 class="mb-0" data-v-53193a45>Bộ lọc</h3>`);
    if ($options.hasActiveFilters) {
      _push(`<button type="button" class="reset-filter-btn" data-v-53193a45> Xóa bộ lọc </button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div><div class="filter-group mb-4" data-v-53193a45><h4 data-v-53193a45>Danh mục sản phẩm</h4><div class="category-tabs" data-v-53193a45><!--[-->`);
    ssrRenderList($data.filters.categories, (category) => {
      _push(`<button type="button" class="${ssrRenderClass([{ active: $data.activeCategoryId === category.id }, "category-tab"])}" data-v-53193a45><div class="category-tab-image" data-v-53193a45><img${ssrRenderAttr("src", category.image)}${ssrRenderAttr("alt", category.name)} loading="lazy" data-v-53193a45></div><div class="category-tab-title" data-v-53193a45>${ssrInterpolate(category.name)}</div></button>`);
    });
    _push(`<!--]--></div></div>`);
    if ($options.displayedCategories.length) {
      _push(`<div class="filter-group mb-4 sub-category-panel" data-v-53193a45><h5 data-v-53193a45>Danh mục nổi bật</h5><div class="sub-category-list" data-v-53193a45><!--[-->`);
      ssrRenderList($options.displayedCategories, (category) => {
        _push(`<button type="button" class="${ssrRenderClass([{
          active: $data.selectedCategoryId === category.id,
          "span-2": $options.shouldSpanCategory(category.name)
        }, "sub-category-pill"])}" data-v-53193a45>${ssrInterpolate(category.name)}</button>`);
      });
      _push(`<!--]-->`);
      if ($options.categoryHasMore) {
        _push(`<button type="button" class="sub-category-more" data-v-53193a45><i class="${ssrRenderClass([$options.isCategoryExpanded ? "fi-br-minus-small" : "fi-br-plus-small", "fi"])}" data-v-53193a45></i> ${ssrInterpolate($options.isCategoryExpanded ? "Thu gọn" : "Xem thêm")}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    } else {
      _push(`<!---->`);
    }
    if ($options.isTileCategory && $options.displayedCollections.length) {
      _push(`<div class="filter-group mb-4 sub-category-panel" data-v-53193a45><h5 data-v-53193a45>Bộ sưu tập nổi bật</h5><div class="sub-category-list" data-v-53193a45><!--[-->`);
      ssrRenderList($options.displayedCollections, (child) => {
        _push(`<button type="button" class="${ssrRenderClass([{ active: $data.selectedCollectionId === child.id }, "sub-category-pill"])}" data-v-53193a45>${ssrInterpolate(child.name)}</button>`);
      });
      _push(`<!--]-->`);
      if ($options.collectionHasMore) {
        _push(`<button type="button" class="sub-category-more" data-v-53193a45><i class="${ssrRenderClass([$options.isCollectionExpanded ? "fi-br-minus-small" : "fi-br-plus-small", "fi"])}" data-v-53193a45></i> ${ssrInterpolate($options.isCollectionExpanded ? "Thu gọn" : "Xem thêm")}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    } else {
      _push(`<!---->`);
    }
    if ($options.displayedColors.length) {
      _push(`<div class="filter-group mb-4 sub-category-panel" data-v-53193a45><h5 data-v-53193a45>Bảng màu gợi ý</h5><div class="filter-chip-list" data-v-53193a45><!--[-->`);
      ssrRenderList($options.displayedColors, (color) => {
        _push(`<button type="button" class="${ssrRenderClass([{ active: $data.selectedColorId === color.id }, "filter-chip color-chip"])}" data-v-53193a45><span class="color-swatch" style="${ssrRenderStyle({ backgroundColor: color.swatch })}" data-v-53193a45></span><span data-v-53193a45>${ssrInterpolate(color.name)}</span></button>`);
      });
      _push(`<!--]-->`);
      if ($options.colorHasMore) {
        _push(`<button type="button" class="sub-category-more" data-v-53193a45><i class="${ssrRenderClass([$options.isColorExpanded ? "fi-br-minus-small" : "fi-br-plus-small", "fi"])}" data-v-53193a45></i> ${ssrInterpolate($options.isColorExpanded ? "Thu gọn" : "Xem thêm")}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    } else {
      _push(`<!---->`);
    }
    if ($options.displayedSizes.length) {
      _push(`<div class="filter-group mb-4 sub-category-panel" data-v-53193a45><h5 data-v-53193a45>Kích thước phổ biến</h5><div class="filter-chip-list" data-v-53193a45><!--[-->`);
      ssrRenderList($options.displayedSizes, (size) => {
        _push(`<button type="button" class="${ssrRenderClass([{ active: $data.selectedSizeId === size.id }, "filter-chip size-chip"])}" data-v-53193a45><span class="size-label" data-v-53193a45>${ssrInterpolate(size.name)}</span></button>`);
      });
      _push(`<!--]-->`);
      if ($options.sizeHasMore) {
        _push(`<button type="button" class="sub-category-more" data-v-53193a45><i class="${ssrRenderClass([$options.isSizeExpanded ? "fi-br-minus-small" : "fi-br-plus-small", "fi"])}" data-v-53193a45></i> ${ssrInterpolate($options.isSizeExpanded ? "Thu gọn" : "Xem thêm")}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="filter-group mb-4 sub-category-panel price-filter-group" data-v-53193a45><h5 data-v-53193a45>Khoảng giá (VND)</h5><div class="price-inputs" data-v-53193a45><input type="number" class="form-control" placeholder="Từ" min="0"${ssrRenderAttr("value", $data.priceInputs.from)} data-v-53193a45><span class="price-separator" data-v-53193a45>-</span><input type="number" class="form-control" placeholder="Đến" min="0"${ssrRenderAttr("value", $data.priceInputs.to)} data-v-53193a45></div><div class="d-flex justify-content-between align-items-center mt-2" data-v-53193a45><button class="btn btn-outline-primary flex-grow-1 me-2" data-v-53193a45>Áp dụng</button><div class="form-check form-switch sale-toggle m-0" data-v-53193a45><input class="form-check-input" type="checkbox" id="sale-only-toggle-mobile"${ssrIncludeBooleanAttr(Array.isArray($data.saleOnly) ? ssrLooseContain($data.saleOnly, null) : $data.saleOnly) ? " checked" : ""} data-v-53193a45><label class="form-check-label" for="sale-only-toggle-mobile" data-v-53193a45>Sale</label></div></div></div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/Catalog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Catalog = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-53193a45"]]);
export {
  Catalog as default
};
