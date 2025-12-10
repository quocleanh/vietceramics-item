import { mergeProps, ref, onMounted, useSSRContext } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import axios from "axios";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderDynamicModel, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _export_sfc } from "../main.mjs";
import "hookable";
import "qrcode.vue";
import "bootstrap-vue-3";
const authEndpoint = "https://api.vietceramics.com/api/v1/GetUserBFO";
const privateKey = "+es6!Tb{ZGxQqN5@F}MiwL1y3Sz(7$AhnfUJltKOa4)0RjdoP8WcCpIvV=[2Y9Dk%";
const _sfc_main = {
  name: "Login",
  setup() {
    const router = useRouter();
    const toast = useToast();
    const username = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const loading = ref(false);
    const error = ref("");
    const errors = ref({
      username: "",
      password: ""
    });
    onMounted(() => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          router.push({ path: "/" });
        } catch (err) {
          console.error("Navigation error:", err);
          window.location.href = "/";
        }
      }
    });
    const validateForm = () => {
      let isValid = true;
      errors.value = {
        username: "",
        password: ""
      };
      if (!username.value) {
        errors.value.username = "Vui lòng nhập tên đăng nhập";
        isValid = false;
      }
      if (!password.value) {
        errors.value.password = "Vui lòng nhập mật khẩu";
        isValid = false;
      }
      return isValid;
    };
    const handleLogin = async (e) => {
      var _a, _b;
      e.preventDefault();
      if (!validateForm()) return;
      loading.value = true;
      error.value = "";
      try {
        const response = await axios.get(authEndpoint, {
          params: {
            privateKey,
            username: username.value,
            password: password.value
          },
          headers: {
            Accept: "*/*"
          },
          withCredentials: false
        });
        const payload = response.data || {};
        if (payload.error) {
          throw new Error(payload.error);
        }
        const userName = payload.userName || payload.username;
        const name = payload.name || payload.fullName || userName;
        const enabled = String(payload.enabled || "").toLowerCase() === "true";
        if (!userName || !enabled) {
          throw new Error("Tên đăng nhập hoặc trạng thái tài khoản không hợp lệ");
        }
        const userData = {
          username: userName,
          name,
          enabled,
          token: userName,
          raw: payload,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString()
        };
        try {
          localStorage.setItem("user", JSON.stringify(userData));
          window.dispatchEvent(new CustomEvent("user-logged-in", { detail: userData }));
        } catch (storageErr) {
          console.warn("Storage not available, session will not persist:", storageErr);
        }
        toast.success("Đăng nhập thành công!", {
          timeout: 3e3,
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
        });
        setTimeout(() => {
          try {
            const previousPath = localStorage.getItem("previousPath") || "/";
            router.replace(previousPath);
            localStorage.removeItem("previousPath");
          } catch (err) {
            console.error("Navigation error:", err);
            window.location.href = "/";
          }
        }, 600);
      } catch (err) {
        const serverMsg = ((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.error) || (err == null ? void 0 : err.message);
        error.value = serverMsg || "Có lỗi xảy ra, vui lòng thử lại";
        toast.error(error.value, {
          timeout: 3e3,
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
        });
        console.error("Login error:", err);
      } finally {
        loading.value = false;
      }
    };
    return {
      username,
      password,
      showPassword,
      loading,
      error,
      errors,
      handleLogin
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-page" }, _attrs))} data-v-1118e335><div class="login-container" data-v-1118e335><div class="login-header" data-v-1118e335><h2 data-v-1118e335>Đăng nhập</h2></div><form class="login-form" data-v-1118e335><div class="form-group" data-v-1118e335><label for="username" data-v-1118e335>Tên đăng nhập</label><input type="text" id="username"${ssrRenderAttr("value", $setup.username)} class="${ssrRenderClass([{ "is-invalid": $setup.errors.username }, "form-control"])}" placeholder="Nhập tên đăng nhập" data-v-1118e335>`);
  if ($setup.errors.username) {
    _push(`<div class="invalid-feedback" data-v-1118e335>${ssrInterpolate($setup.errors.username)}</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="form-group" data-v-1118e335><label for="password" data-v-1118e335>Mật khẩu</label><div class="password-input" data-v-1118e335><input${ssrRenderAttr("type", $setup.showPassword ? "text" : "password")} id="password"${ssrRenderDynamicModel($setup.showPassword ? "text" : "password", $setup.password, null)} class="${ssrRenderClass([{ "is-invalid": $setup.errors.password }, "form-control"])}" placeholder="Nhập mật khẩu" data-v-1118e335><button type="button" class="toggle-password" data-v-1118e335><i class="${ssrRenderClass($setup.showPassword ? "fi fi-br-eye-crossed" : "fi fi-br-eye")}" data-v-1118e335></i></button></div>`);
  if ($setup.errors.password) {
    _push(`<div class="invalid-feedback" data-v-1118e335>${ssrInterpolate($setup.errors.password)}</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="form-group" data-v-1118e335><button type="submit" class="btn-login"${ssrIncludeBooleanAttr($setup.loading) ? " disabled" : ""} data-v-1118e335>`);
  if ($setup.loading) {
    _push(`<span class="spinner-border spinner-border-sm me-2" data-v-1118e335></span>`);
  } else {
    _push(`<!---->`);
  }
  _push(` ${ssrInterpolate($setup.loading ? "Đang đăng nhập..." : "Đăng nhập")}</button></div>`);
  if ($setup.error) {
    _push(`<div class="alert alert-danger" role="alert" data-v-1118e335>${ssrInterpolate($setup.error)}</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</form></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Login = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-1118e335"]]);
export {
  Login as default
};
