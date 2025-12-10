import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc, b as _imports_0 } from "../main.mjs";
import "hookable";
import "vue-router";
import "vue-toastification";
import "axios";
import "qrcode.vue";
import "bootstrap-vue-3";
const _sfc_main = {
  name: "SharedQuote",
  data() {
    return {
      products: [],
      loading: true
    };
  },
  created() {
    this.loadSharedProducts();
  },
  methods: {
    async loadSharedProducts() {
      try {
        const encodedData = this.$route.query.q;
        if (!encodedData) {
          this.loading = false;
          return;
        }
        const decodedData = JSON.parse(decodeURIComponent(encodedData));
        if (!Array.isArray(decodedData)) {
          this.loading = false;
          return;
        }
        this.products = decodedData;
      } catch (error) {
        console.error("Error loading shared products:", error);
      } finally {
        this.loading = false;
      }
    }
  },
  computed: {
    totalItems() {
      return this.products.length;
    },
    totalPrice() {
      return this.products.reduce((sum, product) => sum + product.price, 0);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "shared-quote-page container py-5" }, _attrs))} data-v-0458a328><div class="row" data-v-0458a328><div class="col-12" data-v-0458a328><div class="company-info mb-5" data-v-0458a328><div class="company-logo mb-3" data-v-0458a328><img${ssrRenderAttr("src", _imports_0)} alt="Vietceramics Logo" class="img-fluid" data-v-0458a328></div><h1 class="company-name" data-v-0458a328>Công Ty Cổ Phần Quốc Tế Gốm Sứ Việt</h1><div class="company-details" data-v-0458a328><div class="detail-item" data-v-0458a328><i class="fi fi-br-map-marker" data-v-0458a328></i><span data-v-0458a328>Địa chỉ: 778k/2 Nguyễn Kiệm, Phường 4, Quận Phú Nhuận, TP. HCM</span></div><div class="detail-item" data-v-0458a328><i class="fi fi-br-phone" data-v-0458a328></i><span data-v-0458a328>Điện thoại: +0797555299</span></div><div class="detail-item" data-v-0458a328><i class="fi fi-br-envelope" data-v-0458a328></i><span data-v-0458a328>Email: vietceramics@vietceramics.com.vn</span></div><div class="detail-item" data-v-0458a328><i class="fi fi-br-globe" data-v-0458a328></i><span data-v-0458a328>Website: www.vietceramics.com.vn</span></div></div></div><div class="shared-products" data-v-0458a328><h2 class="section-title mb-4" data-v-0458a328>Danh sách sản phẩm</h2>`);
  if ($data.loading) {
    _push(`<div class="loading-state text-center py-5" data-v-0458a328><div class="spinner-border text-primary" role="status" data-v-0458a328><span class="visually-hidden" data-v-0458a328>Loading...</span></div><p class="mt-3" data-v-0458a328>Đang tải danh sách sản phẩm...</p></div>`);
  } else if (!$data.products.length) {
    _push(`<div class="empty-state text-center py-5" data-v-0458a328><div class="empty-icon mb-3" data-v-0458a328><i class="fi fi-br-shopping-bag" data-v-0458a328></i></div><h3 class="empty-title mb-2" data-v-0458a328>Không tìm thấy sản phẩm</h3><p class="empty-desc mb-4" data-v-0458a328>Danh sách sản phẩm không tồn tại hoặc đã bị xóa.</p></div>`);
  } else {
    _push(`<div class="product-list" data-v-0458a328><!--[-->`);
    ssrRenderList($data.products, (product) => {
      _push(`<div class="product-item" data-v-0458a328><div class="product-image" data-v-0458a328><img${ssrRenderAttr("src", product.image)}${ssrRenderAttr("alt", product.name)} class="img-fluid" data-v-0458a328></div><div class="product-info" data-v-0458a328><h3 class="product-name" data-v-0458a328>${ssrInterpolate(product.name)}</h3><div class="product-code" data-v-0458a328>Mã: ${ssrInterpolate(product.code)}</div><div class="product-price" data-v-0458a328>${ssrInterpolate(product.price)}</div></div></div>`);
    });
    _push(`<!--]--></div>`);
  }
  _push(`<div class="quote-total mt-4" data-v-0458a328><div class="total-info" data-v-0458a328><span class="total-label" data-v-0458a328>Tổng cộng:</span><span class="total-value" data-v-0458a328>${ssrInterpolate($options.totalItems)} sản phẩm - ${ssrInterpolate($options.totalPrice)} VND</span></div></div></div><div class="contact-info mt-5" data-v-0458a328><h2 class="section-title mb-4" data-v-0458a328>Liên hệ tư vấn</h2><div class="contact-options" data-v-0458a328><a href="tel:02812345678" class="contact-option" data-v-0458a328><i class="fi fi-br-phone" data-v-0458a328></i><span data-v-0458a328>Gọi điện</span></a><a href="https://zalo.me/123456789" class="contact-option" data-v-0458a328><i class="fi fi-br-comment" data-v-0458a328></i><span data-v-0458a328>Zalo</span></a><a href="mailto:info@vietceramics.com" class="contact-option" data-v-0458a328><i class="fi fi-br-envelope" data-v-0458a328></i><span data-v-0458a328>Email</span></a></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/SharedQuote.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SharedQuote = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-0458a328"]]);
export {
  SharedQuote as default
};
