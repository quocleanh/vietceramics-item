import { Fancybox } from "@fancyapps/ui";
import { useToast } from "vue-toastification";
import { p as productService } from "./productService-DiWauF2M.js";
import { _ as _export_sfc, u as updateSeoMeta } from "../main.mjs";
import { resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderList, ssrLooseContain } from "vue/server-renderer";
import "axios";
import "hookable";
import "vue-router";
import "qrcode.vue";
import "bootstrap-vue-3";
const _sfc_main = {
  name: "ProductDetail",
  setup() {
    const toast = useToast();
    updateSeoMeta({
      title: "Vietceramics | Chi tiết sản phẩm",
      description: "Đang tải thông tin sản phẩm chính hãng từ Vietceramics.",
      type: "product"
    });
    return { toast };
  },
  data() {
    return {
      currentImageIndex: 0,
      currentImageType: "product",
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
      zoomedImage: "",
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
      slideDirection: "",
      // 'left' hoặc 'right'
      isSliding: false,
      touchStartY: 0,
      touchEndY: 0,
      isDraggingDown: false,
      dragOffset: 0,
      backgroundOpacity: 0.95,
      // Thêm opacity cho background
      imageLoading: true,
      thumbLoaded: {},
      // Danh sách nhãn muốn ẩn khỏi phần thông số
      hiddenLabels: [
        "Ngày tạo",
        "Ngày sửa",
        "Người tạo",
        "Người sửa",
        "Ngừng theo dõi",
        "Dùng chung",
        "Bố cục",
        "Theo dõi theo mã quy cách",
        "Đơn giá bán 1",
        "Đơn giá bán 2",
        "Đơn giá bán cố định",
        "Đơn giá chi phí",
        "Giá bán là đơn giá sau thuế",
        "Chủ sở hữu",
        "Tên hàng hóa",
        "Tên hàng hóa",
        "Thuế GTGT",
        "Thuế GTGT",
        "Đơn giá mua",
        "Đơn vị",
        "Đơn giá bán",
        "Ngầm định ghi nhận DS trước thuế",
        "Diễn giải khi bán",
        "Diễn giải khi bán",
        "Nguồn gốc",
        "Mã Hàng NCU",
        "Loại Bán Hàng",
        //'Hiển Thị Công Năng In Tem',
        "Trọng Lượng/DVT Chính",
        "Hướng Dẫn Sử Dụng",
        "Hướng Dẫn Bảo Quản",
        "Hướng Dẫn Vận Chuyển",
        "Tính chất",
        "",
        ""
      ]
    };
  },
  computed: {
    // Tổng hợp tất cả hình ảnh từ các nguồn
    allImages() {
      var _a, _b;
      const mainImages = this.images && this.images.length ? this.images : ((_a = this.product) == null ? void 0 : _a.images) || [];
      const realImages = this.images_real && this.images_real.length ? this.images_real : ((_b = this.product) == null ? void 0 : _b.images_real) || [];
      return [
        ...mainImages,
        ...this.images_perspective || [],
        ...realImages
      ];
    },
    hasProductImages() {
      var _a, _b;
      return this.images && this.images.length || ((_b = (_a = this.product) == null ? void 0 : _a.images) == null ? void 0 : _b.length);
    },
    hasPerspectiveImages() {
      return this.images_perspective && this.images_perspective.length;
    },
    hasRealImages() {
      var _a, _b;
      return this.images_real && this.images_real.length || ((_b = (_a = this.product) == null ? void 0 : _a.images_real) == null ? void 0 : _b.length);
    },
    availableImageTypes() {
      const types = [];
      if (this.hasProductImages) types.push("product");
      if (this.hasPerspectiveImages) types.push("perspective");
      if (this.hasRealImages) types.push("real");
      return types;
    },
    // Lấy hình ảnh hiện tại đang hiển thị
    currentImage() {
      return this.allImages[this.currentImageIndex] || "";
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
      var _a, _b;
      return ((_b = (_a = this.product) == null ? void 0 : _a.comboItems) == null ? void 0 : _b.filter((item) => item.selected)) || [];
    },
    // Tính tổng giá combo
    selectedComboTotal() {
      if (!this.product) return "0đ";
      const comboItems = this.product.comboItems || [];
      const mainProductPrice = this.product.displayPriceValue ?? 0;
      const comboItemsTotal = comboItems.filter((item) => item.selected).reduce((sum, item) => sum + this.parsePrice(item.price), 0);
      return this.formatPrice(mainProductPrice + comboItemsTotal);
    },
    // Tính số tiền tiết kiệm khi mua combo
    selectedComboSave() {
      if (!this.product) return "0đ";
      const comboItems = this.product.comboItems || [];
      const comboItemsSelected = comboItems.filter((item) => item.selected);
      const mainProductOriginalPrice = this.product.priceBaseValue ?? this.product.displayPriceValue ?? 0;
      const comboItemsOriginalTotal = comboItemsSelected.reduce((sum, item) => sum + this.parsePrice(item.originalPrice), 0);
      const comboItemsSelectedTotal = comboItemsSelected.reduce((sum, item) => sum + this.parsePrice(item.price), 0);
      const totalOriginal = mainProductOriginalPrice + comboItemsOriginalTotal;
      const total = (this.product.displayPriceValue ?? 0) + comboItemsSelectedTotal;
      const save = totalOriginal - total;
      return this.formatPrice(save > 0 ? save : 0);
    },
    // Kiểm tra trạng thái đăng nhập
    isLoggedIn() {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          return new Date(parsedUser.expiresAt) > /* @__PURE__ */ new Date();
        } catch (e) {
          return false;
        }
      }
      return false;
    },
    hasLotPrices() {
      var _a;
      return Array.isArray((_a = this.product) == null ? void 0 : _a.lotPrices) && this.product.lotPrices.length > 0;
    },
    showBrandPublic() {
      var _a;
      const type = (((_a = this.product) == null ? void 0 : _a.productType) || "").toLowerCase();
      const isSanitary = type.includes("thiết bị vệ sinh") || type === "bath";
      return isSanitary || this.isLoggedIn;
    },
    certificateItems() {
      var _a;
      const specs = ((_a = this.product) == null ? void 0 : _a.specifications) || {};
      const placeholder = "Đang cập nhật";
      const getValue = (keys) => {
        const keyArr = Array.isArray(keys) ? keys : [keys];
        for (const key of keyArr) {
          const raw = specs[key];
          if (raw !== void 0 && raw !== null) {
            const str = String(raw).trim();
            return str || placeholder;
          }
        }
        return placeholder;
      };
      return [
        {
          label: "Công Nghệ Bề Mặt",
          value: getValue(["Công Nghệ Bề Mặt", "Công nghệ bề mặt"]),
          icon: "fi-br-layer-plus"
        },
        {
          label: "Chứng chỉ môi trường",
          value: getValue(["Chứng chỉ môi trường"]),
          icon: "fi-br-leaf"
        },
        {
          label: "Công nghệ chống trượt",
          value: getValue(["Chống Trượt", "Công nghệ chống trượt"]),
          icon: "fi-br-shield-check"
        }
      ];
    }
  },
  methods: {
    isProductLineField(key) {
      return String(key || "").trim().toLowerCase() === "dòng sản phẩm";
    },
    isPlaceholderValue(value) {
      const str = String(value || "").trim().toLowerCase();
      return !str || str === "đang cập nhật" || str === "dang cap nhat" || str === "liên hệ" || str === "lien he";
    },
    getCatalogLinkForValue(value) {
      var _a, _b, _c;
      const query = { collection: value };
      const productType = ((_b = (_a = this.product) == null ? void 0 : _a.specifications) == null ? void 0 : _b["Loại sản phẩm"]) || ((_c = this.product) == null ? void 0 : _c.productType);
      if (productType) {
        query.productType = productType;
      }
      return { name: "catalog", query };
    },
    getImageCounts() {
      var _a, _b, _c, _d;
      const mainCount = this.images && this.images.length ? this.images.length : ((_b = (_a = this.product) == null ? void 0 : _a.images) == null ? void 0 : _b.length) || 0;
      const perspectiveCount = this.images_perspective && this.images_perspective.length ? this.images_perspective.length : 0;
      const realCount = this.images_real && this.images_real.length ? this.images_real.length : ((_d = (_c = this.product) == null ? void 0 : _c.images_real) == null ? void 0 : _d.length) || 0;
      return { mainCount, perspectiveCount, realCount };
    },
    getStartIndexForType(type) {
      const { mainCount, perspectiveCount } = this.getImageCounts();
      if (type === "product") return 0;
      if (type === "perspective") return mainCount;
      return mainCount + perspectiveCount;
    },
    async loadImages() {
      var _a, _b, _c, _d, _e;
      try {
        const productCode = ((_a = this.product) == null ? void 0 : _a.itemCode) || ((_b = this.product) == null ? void 0 : _b.No_) || this.$route.params.id;
        const [productImages, perspectiveImages, realImages] = await Promise.all([
          productService.getProductImages(productCode, "product", (_c = this.product) == null ? void 0 : _c.collectionName),
          productService.getProductImages(productCode, "perspective", (_d = this.product) == null ? void 0 : _d.collectionName),
          productService.getProductImages(productCode, "real", (_e = this.product) == null ? void 0 : _e.collectionName)
        ]);
        this.images = productImages && productImages.length ? productImages : [];
        this.images_perspective = perspectiveImages && perspectiveImages.length ? perspectiveImages : [];
        this.images_real = realImages && realImages.length ? realImages : [];
        if (!this.images.length && !this.images_perspective.length && !this.images_real.length) {
          const productName = "";
          const line1 = productName;
          const line2 = "KHÔNG CÓ HÌNH ẢNH";
          const line3 = "VUI LÒNG LIÊN HỆ QC ";
          const placeholderText = encodeURIComponent(
            `${line1}
${line2}
${line3}`
          );
          this.images = [
            `https://placehold.co/600x600/971b1e/white?text=${placeholderText}&font=Roboto`
          ];
        }
        this.currentImageIndex = 0;
        const availableTypes = this.availableImageTypes;
        if (!availableTypes.includes(this.currentImageType)) {
          this.currentImageType = availableTypes[0] || "product";
        }
        this.currentImageIndex = this.getStartIndexForType(this.currentImageType);
        this.imageLoading = true;
        this.thumbLoaded = {};
        this.$nextTick(() => this.updateThumbArrows());
      } catch (error) {
        console.error("Error loading images:", error);
        this.toast.error("Không thể tải hình ảnh sản phẩm");
      }
    },
    async fetchProduct() {
      this.loading = true;
      this.error = null;
      try {
        this.product = await productService.getProductDetail(this.$route.params.id);
        this.showLotPrice = this.hasLotPrices;
        await this.loadImages();
        this.applyProductSeo();
      } catch (error) {
        console.error("Error fetching product:", error);
        this.error = "Không thể tải thông tin sản phẩm";
        this.toast.error(this.error);
        updateSeoMeta({
          title: "Vietceramics | Không tìm thấy sản phẩm",
          description: "Sản phẩm có thể đã bị gỡ hoặc không còn được phân phối.",
          type: "product"
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
          if (thumbLeft < scrollLeft || thumbLeft + thumbWidth > scrollLeft + containerWidth) {
            container.scrollTo({
              left: thumbLeft - containerWidth / 2 + thumbWidth / 2,
              behavior: "smooth"
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
      if (!this.isLoggedIn) {
        this.toast.error("Vui lòng đăng nhập để thêm sản phẩm vào báo giá", {
          // ... cấu hình toast
        });
        return;
      }
      let quoteItems = JSON.parse(localStorage.getItem("quoteItems") || "[]");
      const existingItem = quoteItems.find((item) => item.id === this.product.id);
      if (existingItem) {
        this.toast.info("Sản phẩm đã có trong danh sách báo giá");
        return;
      }
      quoteItems.push({
        id: this.product.id,
        name: this.product.name,
        code: this.product.itemCode,
        price: this.product.price,
        image: this.images[0] || this.product.images && this.product.images[0] || "",
        quantity: 1
      });
      localStorage.setItem("quoteItems", JSON.stringify(quoteItems));
      this.toast.success("Đã thêm sản phẩm vào danh sách báo giá");
    },
    // Chuyển đến trang đăng nhập
    goToLogin() {
      localStorage.setItem("redirect_after_login", this.$route.fullPath);
      this.$router.push("/login");
    },
    // Navigate image with previous/next buttons
    navigateImage(direction) {
      if (direction === "prev" && this.currentImageIndex > 0) {
        this.slideDirection = "right";
        this.currentImageIndex--;
      } else if (direction === "next" && this.currentImageIndex < this.allImages.length - 1) {
        this.slideDirection = "left";
        this.currentImageIndex++;
      }
      if (this.showZoomModal) {
        this.isSliding = true;
        this.zoomedImage = this.allImages[this.currentImageIndex];
        this.zoomLevel = 1;
        this.dragX = 0;
        this.dragY = 0;
        this.lastX = 0;
        this.lastY = 0;
        setTimeout(() => {
          this.isSliding = false;
          this.slideDirection = "";
        }, 300);
      }
      this.scrollActiveThumbIntoView();
    },
    // Update thumbnail arrows visibility
    updateThumbArrows() {
      if (!this.$refs.thumbnails) return;
      const container = this.$refs.thumbnails;
      this.showLeftArrow = container.scrollLeft > 0;
      this.showRightArrow = container.scrollLeft < container.scrollWidth - container.clientWidth - 5;
    },
    // Scroll thumbnails
    scrollThumbnails(direction) {
      if (!this.$refs.thumbnails) return;
      const container = this.$refs.thumbnails;
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    },
    // Handle keyboard navigation
    handleKeyNavigation(event) {
      if (event.key === "ArrowLeft") {
        this.navigateImage("prev");
      } else if (event.key === "ArrowRight") {
        this.navigateImage("next");
      }
    },
    openCustomModal() {
      try {
        this.isHovering = false;
        const imageToShow = this.currentImage;
        if (true) {
          this.zoomedImage = imageToShow;
          this.showZoomModal = true;
          this.zoomLevel = 1;
          this.dragX = 0;
          this.dragY = 0;
          this.lastX = 0;
          this.lastY = 0;
          this.isDragging = false;
          return;
        }
        Fancybox.show([{ src: imageToShow }], {
          animated: false,
          dragToClose: false,
          Image: { zoom: true }
        });
      } catch (error) {
        console.error("Lỗi khi mở ảnh phóng to:", error);
        window.open(this.currentImage, "_blank");
      }
    },
    closeZoomModal() {
      const modal = document.querySelector(".custom-zoom-modal");
      if (modal) {
        modal.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
        modal.style.transform = "translateY(100%)";
        modal.style.opacity = "0";
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
        this.backgroundOpacity = 0.95;
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
      const delta = event.deltaY * -1e-3;
      const newZoom = this.zoomLevel + delta;
      this.zoomLevel = Math.min(3, Math.max(0.5, newZoom));
    },
    startDrag(event) {
      if (this.zoomLevel <= 1) return;
      this.isDragging = true;
      const clientX = event.clientX || event.touches && event.touches[0].clientX;
      const clientY = event.clientY || event.touches && event.touches[0].clientY;
      this.startX = clientX - this.lastX;
      this.startY = clientY - this.lastY;
      event.preventDefault();
    },
    onDrag(event) {
      if (!this.isDragging || this.zoomLevel <= 1) return;
      const clientX = event.clientX || event.touches && event.touches[0].clientX;
      const clientY = event.clientY || event.touches && event.touches[0].clientY;
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
        const imageUrl = this.zoomedImage;
        const fileName = this.product ? `${this.product.itemCode || "product"}.jpg` : "product-image.jpg";
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(blobUrl);
            }, 100);
          }, "image/jpeg", 0.95);
        };
        img.onerror = () => {
          this.toast.error("Không thể tải ảnh. Vui lòng thử lại.");
        };
        img.src = imageUrl;
      } catch (error) {
        console.error("Lỗi khi tải ảnh:", error);
        this.toast.error("Không thể tải ảnh. Vui lòng thử lại.");
      }
    },
    handleImageHover(event) {
      if (window.innerWidth <= 768) return;
      if (!this.isHovering) return;
      const rect = event.target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * 100;
      const y = (event.clientY - rect.top) / rect.height * 100;
      this.hoverX = x;
      this.hoverY = y;
    },
    getHoverStyle() {
      if (window.innerWidth <= 768) return {};
      if (!this.isHovering) return {};
      return {
        objectPosition: `${this.hoverX}% ${this.hoverY}%`,
        transition: "object-position 0.05s ease-out"
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
      const deltaY = this.touchEndY - this.touchStartY;
      if (deltaY > 50) {
        this.isDraggingDown = true;
        this.dragOffset = Math.min(deltaY * 0.5, 300);
        const maxDrag = 300;
        const opacityRange = 0.95 - 0.3;
        const opacity = 0.95 - this.dragOffset / maxDrag * opacityRange;
        this.backgroundOpacity = Math.max(0.3, opacity);
        event.preventDefault();
      }
    },
    handleTouchEnd() {
      if (!this.isSwiping || this.zoomLevel > 1) return;
      const deltaX = this.touchEndX - this.touchStartX;
      const deltaY = this.touchEndY - this.touchStartY;
      const minSwipeDistance = 50;
      if (this.isDraggingDown && deltaY > 100) {
        this.closeZoomModal();
        return;
      }
      this.isDraggingDown = false;
      this.dragOffset = 0;
      this.backgroundOpacity = 0.95;
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < 50) {
        if (deltaX > 0) {
          this.slideDirection = "right";
          this.navigateImage("prev");
        } else {
          this.slideDirection = "left";
          this.navigateImage("next");
        }
      }
      this.isSwiping = false;
      this.touchStartX = 0;
      this.touchEndX = 0;
      this.touchStartY = 0;
      this.touchEndY = 0;
    },
    parsePrice(value) {
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const numeric = Number(value.replace(/[^\d.-]/g, ""));
        return Number.isNaN(numeric) ? 0 : numeric;
      }
      return 0;
    },
    formatPrice(value) {
      const number = Number(value);
      if (!number || Number.isNaN(number) || number <= 0) {
        return "Liên hệ";
      }
      return number.toLocaleString("vi-VN") + "đ";
    },
    handleMainImageLoad() {
      this.imageLoading = false;
    },
    handleThumbLoad(index) {
      this.thumbLoaded = { ...this.thumbLoaded, [index]: true };
    },
    applyProductSeo() {
      var _a, _b;
      if (!this.product) return;
      const collectionName = this.product.collectionName || this.product.productType || "Vietceramics";
      const specColor = (_a = this.product.specifications) == null ? void 0 : _a["Màu sắc"];
      const specSize = (_b = this.product.specifications) == null ? void 0 : _b["Kích thước"];
      const featureHighlights = [
        this.product.productType,
        collectionName,
        specColor,
        specSize
      ].filter(Boolean).join(", ");
      const description = this.product.shortDescription || `Khám phá ${this.product.name} (mã ${this.product.itemCode}) - ${collectionName} chính hãng tại Vietceramics.`;
      const metaImage = this.images[0] || this.images_perspective[0] || this.images_real[0] || null;
      updateSeoMeta({
        title: `${this.product.name} | Vietceramics`,
        description,
        keywords: `Vietceramics,${featureHighlights}`,
        image: metaImage,
        url: window.location.href,
        type: "product"
      });
    }
  },
  // Lifecycle hooks
  mounted() {
    this.fetchProduct();
    window.addEventListener("keydown", this.handleKeyNavigation);
  },
  watch: {
    currentImage() {
      this.imageLoading = true;
    }
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyNavigation);
    if (typeof Fancybox !== "undefined") {
      Fancybox.close();
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  if ($data.product) {
    _push(`<div${ssrRenderAttrs(mergeProps({ class: "product-detail py-4" }, _attrs))} data-v-957a6d5d><nav class="breadcrumb-nav mb-4" data-v-957a6d5d><ol class="breadcrumb" data-v-957a6d5d><li class="breadcrumb-item" data-v-957a6d5d>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`Trang chủ`);
        } else {
          return [
            createTextVNode("Trang chủ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</li><li class="breadcrumb-item" data-v-957a6d5d>`);
    _push(ssrRenderComponent(_component_router_link, {
      to: { name: "catalog", query: { productType: $data.product.specifications["Loại sản phẩm"] } }
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate($data.product.specifications["Loại sản phẩm"])}`);
        } else {
          return [
            createTextVNode(toDisplayString($data.product.specifications["Loại sản phẩm"]), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</li><li class="breadcrumb-item active" aria-current="page" data-v-957a6d5d>${ssrInterpolate($data.product.name)}</li></ol></nav><div class="row" data-v-957a6d5d><div class="col-md-6 mb-4" data-v-957a6d5d><div class="gallery-wrapper" data-v-957a6d5d><div class="main-image mb-3 position-relative" data-v-957a6d5d><div class="image-type-overlay" data-v-957a6d5d><div class="image-type-buttons" data-v-957a6d5d>`);
    if ($options.hasProductImages) {
      _push(`<button class="${ssrRenderClass([{ active: $data.currentImageType === "product" }, "type-btn"])}" data-v-957a6d5d><i class="fi fi-br-box" data-v-957a6d5d></i><span data-v-957a6d5d>Hình sản phẩm</span></button>`);
    } else {
      _push(`<!---->`);
    }
    if ($options.hasPerspectiveImages) {
      _push(`<button class="${ssrRenderClass([{ active: $data.currentImageType === "perspective" }, "type-btn"])}" data-v-957a6d5d><i class="fi fi-br-layout-fluid" data-v-957a6d5d></i><span data-v-957a6d5d>Hình phối cảnh</span></button>`);
    } else {
      _push(`<!---->`);
    }
    if ($options.hasRealImages) {
      _push(`<button class="${ssrRenderClass([{ active: $data.currentImageType === "real" }, "type-btn"])}" data-v-957a6d5d><i class="fi fi-br-camera" data-v-957a6d5d></i><span data-v-957a6d5d>Hình thực tế</span></button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div>`);
    if ($data.imageLoading) {
      _push(`<div class="main-image-skeleton" data-v-957a6d5d></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<img${ssrRenderAttr("src", $options.currentImage)}${ssrRenderAttr("alt", $data.product.name)} style="${ssrRenderStyle($options.getHoverStyle())}" class="${ssrRenderClass([{ "img-loading": $data.imageLoading }, "img-fluid main-img"])}" data-v-957a6d5d><div class="zoom-indicator" data-v-957a6d5d><i class="fi fi-br-zoom-in" data-v-957a6d5d></i><span data-v-957a6d5d>Click để phóng to</span></div>`);
    if ($options.allImages.length > 1) {
      _push(`<button class="nav-btn prev-btn"${ssrIncludeBooleanAttr($data.currentImageIndex === 0) ? " disabled" : ""} data-v-957a6d5d><i class="fi fi-br-angle-left" data-v-957a6d5d></i></button>`);
    } else {
      _push(`<!---->`);
    }
    if ($options.allImages.length > 1) {
      _push(`<button class="nav-btn next-btn"${ssrIncludeBooleanAttr($data.currentImageIndex === $options.allImages.length - 1) ? " disabled" : ""} data-v-957a6d5d><i class="fi fi-br-angle-right" data-v-957a6d5d></i></button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="thumbnails-wrapper" data-v-957a6d5d>`);
    if ($data.showLeftArrow) {
      _push(`<button class="thumb-nav thumb-nav-left" data-v-957a6d5d><i class="fi fi-br-angle-left" data-v-957a6d5d></i></button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="thumbnails d-flex justify-content-start gap-2" data-v-957a6d5d><!--[-->`);
    ssrRenderList($options.allImages, (image, index) => {
      _push(`<div class="${ssrRenderClass([{ active: index === $data.currentImageIndex }, "thumbnail-item"])}" data-v-957a6d5d>`);
      if (!$data.thumbLoaded[index]) {
        _push(`<div class="thumb-skeleton" data-v-957a6d5d></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<img${ssrRenderAttr("src", image)} class="img-fluid thumb-img"${ssrRenderAttr("alt", $data.product.name)} data-v-957a6d5d></div>`);
    });
    _push(`<!--]--></div>`);
    if ($data.showRightArrow) {
      _push(`<button class="thumb-nav thumb-nav-right" data-v-957a6d5d><i class="fi fi-br-angle-right" data-v-957a6d5d></i></button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div></div></div><div class="col-md-6 d-flex flex-column flex-start" data-v-957a6d5d><h1 class="product-name mb-2" data-v-957a6d5d>${ssrInterpolate($data.product.name)}</h1><div class="product-code mb-2" data-v-957a6d5d>Mã sản phẩm: <span data-v-957a6d5d>${ssrInterpolate($data.product.itemCode)}</span></div>`);
    if ($options.isLoggedIn) {
      _push(`<div class="product-price-wrapper mb-3" data-v-957a6d5d><div class="product-price" data-v-957a6d5d><div class="current-price" data-v-957a6d5d>${ssrInterpolate($options.formatPrice($data.product.displayPriceValue ?? 0))}</div>`);
      if ($data.product.isSale && $data.product.priceBaseValue !== null) {
        _push(`<div class="original-price" data-v-957a6d5d>${ssrInterpolate($options.formatPrice($data.product.priceBaseValue))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="price-note" data-v-957a6d5d>Giá áp dụng tại HCM, chưa bao gồm phí vận chuyển</div></div>`);
    } else {
      _push(`<div class="login-required-notice price-notice mb-3" data-v-957a6d5d><i class="fi fi-br-lock" data-v-957a6d5d></i><span data-v-957a6d5d>Vui lòng đăng nhập để xem giá</span></div>`);
    }
    _push(`<div class="favorite-btn-wrapper mb-4 d-flex flex-start" data-v-957a6d5d><button class="btn-add-to-quote" data-v-957a6d5d><i class="fi fi-br-file-invoice" data-v-957a6d5d></i><span data-v-957a6d5d>Thêm vào báo giá</span></button></div>`);
    if ($options.hasLotPrices) {
      _push(`<div class="lot-price-section mb-4" data-v-957a6d5d><div class="lot-price-header" data-v-957a6d5d><h3 class="section-title" data-v-957a6d5d>Giá theo lô</h3><i class="${ssrRenderClass([$data.showLotPrice ? "fi-br-angle-up" : "fi-br-angle-down", "fi"])}" data-v-957a6d5d></i></div>`);
      if ($data.showLotPrice) {
        _push(`<div class="lot-price-content" data-v-957a6d5d><div class="lot-price-table" data-v-957a6d5d><div class="lot-price-header" data-v-957a6d5d><div class="lot-code" data-v-957a6d5d>Mã lô</div><div class="lot-price" data-v-957a6d5d>Giá bán</div><div class="lot-status" data-v-957a6d5d>Trạng thái</div></div><div class="lot-price-body" data-v-957a6d5d><!--[-->`);
        ssrRenderList($data.product.lotPrices, (lot, index) => {
          _push(`<div class="lot-price-row" data-v-957a6d5d><div class="lot-code" data-v-957a6d5d>${ssrInterpolate(lot.code)}</div><div class="lot-price" data-v-957a6d5d>${ssrInterpolate(lot.price)}</div><div class="lot-status" data-v-957a6d5d><span class="${ssrRenderClass(["status-badge", lot.status === "available" ? "available" : "sold"])}" data-v-957a6d5d>${ssrInterpolate(lot.status === "available" ? "Còn hàng" : "Đã bán")}</span></div></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="additional-info" data-v-957a6d5d><div class="info-item" data-v-957a6d5d><i class="fi fi-br-category-alt" data-v-957a6d5d></i><div class="info-content" data-v-957a6d5d><div class="info-label" data-v-957a6d5d>Tên Nhóm VTHH</div><div class="info-value" data-v-957a6d5d>${ssrInterpolate($data.product.specifications["Tên Nhóm VTHH"])}</div></div></div><div class="info-item" data-v-957a6d5d><i class="fi fi-br-palette" data-v-957a6d5d></i><div class="info-content" data-v-957a6d5d><div class="info-label" data-v-957a6d5d>Màu sắc</div><div class="info-value" data-v-957a6d5d>${ssrInterpolate($data.product.specifications["Tên Màu Sắc"])}</div></div></div><div class="info-item" data-v-957a6d5d><i class="fi fi-br-ruler-combined" data-v-957a6d5d></i><div class="info-content" data-v-957a6d5d><div class="info-label" data-v-957a6d5d>Kích thước</div><div class="info-value" data-v-957a6d5d>${ssrInterpolate($data.product.specifications["Kích Thước Mô Phỏng"] || $data.product.specifications["Quy Cách"])}</div></div></div>`);
    if ($options.showBrandPublic) {
      _push(`<div class="info-item" data-v-957a6d5d><i class="fi fi-br-bookmark" data-v-957a6d5d></i><div class="info-content" data-v-957a6d5d><div class="info-label" data-v-957a6d5d>Thương hiệu</div><div class="info-value" data-v-957a6d5d>${ssrInterpolate($data.product.specifications["Thương hiệu"])}</div></div></div>`);
    } else {
      _push(`<div class="info-item login-required-notice" data-v-957a6d5d><i class="fi fi-br-lock" data-v-957a6d5d></i><div class="info-content" data-v-957a6d5d><div class="info-label" data-v-957a6d5d>Thương hiệu</div><div class="info-value" data-v-957a6d5d>Đăng nhập để xem thông tin</div></div></div>`);
    }
    _push(`</div>`);
    if ($options.certificateItems.length) {
      _push(`<div class="certificates" data-v-957a6d5d><!--[-->`);
      ssrRenderList($options.certificateItems, (cert, index) => {
        _push(`<div class="cert-item" data-v-957a6d5d>`);
        if (cert.icon) {
          _push(`<i class="${ssrRenderClass([cert.icon, "cert-icon fi"])}" data-v-957a6d5d></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="cert-label" data-v-957a6d5d><div class="cert-name" data-v-957a6d5d>${ssrInterpolate(cert.label)}</div><div class="cert-value" data-v-957a6d5d>${ssrInterpolate(cert.value)}</div></div></div>`);
      });
      _push(`<!--]--></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div>`);
    if ($data.product.productType === "bath" && $data.product.comboItems && $data.product.comboItems.length) {
      _push(`<div class="combo-section mt-5" data-v-957a6d5d><h3 class="section-title mb-4" data-v-957a6d5d>Combo tiết kiệm</h3><div class="combo-wrapper" data-v-957a6d5d><!--[-->`);
      ssrRenderList($data.product.comboItems, (item, index) => {
        _push(`<div class="combo-item" data-v-957a6d5d><div class="combo-image" data-v-957a6d5d><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="img-fluid" data-v-957a6d5d><div class="combo-discount" data-v-957a6d5d>${ssrInterpolate(item.discount)}</div></div><div class="combo-info" data-v-957a6d5d><div class="combo-name" data-v-957a6d5d>${ssrInterpolate(item.name)}</div><div class="combo-price-wrapper" data-v-957a6d5d><div class="combo-price" data-v-957a6d5d>${ssrInterpolate(item.price)}</div><div class="combo-original-price" data-v-957a6d5d>${ssrInterpolate(item.originalPrice)}</div></div><label class="combo-select" data-v-957a6d5d><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(item.selected) ? ssrLooseContain(item.selected, null) : item.selected) ? " checked" : ""} data-v-957a6d5d><span class="checkmark" data-v-957a6d5d></span><span class="select-label" data-v-957a6d5d>Thêm vào combo</span></label></div></div>`);
      });
      _push(`<!--]--><div class="combo-total" data-v-957a6d5d><div class="total-label" data-v-957a6d5d>Tổng giá trị</div><div class="total-price" data-v-957a6d5d>${ssrInterpolate($options.selectedComboTotal)}</div><div class="combo-save" data-v-957a6d5d>Tiết kiệm: ${ssrInterpolate($options.selectedComboSave)}</div></div></div></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="row mt-5" data-v-957a6d5d><div class="col-12" data-v-957a6d5d><h3 class="section-title mb-3" data-v-957a6d5d>Mô tả sản phẩm</h3><div class="long-description" data-v-957a6d5d>${ssrInterpolate($data.product.custom_field169)}</div></div></div><div class="row mt-5" data-v-957a6d5d><div class="col-12" data-v-957a6d5d><h3 class="section-title mb-3" data-v-957a6d5d>Thông số kỹ thuật</h3><div class="specs-table row" data-v-957a6d5d><!--[-->`);
    ssrRenderList($options.specsChunks, (chunk, i) => {
      _push(`<div class="col-md-6" data-v-957a6d5d><table class="table specs-table-inner" data-v-957a6d5d><tbody data-v-957a6d5d><!--[-->`);
      ssrRenderList(chunk, (value, key) => {
        _push(`<tr data-v-957a6d5d><td class="spec-key" data-v-957a6d5d>${ssrInterpolate(key)}</td><td class="spec-value" data-v-957a6d5d>`);
        if ($options.isProductLineField(key) && !$options.isPlaceholderValue(value)) {
          _push(ssrRenderComponent(_component_router_link, {
            to: $options.getCatalogLinkForValue(value)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(value)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(value), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<span data-v-957a6d5d>${ssrInterpolate(value)}</span>`);
        }
        _push(`</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
    });
    _push(`<!--]--></div></div></div>`);
    if ($data.showZoomModal) {
      _push(`<div class="custom-zoom-modal" style="${ssrRenderStyle({
        transform: $data.isDraggingDown ? `translateY(${$data.dragOffset}px)` : "none",
        background: `rgba(0, 0, 0, ${$data.backgroundOpacity})`
      })}" data-v-957a6d5d><div class="custom-zoom-container" data-v-957a6d5d><div class="custom-toolbar" data-v-957a6d5d><button class="toolbar-btn" data-v-957a6d5d><i class="fi fi-br-zoom-in" data-v-957a6d5d></i></button><button class="toolbar-btn" data-v-957a6d5d><i class="fi fi-br-zoom-out" data-v-957a6d5d></i></button><button class="toolbar-btn" data-v-957a6d5d><i class="fi fi-br-undo" data-v-957a6d5d></i></button><div class="toolbar-spacer" data-v-957a6d5d></div><button class="toolbar-btn" data-v-957a6d5d><i class="fi fi-br-download" data-v-957a6d5d></i></button><button class="toolbar-btn" data-v-957a6d5d><i class="fi fi-br-cross" data-v-957a6d5d></i></button></div><div class="zoom-image-wrapper" data-v-957a6d5d><img${ssrRenderAttr("src", $data.zoomedImage)} alt="Zoomed Image" class="${ssrRenderClass([{
        "slide-left": $data.slideDirection === "left" && $data.isSliding,
        "slide-right": $data.slideDirection === "right" && $data.isSliding
      }, "custom-zoomed-img"])}" style="${ssrRenderStyle({
        transform: `scale(${$data.zoomLevel}) translate(${$data.dragX}px, ${$data.dragY}px)`
      })}" data-v-957a6d5d>`);
      if ($options.allImages.length > 1) {
        _push(`<button class="zoom-nav-btn prev-btn"${ssrIncludeBooleanAttr($data.currentImageIndex === 0) ? " disabled" : ""} data-v-957a6d5d><i class="fi fi-br-angle-left" data-v-957a6d5d></i></button>`);
      } else {
        _push(`<!---->`);
      }
      if ($options.allImages.length > 1) {
        _push(`<button class="zoom-nav-btn next-btn"${ssrIncludeBooleanAttr($data.currentImageIndex === $options.allImages.length - 1) ? " disabled" : ""} data-v-957a6d5d><i class="fi fi-br-angle-right" data-v-957a6d5d></i></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="custom-thumbnails" data-v-957a6d5d><div class="thumbnails-container" data-v-957a6d5d><!--[-->`);
      ssrRenderList($options.allImages, (image, index) => {
        _push(`<div class="${ssrRenderClass([{ active: $data.zoomedImage === image }, "zoom-thumbnail-item"])}" data-v-957a6d5d><img${ssrRenderAttr("src", image)} class="zoom-thumb-img"${ssrRenderAttr("alt", $data.product.name)} data-v-957a6d5d></div>`);
      });
      _push(`<!--]--></div></div></div></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  } else if ($data.loading) {
    _push(`<div${ssrRenderAttrs(mergeProps({ class: "skeleton-wrapper" }, _attrs))} data-v-957a6d5d><div class="row" data-v-957a6d5d><div class="col-md-6 mb-4" data-v-957a6d5d><div class="skeleton skeleton-image mb-3" data-v-957a6d5d></div><div class="d-flex gap-2" data-v-957a6d5d><!--[-->`);
    ssrRenderList(4, (n) => {
      _push(`<div class="skeleton skeleton-thumb" data-v-957a6d5d></div>`);
    });
    _push(`<!--]--></div></div><div class="col-md-6" data-v-957a6d5d><div class="skeleton skeleton-title mb-3" data-v-957a6d5d></div><div class="skeleton skeleton-code mb-2" data-v-957a6d5d></div><div class="skeleton skeleton-price mb-2" data-v-957a6d5d></div><div class="skeleton skeleton-price-note mb-3" data-v-957a6d5d></div><div class="d-flex gap-2 mt-3" data-v-957a6d5d><!--[-->`);
    ssrRenderList(3, (n) => {
      _push(`<div class="skeleton skeleton-cert" data-v-957a6d5d></div>`);
    });
    _push(`<!--]--></div></div></div><div class="row mt-5" data-v-957a6d5d><div class="col-12" data-v-957a6d5d><div class="skeleton skeleton-section-title mb-3" data-v-957a6d5d></div><div class="skeleton skeleton-long-desc mb-3" data-v-957a6d5d></div></div></div><div class="row mt-5" data-v-957a6d5d><div class="col-12" data-v-957a6d5d><div class="skeleton skeleton-section-title mb-3" data-v-957a6d5d></div><!--[-->`);
    ssrRenderList(6, (n) => {
      _push(`<div class="skeleton skeleton-spec mb-2" data-v-957a6d5d></div>`);
    });
    _push(`<!--]--></div></div></div>`);
  } else if (!$data.product || !$data.product.name) {
    _push(`<div${ssrRenderAttrs(mergeProps({ class: "notfound-wrapper" }, _attrs))} data-v-957a6d5d><div class="notfound-icon mb-3" data-v-957a6d5d><i class="fi fi-br-search-alt" data-v-957a6d5d></i></div><div class="notfound-title mb-2" data-v-957a6d5d>Không tìm thấy nội dung sản phẩm</div><div class="notfound-desc mb-3" data-v-957a6d5d>Sản phẩm này có thể đã bị xoá hoặc không tồn tại. Vui lòng kiểm tra lại hoặc quay về trang chủ.</div><a href="/" class="notfound-btn" data-v-957a6d5d>Về trang chủ</a></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ProductDetail.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductDetail = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-957a6d5d"]]);
export {
  ProductDetail as default
};
