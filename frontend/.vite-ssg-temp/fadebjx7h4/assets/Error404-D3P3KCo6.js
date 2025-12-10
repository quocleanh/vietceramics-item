import { resolveComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "../main.mjs";
import "hookable";
import "vue-router";
import "vue-toastification";
import "axios";
import "qrcode.vue";
import "bootstrap-vue-3";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_router_link = resolveComponent("router-link");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "error-page" }, _attrs))} data-v-9fb2645e><div class="error-emoji" data-v-9fb2645e>(｡•́︿•̀｡)</div><div class="error-code" data-v-9fb2645e>404</div><div class="error-title" data-v-9fb2645e>Không tìm thấy trang</div><div class="error-desc" data-v-9fb2645e>Oops! Trang bạn tìm kiếm không tồn tại hoặc đã bị xoá.<br data-v-9fb2645e>Hãy về trang chủ để tiếp tục khám phá nhé!</div>`);
  _push(ssrRenderComponent(_component_router_link, {
    to: "/",
    class: "error-btn"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Về trang chủ`);
      } else {
        return [
          createTextVNode("Về trang chủ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/Error404.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Error404 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-9fb2645e"]]);
export {
  Error404 as default
};
