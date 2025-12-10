import { toValue, isRef, defineComponent, ref, onMounted, createSSRApp, useSSRContext, computed, onUnmounted, resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, nextTick } from "vue";
import { createHooks } from "hookable";
import { createRouter, createMemoryHistory, useRoute, useRouter } from "vue-router";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import Toast, { useToast } from "vue-toastification";
import axios from "axios";
import QrcodeVue from "qrcode.vue";
import { BootstrapVue3 } from "bootstrap-vue-3";
const DupeableTags = /* @__PURE__ */ new Set(["link", "style", "script", "noscript"]);
const TagsWithInnerContent = /* @__PURE__ */ new Set(["title", "titleTemplate", "script", "style", "noscript"]);
const ValidHeadTags = /* @__PURE__ */ new Set([
  "title",
  "base",
  "htmlAttrs",
  "bodyAttrs",
  "meta",
  "link",
  "style",
  "script",
  "noscript"
]);
const UniqueTags = /* @__PURE__ */ new Set(["base", "title", "titleTemplate", "bodyAttrs", "htmlAttrs", "templateParams"]);
const TagConfigKeys = /* @__PURE__ */ new Set(["key", "tagPosition", "tagPriority", "tagDuplicateStrategy", "innerHTML", "textContent", "processTemplateParams"]);
const UsesMergeStrategy = /* @__PURE__ */ new Set(["templateParams", "htmlAttrs", "bodyAttrs"]);
const MetaTagsArrayable = /* @__PURE__ */ new Set([
  "theme-color",
  "google-site-verification",
  "og",
  "article",
  "book",
  "profile",
  "twitter",
  "author"
]);
const allowedMetaProperties = ["name", "property", "http-equiv"];
const StandardSingleMetaTags = /* @__PURE__ */ new Set([
  "viewport",
  "description",
  "keywords",
  "robots"
]);
function isMetaArrayDupeKey(v) {
  const parts = v.split(":");
  if (!parts.length)
    return false;
  return MetaTagsArrayable.has(parts[1]);
}
function dedupeKey(tag) {
  const { props, tag: name } = tag;
  if (UniqueTags.has(name))
    return name;
  if (name === "link" && props.rel === "canonical")
    return "canonical";
  if (props.charset)
    return "charset";
  if (tag.tag === "meta") {
    for (const n of allowedMetaProperties) {
      if (props[n] !== void 0) {
        const propValue = props[n];
        const isStructured = propValue.includes(":");
        const isStandardSingle = StandardSingleMetaTags.has(propValue);
        const shouldAlwaysDedupe = isStructured || isStandardSingle;
        const keyPart = !shouldAlwaysDedupe && tag.key ? `:key:${tag.key}` : "";
        return `${name}:${propValue}${keyPart}`;
      }
    }
  }
  if (tag.key) {
    return `${name}:key:${tag.key}`;
  }
  if (props.id) {
    return `${name}:id:${props.id}`;
  }
  if (TagsWithInnerContent.has(name)) {
    const v = tag.textContent || tag.innerHTML;
    if (v) {
      return `${name}:content:${v}`;
    }
  }
}
function walkResolver(val, resolve, key) {
  const type = typeof val;
  if (type === "function") {
    if (!key || key !== "titleTemplate" && !(key[0] === "o" && key[1] === "n")) {
      val = val();
    }
  }
  let v;
  if (resolve) {
    v = resolve(key, val);
  }
  if (Array.isArray(v)) {
    return v.map((r) => walkResolver(r, resolve));
  }
  if ((v == null ? void 0 : v.constructor) === Object) {
    const next = {};
    for (const key2 of Object.keys(v)) {
      next[key2] = walkResolver(v[key2], resolve, key2);
    }
    return next;
  }
  return v;
}
function normalizeStyleClassProps(key, value) {
  const store = key === "style" ? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Set();
  function processValue(rawValue) {
    const value2 = rawValue.trim();
    if (!value2)
      return;
    if (key === "style") {
      const [k, ...v] = value2.split(":").map((s) => s.trim());
      if (k && v.length)
        store.set(k, v.join(":"));
    } else {
      value2.split(" ").filter(Boolean).forEach((c) => store.add(c));
    }
  }
  if (typeof value === "string") {
    key === "style" ? value.split(";").forEach(processValue) : processValue(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => processValue(item));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => {
      if (v && v !== "false") {
        key === "style" ? store.set(k.trim(), v) : processValue(k);
      }
    });
  }
  return store;
}
function normalizeProps(tag, input) {
  tag.props = tag.props || {};
  if (!input) {
    return tag;
  }
  if (tag.tag === "templateParams") {
    tag.props = input;
    return tag;
  }
  Object.entries(input).forEach(([key, value]) => {
    if (value === null) {
      tag.props[key] = null;
      return;
    }
    if (key === "class" || key === "style") {
      tag.props[key] = normalizeStyleClassProps(key, value);
      return;
    }
    if (TagConfigKeys.has(key)) {
      if (["textContent", "innerHTML"].includes(key) && typeof value === "object") {
        let type = input.type;
        if (!input.type) {
          type = "application/json";
        }
        if (!(type == null ? void 0 : type.endsWith("json")) && type !== "speculationrules") {
          return;
        }
        input.type = type;
        tag.props.type = type;
        tag[key] = JSON.stringify(value);
      } else {
        tag[key] = value;
      }
      return;
    }
    const strValue = String(value);
    const isDataKey = key.startsWith("data-");
    if (strValue === "true" || strValue === "") {
      tag.props[key] = isDataKey ? strValue : true;
    } else if (!value && isDataKey && strValue === "false") {
      tag.props[key] = "false";
    } else if (value !== void 0) {
      tag.props[key] = value;
    }
  });
  return tag;
}
function normalizeTag(tagName, _input) {
  const input = typeof _input === "object" && typeof _input !== "function" ? _input : { [tagName === "script" || tagName === "noscript" || tagName === "style" ? "innerHTML" : "textContent"]: _input };
  const tag = normalizeProps({ tag: tagName, props: {} }, input);
  if (tag.key && DupeableTags.has(tag.tag)) {
    tag.props["data-hid"] = tag._h = tag.key;
  }
  if (tag.tag === "script" && typeof tag.innerHTML === "object") {
    tag.innerHTML = JSON.stringify(tag.innerHTML);
    tag.props.type = tag.props.type || "application/json";
  }
  return Array.isArray(tag.props.content) ? tag.props.content.map((v) => ({ ...tag, props: { ...tag.props, content: v } })) : tag;
}
function normalizeEntryToTags(input, propResolvers) {
  if (!input) {
    return [];
  }
  if (typeof input === "function") {
    input = input();
  }
  const resolvers = (key, val) => {
    for (let i = 0; i < propResolvers.length; i++) {
      val = propResolvers[i](key, val);
    }
    return val;
  };
  input = resolvers(void 0, input);
  const tags = [];
  input = walkResolver(input, resolvers);
  Object.entries(input || {}).forEach(([key, value]) => {
    if (value === void 0)
      return;
    for (const v of Array.isArray(value) ? value : [value])
      tags.push(normalizeTag(key, v));
  });
  return tags.flat();
}
const sortTags = (a, b) => a._w === b._w ? a._p - b._p : a._w - b._w;
const TAG_WEIGHTS = {
  base: -10,
  title: 10
};
const TAG_ALIASES = {
  critical: -8,
  high: -1,
  low: 2
};
const WEIGHT_MAP = {
  meta: {
    "content-security-policy": -30,
    "charset": -20,
    "viewport": -15
  },
  link: {
    "preconnect": 20,
    "stylesheet": 60,
    "preload": 70,
    "modulepreload": 70,
    "prefetch": 90,
    "dns-prefetch": 90,
    "prerender": 90
  },
  script: {
    async: 30,
    defer: 80,
    sync: 50
  },
  style: {
    imported: 40,
    sync: 60
  }
};
const ImportStyleRe = /@import/;
const isTruthy = (val) => val === "" || val === true;
function tagWeight(head, tag) {
  var _a;
  if (typeof tag.tagPriority === "number")
    return tag.tagPriority;
  let weight = 100;
  const offset = TAG_ALIASES[tag.tagPriority] || 0;
  const weightMap = head.resolvedOptions.disableCapoSorting ? {
    link: {},
    script: {},
    style: {}
  } : WEIGHT_MAP;
  if (tag.tag in TAG_WEIGHTS) {
    weight = TAG_WEIGHTS[tag.tag];
  } else if (tag.tag === "meta") {
    const metaType = tag.props["http-equiv"] === "content-security-policy" ? "content-security-policy" : tag.props.charset ? "charset" : tag.props.name === "viewport" ? "viewport" : null;
    if (metaType)
      weight = WEIGHT_MAP.meta[metaType];
  } else if (tag.tag === "link" && tag.props.rel) {
    weight = weightMap.link[tag.props.rel];
  } else if (tag.tag === "script") {
    if (isTruthy(tag.props.async)) {
      weight = weightMap.script.async;
    } else if (tag.props.src && !isTruthy(tag.props.defer) && !isTruthy(tag.props.async) && tag.props.type !== "module" && !((_a = tag.props.type) == null ? void 0 : _a.endsWith("json"))) {
      weight = weightMap.script.sync;
    } else if (isTruthy(tag.props.defer) && tag.props.src && !isTruthy(tag.props.async)) {
      weight = weightMap.script.defer;
    }
  } else if (tag.tag === "style") {
    weight = tag.innerHTML && ImportStyleRe.test(tag.innerHTML) ? weightMap.style.imported : weightMap.style.sync;
  }
  return (weight || 100) + offset;
}
function registerPlugin(head, p) {
  const plugin = typeof p === "function" ? p(head) : p;
  const key = plugin.key || String(head.plugins.size + 1);
  const exists = head.plugins.get(key);
  if (!exists) {
    head.plugins.set(key, plugin);
    head.hooks.addHooks(plugin.hooks || {});
  }
}
// @__NO_SIDE_EFFECTS__
function createUnhead(resolvedOptions = {}) {
  var _a;
  const hooks = createHooks();
  hooks.addHooks(resolvedOptions.hooks || {});
  const ssr = !resolvedOptions.document;
  const entries = /* @__PURE__ */ new Map();
  const plugins = /* @__PURE__ */ new Map();
  const normalizeQueue = /* @__PURE__ */ new Set();
  const head = {
    _entryCount: 1,
    // 0 is reserved for internal use
    plugins,
    dirty: false,
    resolvedOptions,
    hooks,
    ssr,
    entries,
    headEntries() {
      return [...entries.values()];
    },
    use: (p) => registerPlugin(head, p),
    push(input, _options) {
      const options = { ..._options || {} };
      delete options.head;
      const _i = options._index ?? head._entryCount++;
      const inst = { _i, input, options };
      const _ = {
        _poll(rm = false) {
          head.dirty = true;
          !rm && normalizeQueue.add(_i);
          hooks.callHook("entries:updated", head);
        },
        dispose() {
          if (entries.delete(_i)) {
            head.invalidate();
          }
        },
        // a patch is the same as creating a new entry, just a nice DX
        patch(input2) {
          if (!options.mode || options.mode === "server" && ssr || options.mode === "client" && !ssr) {
            inst.input = input2;
            entries.set(_i, inst);
            _._poll();
          }
        }
      };
      _.patch(input);
      return _;
    },
    async resolveTags() {
      var _a2;
      const ctx = {
        tagMap: /* @__PURE__ */ new Map(),
        tags: [],
        entries: [...head.entries.values()]
      };
      await hooks.callHook("entries:resolve", ctx);
      while (normalizeQueue.size) {
        const i = normalizeQueue.values().next().value;
        normalizeQueue.delete(i);
        const e = entries.get(i);
        if (e) {
          const normalizeCtx = {
            tags: normalizeEntryToTags(e.input, resolvedOptions.propResolvers || []).map((t) => Object.assign(t, e.options)),
            entry: e
          };
          await hooks.callHook("entries:normalize", normalizeCtx);
          e._tags = normalizeCtx.tags.map((t, i2) => {
            t._w = tagWeight(head, t);
            t._p = (e._i << 10) + i2;
            t._d = dedupeKey(t);
            return t;
          });
        }
      }
      let hasFlatMeta = false;
      ctx.entries.flatMap((e) => (e._tags || []).map((t) => ({ ...t, props: { ...t.props } }))).sort(sortTags).reduce((acc, next) => {
        const k = String(next._d || next._p);
        if (!acc.has(k))
          return acc.set(k, next);
        const prev = acc.get(k);
        const strategy = (next == null ? void 0 : next.tagDuplicateStrategy) || (UsesMergeStrategy.has(next.tag) ? "merge" : null) || (next.key && next.key === prev.key ? "merge" : null);
        if (strategy === "merge") {
          const newProps = { ...prev.props };
          Object.entries(next.props).forEach(([p, v]) => (
            // @ts-expect-error untyped
            newProps[p] = p === "style" ? new Map([...prev.props.style || /* @__PURE__ */ new Map(), ...v]) : p === "class" ? /* @__PURE__ */ new Set([...prev.props.class || /* @__PURE__ */ new Set(), ...v]) : v
          ));
          acc.set(k, { ...next, props: newProps });
        } else if (next._p >> 10 === prev._p >> 10 && next.tag === "meta" && isMetaArrayDupeKey(k)) {
          acc.set(k, Object.assign([...Array.isArray(prev) ? prev : [prev], next], next));
          hasFlatMeta = true;
        } else if (next._w === prev._w ? next._p > prev._p : (next == null ? void 0 : next._w) < (prev == null ? void 0 : prev._w)) {
          acc.set(k, next);
        }
        return acc;
      }, ctx.tagMap);
      const title = ctx.tagMap.get("title");
      const titleTemplate = ctx.tagMap.get("titleTemplate");
      head._title = title == null ? void 0 : title.textContent;
      if (titleTemplate) {
        const titleTemplateFn = titleTemplate == null ? void 0 : titleTemplate.textContent;
        head._titleTemplate = titleTemplateFn;
        if (titleTemplateFn) {
          let newTitle = typeof titleTemplateFn === "function" ? titleTemplateFn(title == null ? void 0 : title.textContent) : titleTemplateFn;
          if (typeof newTitle === "string" && !head.plugins.has("template-params")) {
            newTitle = newTitle.replace("%s", (title == null ? void 0 : title.textContent) || "");
          }
          if (title) {
            newTitle === null ? ctx.tagMap.delete("title") : ctx.tagMap.set("title", { ...title, textContent: newTitle });
          } else {
            titleTemplate.tag = "title";
            titleTemplate.textContent = newTitle;
          }
        }
      }
      ctx.tags = Array.from(ctx.tagMap.values());
      if (hasFlatMeta) {
        ctx.tags = ctx.tags.flat().sort(sortTags);
      }
      await hooks.callHook("tags:beforeResolve", ctx);
      await hooks.callHook("tags:resolve", ctx);
      await hooks.callHook("tags:afterResolve", ctx);
      const finalTags = [];
      for (const t of ctx.tags) {
        const { innerHTML, tag, props } = t;
        if (!ValidHeadTags.has(tag)) {
          continue;
        }
        if (Object.keys(props).length === 0 && !t.innerHTML && !t.textContent) {
          continue;
        }
        if (tag === "meta" && !props.content && !props["http-equiv"] && !props.charset) {
          continue;
        }
        if (tag === "script" && innerHTML) {
          if ((_a2 = props.type) == null ? void 0 : _a2.endsWith("json")) {
            const v = typeof innerHTML === "string" ? innerHTML : JSON.stringify(innerHTML);
            t.innerHTML = v.replace(/</g, "\\u003C");
          } else if (typeof innerHTML === "string") {
            t.innerHTML = innerHTML.replace(new RegExp(`</${tag}`, "g"), `<\\/${tag}`);
          }
          t._d = dedupeKey(t);
        }
        finalTags.push(t);
      }
      return finalTags;
    },
    invalidate() {
      for (const entry of entries.values()) {
        normalizeQueue.add(entry._i);
      }
      head.dirty = true;
      hooks.callHook("entries:updated", head);
    }
  };
  ((resolvedOptions == null ? void 0 : resolvedOptions.plugins) || []).forEach((p) => registerPlugin(head, p));
  head.hooks.callHook("init", head);
  (_a = resolvedOptions.init) == null ? void 0 : _a.forEach((e) => e && head.push(e));
  return head;
}
const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};
const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}
// @__NO_SIDE_EFFECTS__
function createHead$1(options = {}) {
  const unhead = /* @__PURE__ */ createUnhead({
    ...options,
    // @ts-expect-error untyped
    document: false,
    propResolvers: [
      ...options.propResolvers || [],
      (k, v) => {
        if (k && k.startsWith("on") && typeof v === "function") {
          return `this.dataset.${k}fired = true`;
        }
        return v;
      }
    ],
    init: [
      options.disableDefaults ? void 0 : {
        htmlAttrs: {
          lang: "en"
        },
        meta: [
          {
            charset: "utf-8"
          },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
          }
        ]
      },
      ...options.init || []
    ]
  });
  unhead._ssrPayload = {};
  unhead.use({
    key: "server",
    hooks: {
      "tags:resolve": function(ctx) {
        const title = ctx.tagMap.get("title");
        const titleTemplate = ctx.tagMap.get("titleTemplate");
        let payload = {
          title: (title == null ? void 0 : title.mode) === "server" ? unhead._title : void 0,
          titleTemplate: (titleTemplate == null ? void 0 : titleTemplate.mode) === "server" ? unhead._titleTemplate : void 0
        };
        if (Object.keys(unhead._ssrPayload || {}).length > 0) {
          payload = {
            ...unhead._ssrPayload,
            ...payload
          };
        }
        if (Object.values(payload).some(Boolean)) {
          ctx.tags.push({
            tag: "script",
            innerHTML: JSON.stringify(payload),
            props: { id: "unhead:payload", type: "application/json" }
          });
        }
      }
    }
  });
  return unhead;
}
// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = /* @__PURE__ */ createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = /* @__PURE__ */ vueInstall(head);
  return head;
}
const ClientOnly = defineComponent({
  setup(props, { slots }) {
    const mounted = ref(false);
    onMounted(() => mounted.value = true);
    return () => {
      if (!mounted.value)
        return slots.placeholder && slots.placeholder({});
      return slots.default && slots.default({});
    };
  }
});
function ViteSSG(App, routerOptions, fn, options) {
  const {
    transformState,
    registerComponents = true,
    useHead = true,
    rootContainer = "#app"
  } = {};
  async function createApp$1(routePath) {
    const app = createSSRApp(App);
    let head;
    if (useHead) {
      app.use(head = /* @__PURE__ */ createHead());
    }
    const router = createRouter({
      history: createMemoryHistory(routerOptions.base),
      ...routerOptions
    });
    const { routes: routes2 } = routerOptions;
    if (registerComponents)
      app.component("ClientOnly", ClientOnly);
    const appRenderCallbacks = [];
    const onSSRAppRendered = (cb) => appRenderCallbacks.push(cb);
    const triggerOnSSRAppRendered = () => {
      return Promise.all(appRenderCallbacks.map((cb) => cb()));
    };
    const context = {
      app,
      head,
      isClient: false,
      router,
      routes: routes2,
      onSSRAppRendered,
      triggerOnSSRAppRendered,
      initialState: {},
      transformState,
      routePath
    };
    await (fn == null ? void 0 : fn(context));
    app.use(router);
    let entryRoutePath;
    let isFirstRoute = true;
    router.beforeEach((to, from, next) => {
      if (isFirstRoute || entryRoutePath && entryRoutePath === to.path) {
        isFirstRoute = false;
        entryRoutePath = to.path;
        to.meta.state = context.initialState;
      }
      next();
    });
    {
      const route = context.routePath ?? "/";
      router.push(route);
      await router.isReady();
      context.initialState = router.currentRoute.value.meta.state || {};
    }
    const initialState = context.initialState;
    return {
      ...context,
      initialState
    };
  }
  return createApp$1;
}
const _imports_0$1 = "/assets/logo-footer-DBZHOw0V.png";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$4 = {
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const isMenuOpen = ref(false);
    const userData = ref(null);
    const searchQuery = ref("");
    const searchResults = ref([]);
    const showResults = ref(false);
    const isSearching = ref(false);
    const showMobileSearch = ref(false);
    const isHomePage = computed(() => route.name === "home");
    const closeMenu = () => {
      isMenuOpen.value = false;
    };
    const checkLoginStatus = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          if (new Date(parsedUser.expiresAt) > /* @__PURE__ */ new Date()) {
            userData.value = parsedUser;
          } else {
            handleLogout();
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
          handleLogout();
        }
      } else {
        userData.value = null;
      }
    };
    const handleLogout = () => {
      localStorage.removeItem("user");
      userData.value = null;
      isMenuOpen.value = false;
      toast.success("Đăng xuất thành công!", {
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
      router.push("/");
    };
    const handleUserLogin = (event) => {
      if (event && event.detail) {
        userData.value = event.detail;
        isMenuOpen.value = false;
      }
    };
    const closeSearch = () => {
      showResults.value = false;
      searchQuery.value = "";
      searchResults.value = [];
    };
    onMounted(() => {
      checkLoginStatus();
      window.addEventListener("user-logged-in", handleUserLogin);
    });
    onUnmounted(() => {
      window.removeEventListener("user-logged-in", handleUserLogin);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      if (!isHomePage.value) {
        _push(`<header${ssrRenderAttrs(mergeProps({ class: "bg-danger" }, _attrs))} data-v-b61dba7d><div class="container" data-v-b61dba7d><nav class="d-none d-md-flex row align-items-center py-2" data-v-b61dba7d><div class="col-3" data-v-b61dba7d>`);
        _push(ssrRenderComponent(_component_router_link, {
          class: "navbar-brand",
          to: "/"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", _imports_0$1)} alt="Vietceramics" height="50" data-v-b61dba7d${_scopeId}>`);
            } else {
              return [
                createVNode("img", {
                  src: _imports_0$1,
                  alt: "Vietceramics",
                  height: "50"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="col-6" data-v-b61dba7d><div class="search-box position-relative" data-v-b61dba7d><div class="input-group" data-v-b61dba7d><input type="text" class="form-control rounded-start-pill" placeholder="Nhập mã sản phẩm..."${ssrRenderAttr("value", searchQuery.value)} data-v-b61dba7d><button class="btn btn-outline-light rounded-end-pill search-icon-btn" type="button" data-v-b61dba7d><i class="fi fi-br-search" data-v-b61dba7d></i></button></div>`);
        if (showResults.value || isSearching.value) {
          _push(`<div class="search-results" data-v-b61dba7d><div class="search-header d-flex justify-content-between align-items-center p-2" data-v-b61dba7d><span class="search-title" data-v-b61dba7d>Kết quả tìm kiếm</span><button class="btn-close" data-v-b61dba7d><i class="fi fi-br-cross" data-v-b61dba7d></i></button></div>`);
          if (isSearching.value) {
            _push(`<div class="search-loading" data-v-b61dba7d><div class="spinner" data-v-b61dba7d></div><span data-v-b61dba7d>Đang tìm kiếm...</span></div>`);
          } else if (searchResults.value.length === 0) {
            _push(`<div class="no-results" data-v-b61dba7d> Không tìm thấy kết quả </div>`);
          } else {
            _push(`<!--[-->`);
            ssrRenderList(searchResults.value, (item) => {
              _push(`<div class="search-item" data-v-b61dba7d><div class="d-flex" data-v-b61dba7d><div class="search-thumb-wrapper" data-v-b61dba7d><img${ssrRenderAttr("src", item.thumbnail)} class="search-thumb"${ssrRenderAttr("alt", item.name)} data-v-b61dba7d></div><div class="search-item-content" data-v-b61dba7d>`);
              _push(ssrRenderComponent(_component_router_link, {
                to: "/san-pham/" + item.id,
                class: "product-name",
                onClick: closeSearch
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(item.name)} - ${ssrInterpolate(item.itemCode)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.name) + " - " + toDisplayString(item.itemCode), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(`<div class="collection-name" data-v-b61dba7d>${ssrInterpolate(item.collectionName)}</div></div></div></div>`);
            });
            _push(`<!--]-->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="col-md-3 d-flex justify-content-end" data-v-b61dba7d><div class="header-buttons" data-v-b61dba7d>`);
        _push(ssrRenderComponent(_component_router_link, {
          class: "btn btn-outline-light me-2",
          to: "/quote-list"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fi fi-br-file-invoice me-2" data-v-b61dba7d${_scopeId}></i> Báo giá `);
            } else {
              return [
                createVNode("i", { class: "fi fi-br-file-invoice me-2" }),
                createTextVNode(" Báo giá ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (!userData.value) {
          _push(ssrRenderComponent(_component_router_link, {
            to: "/login",
            class: "btn-login"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="fi fi-br-user" data-v-b61dba7d${_scopeId}></i><span data-v-b61dba7d${_scopeId}>Đăng nhập</span>`);
              } else {
                return [
                  createVNode("i", { class: "fi fi-br-user" }),
                  createVNode("span", null, "Đăng nhập")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<div class="user-menu" data-v-b61dba7d><button class="btn-user" data-v-b61dba7d><i class="fi fi-br-user" data-v-b61dba7d></i><span class="d-none d-md-inline" data-v-b61dba7d>${ssrInterpolate(userData.value.name || userData.value.username)}</span></button>`);
          if (isMenuOpen.value) {
            _push(`<div class="dropdown-menu" data-v-b61dba7d>`);
            _push(ssrRenderComponent(_component_router_link, {
              class: "dropdown-item",
              to: "/profile",
              onClick: closeMenu
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<i class="fi fi-br-user" data-v-b61dba7d${_scopeId}></i><span data-v-b61dba7d${_scopeId}>Thông tin cá nhân</span>`);
                } else {
                  return [
                    createVNode("i", { class: "fi fi-br-user" }),
                    createVNode("span", null, "Thông tin cá nhân")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(ssrRenderComponent(_component_router_link, {
              class: "dropdown-item",
              to: "/orders",
              onClick: closeMenu
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<i class="fi fi-br-shopping-cart" data-v-b61dba7d${_scopeId}></i><span data-v-b61dba7d${_scopeId}>Đơn hàng</span>`);
                } else {
                  return [
                    createVNode("i", { class: "fi fi-br-shopping-cart" }),
                    createVNode("span", null, "Đơn hàng")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`<button class="dropdown-item logout-btn" data-v-b61dba7d><i class="fi fi-br-sign-out" data-v-b61dba7d></i><span data-v-b61dba7d>Đăng xuất</span></button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div></div></nav><nav class="d-flex d-md-none align-items-center py-2" data-v-b61dba7d><div class="col-2" data-v-b61dba7d><button class="btn btn-outline-light search-toggle-btn" data-v-b61dba7d><i class="fi fi-br-search" data-v-b61dba7d></i></button></div><div class="col-7 text-center" data-v-b61dba7d>`);
        _push(ssrRenderComponent(_component_router_link, {
          class: "navbar-brand",
          to: "/"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", _imports_0$1)} alt="Vietceramics" height="40" data-v-b61dba7d${_scopeId}>`);
            } else {
              return [
                createVNode("img", {
                  src: _imports_0$1,
                  alt: "Vietceramics",
                  height: "40"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="col-3 text-end d-flex justify-content-end gap-2" data-v-b61dba7d>`);
        _push(ssrRenderComponent(_component_router_link, {
          class: "btn btn-outline-light",
          to: "/quote-list"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fi fi-br-file-invoice" data-v-b61dba7d${_scopeId}></i>`);
            } else {
              return [
                createVNode("i", { class: "fi fi-br-file-invoice" })
              ];
            }
          }),
          _: 1
        }, _parent));
        if (!userData.value) {
          _push(ssrRenderComponent(_component_router_link, {
            to: "/login",
            class: "btn btn-outline-light"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="fi fi-br-user" data-v-b61dba7d${_scopeId}></i>`);
              } else {
                return [
                  createVNode("i", { class: "fi fi-br-user" })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<div class="user-menu" data-v-b61dba7d><button class="btn-user" data-v-b61dba7d><i class="fi fi-br-user" data-v-b61dba7d></i></button>`);
          if (isMenuOpen.value) {
            _push(`<div class="mobile-menu" data-v-b61dba7d><div class="mobile-menu-header" data-v-b61dba7d><div class="user-info" data-v-b61dba7d><i class="fi fi-br-user" data-v-b61dba7d></i><span data-v-b61dba7d>${ssrInterpolate(userData.value.name || userData.value.username)}</span></div><button class="close-btn" data-v-b61dba7d><i class="fi fi-br-cross" data-v-b61dba7d></i></button></div><div class="mobile-menu-content" data-v-b61dba7d>`);
            _push(ssrRenderComponent(_component_router_link, {
              class: "mobile-menu-item",
              to: "/profile",
              onClick: closeMenu
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<i class="fi fi-br-user" data-v-b61dba7d${_scopeId}></i><span data-v-b61dba7d${_scopeId}>Thông tin cá nhân</span>`);
                } else {
                  return [
                    createVNode("i", { class: "fi fi-br-user" }),
                    createVNode("span", null, "Thông tin cá nhân")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(ssrRenderComponent(_component_router_link, {
              class: "mobile-menu-item",
              to: "/orders",
              onClick: closeMenu
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<i class="fi fi-br-shopping-cart" data-v-b61dba7d${_scopeId}></i><span data-v-b61dba7d${_scopeId}>Đơn hàng</span>`);
                } else {
                  return [
                    createVNode("i", { class: "fi fi-br-shopping-cart" }),
                    createVNode("span", null, "Đơn hàng")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`<button class="mobile-menu-item logout-btn" data-v-b61dba7d><i class="fi fi-br-sign-out" data-v-b61dba7d></i><span data-v-b61dba7d>Đăng xuất</span></button></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (isMenuOpen.value) {
            _push(`<div class="menu-overlay" data-v-b61dba7d></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div></nav>`);
        if (showMobileSearch.value) {
          _push(`<div class="d-md-none mobile-search-box mt-2 pb-3" data-v-b61dba7d><div class="input-group" data-v-b61dba7d><input type="text" class="form-control rounded-start-pill" placeholder="Nhập mã sản phẩm..."${ssrRenderAttr("value", searchQuery.value)} data-v-b61dba7d><button class="btn btn-outline-light rounded-end-pill search-icon-btn" type="button" data-v-b61dba7d><i class="fi fi-br-search" data-v-b61dba7d></i></button></div>`);
          if (showResults.value || isSearching.value) {
            _push(`<div class="search-results" data-v-b61dba7d><div class="search-header d-flex justify-content-between align-items-center p-2" data-v-b61dba7d><span class="search-title" data-v-b61dba7d>Kết quả tìm kiếm</span><button class="btn-close" data-v-b61dba7d><i class="fi fi-br-cross" data-v-b61dba7d></i></button></div>`);
            if (isSearching.value) {
              _push(`<div class="search-loading" data-v-b61dba7d><div class="spinner" data-v-b61dba7d></div><span data-v-b61dba7d>Đang tìm kiếm...</span></div>`);
            } else if (searchResults.value.length === 0) {
              _push(`<div class="no-results" data-v-b61dba7d> Không tìm thấy kết quả </div>`);
            } else {
              _push(`<!--[-->`);
              ssrRenderList(searchResults.value, (item) => {
                _push(`<div class="search-item" data-v-b61dba7d><div class="d-flex" data-v-b61dba7d><div class="search-thumb-wrapper" data-v-b61dba7d><img${ssrRenderAttr("src", item.thumbnail)} class="search-thumb"${ssrRenderAttr("alt", item.name)} data-v-b61dba7d></div><div class="search-item-content" data-v-b61dba7d>`);
                _push(ssrRenderComponent(_component_router_link, {
                  to: "/san-pham/" + item.id,
                  class: "product-name",
                  onClick: closeSearch
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`${ssrInterpolate(item.name)} - ${ssrInterpolate(item.itemCode)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(item.name) + " - " + toDisplayString(item.itemCode), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
                _push(`<div class="collection-name" data-v-b61dba7d>${ssrInterpolate(item.collectionName)}</div></div></div></div>`);
              });
              _push(`<!--]-->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (showResults.value || isSearching.value) {
          _push(`<div class="search-overlay" data-v-b61dba7d></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Header.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-b61dba7d"]]);
const _sfc_main$3 = {
  name: "Footer"
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-2eece3ef><div class="footer-content" data-v-2eece3ef><div class="footer-section company-info" data-v-2eece3ef><div class="logo-wrapper" data-v-2eece3ef><img${ssrRenderAttr("src", _imports_0$1)} alt="Vet Ceramics Logo" class="footer-logo" data-v-2eece3ef></div><p class="company-description" data-v-2eece3ef> Công Ty Cổ phần Quốc Tế Gốm Sứ Việt. GPĐKKD: 0311028311 do sở KH &amp; ĐT TP.HCM cấp ngày 30/07/2011. Đăng ký thay đổi lần thứ 12 do Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh ngày 17/09/2014. </p><div class="contact-info" data-v-2eece3ef><div class="contact-item" data-v-2eece3ef><i class="fi fi-br-map-marker" data-v-2eece3ef></i><span data-v-2eece3ef>778K/2 Nguyễn Kiệm, Phường Đức Nhuận, TP.HCM, TP. HCM</span></div><div class="contact-item" data-v-2eece3ef><i class="fi fi-br-phone-call" data-v-2eece3ef></i><span data-v-2eece3ef>+0797555299</span></div><div class="contact-item" data-v-2eece3ef><i class="fi fi-br-envelope" data-v-2eece3ef></i><span data-v-2eece3ef>vietceramics@vietceramics.com.vn</span></div></div></div><div class="footer-section quick-links" data-v-2eece3ef><h3 class="section-title" data-v-2eece3ef>Liên kết nhanh</h3><ul class="link-list" data-v-2eece3ef><li data-v-2eece3ef>`);
  _push(ssrRenderComponent(_component_router_link, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<i class="fi fi-br-home" data-v-2eece3ef${_scopeId}></i> Trang chủ`);
      } else {
        return [
          createVNode("i", { class: "fi fi-br-home" }),
          createTextVNode(" Trang chủ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-2eece3ef>`);
  _push(ssrRenderComponent(_component_router_link, { to: "/products" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<i class="fi fi-br-box" data-v-2eece3ef${_scopeId}></i> Sản phẩm`);
      } else {
        return [
          createVNode("i", { class: "fi fi-br-box" }),
          createTextVNode(" Sản phẩm")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-2eece3ef>`);
  _push(ssrRenderComponent(_component_router_link, { to: "/about" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<i class="fi fi-br-info" data-v-2eece3ef${_scopeId}></i> Giới thiệu`);
      } else {
        return [
          createVNode("i", { class: "fi fi-br-info" }),
          createTextVNode(" Giới thiệu")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-2eece3ef>`);
  _push(ssrRenderComponent(_component_router_link, { to: "/contact" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<i class="fi fi-br-address-book" data-v-2eece3ef${_scopeId}></i> Liên hệ`);
      } else {
        return [
          createVNode("i", { class: "fi fi-br-address-book" }),
          createTextVNode(" Liên hệ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-2eece3ef>`);
  _push(ssrRenderComponent(_component_router_link, { to: "/quote-list" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<i class="fi fi-br-file-invoice" data-v-2eece3ef${_scopeId}></i> Báo giá`);
      } else {
        return [
          createVNode("i", { class: "fi fi-br-file-invoice" }),
          createTextVNode(" Báo giá")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></div><div class="footer-section product-categories" data-v-2eece3ef><h3 class="section-title" data-v-2eece3ef>Danh mục sản phẩm</h3><ul class="link-list" data-v-2eece3ef><li data-v-2eece3ef>`);
  _push(ssrRenderComponent(_component_router_link, { to: "/products/bath" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<i class="fi fi-br-bath" data-v-2eece3ef${_scopeId}></i> Thiết bị vệ sinh`);
      } else {
        return [
          createVNode("i", { class: "fi fi-br-bath" }),
          createTextVNode(" Thiết bị vệ sinh")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-2eece3ef>`);
  _push(ssrRenderComponent(_component_router_link, { to: "/products/tile" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<i class="fi fi-br-cube" data-v-2eece3ef${_scopeId}></i> Gạch ốp lát`);
      } else {
        return [
          createVNode("i", { class: "fi fi-br-cube" }),
          createTextVNode(" Gạch ốp lát")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-2eece3ef>`);
  _push(ssrRenderComponent(_component_router_link, { to: "/products/wood" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<i class="fi fi-br-tree" data-v-2eece3ef${_scopeId}></i> Gỗ công nghiệp`);
      } else {
        return [
          createVNode("i", { class: "fi fi-br-tree" }),
          createTextVNode(" Gỗ công nghiệp")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-2eece3ef>`);
  _push(ssrRenderComponent(_component_router_link, { to: "/products/accessories" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<i class="fi fi-br-tools" data-v-2eece3ef${_scopeId}></i> Phụ kiện`);
      } else {
        return [
          createVNode("i", { class: "fi fi-br-tools" }),
          createTextVNode(" Phụ kiện")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></div><div class="footer-section social-links" data-v-2eece3ef><h3 class="section-title" data-v-2eece3ef>Kết nối với chúng tôi</h3><div class="social-icons" data-v-2eece3ef><a href="https://www.facebook.com/vietceramics" target="_blank" class="social-icon facebook" data-v-2eece3ef><i class="fi fi-brands-facebook" data-v-2eece3ef></i></a><a href="https://www.instagram.com/vietceramics.official" target="_blank" class="social-icon instagram" data-v-2eece3ef><i class="fi fi-brands-instagram" data-v-2eece3ef></i></a><a href="https://www.youtube.com/vietceramics" target="_blank" class="social-icon youtube" data-v-2eece3ef><i class="fi fi-brands-youtube" data-v-2eece3ef></i></a><a href="https://www.linkedin.com/company/vietceramics" target="_blank" class="social-icon linkedin" data-v-2eece3ef><i class="fi fi-brands-linkedin" data-v-2eece3ef></i></a></div></div></div><div class="footer-bottom" data-v-2eece3ef><div class="footer-bottom-content" data-v-2eece3ef><div class="copyright" data-v-2eece3ef> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Vetceramics. All rights reserved. </div></div></div></footer>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Footer.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-2eece3ef"]]);
const _sfc_main$2 = {
  __name: "App",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_view = resolveComponent("router-view");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<div class="container-fuild"><main><div class="container">`);
      _push(ssrRenderComponent(_component_router_view, null, null, _parent));
      _push(`</div></main>`);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _imports_0 = "/assets/logo-vietceramics-BpMLLdRM.png";
const isDomReady = () => typeof window !== "undefined" && typeof document !== "undefined";
const resolveAbsoluteUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  try {
    return new URL(value, window.location.origin).href;
  } catch (error) {
    console.warn("Cannot resolve URL for SEO meta:", value, error);
    return value;
  }
};
const ensureMetaTag = (key, content, attribute = "name") => {
  if (!isDomReady()) return;
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content || "");
};
const ensureLinkTag = (rel, href) => {
  if (!isDomReady()) return;
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};
const updateSeoMeta = ({
  title,
  description = "Khám phá hệ sinh thái gạch ốp lát, thiết bị vệ sinh và Ván sàn cao cấp Vietceramics.",
  keywords = "Vietceramics,gạch cao cấp,thiết bị vệ sinh,Ván sàn",
  image,
  url,
  type = "website",
  siteName = "Vietceramics"
} = {}) => {
  if (!isDomReady()) return;
  const resolvedImage = resolveAbsoluteUrl(image || _imports_0);
  const resolvedUrl = resolveAbsoluteUrl(url || window.location.href);
  if (title) {
    document.title = title;
  }
  ensureMetaTag("description", description);
  ensureMetaTag("keywords", keywords);
  ensureMetaTag("og:title", title || siteName, "property");
  ensureMetaTag("og:description", description, "property");
  ensureMetaTag("og:image", resolvedImage, "property");
  ensureMetaTag("og:url", resolvedUrl, "property");
  ensureMetaTag("og:type", type, "property");
  ensureMetaTag("og:site_name", siteName, "property");
  ensureMetaTag("twitter:card", "summary_large_image");
  ensureMetaTag("twitter:title", title || siteName);
  ensureMetaTag("twitter:description", description);
  ensureMetaTag("twitter:image", resolvedImage);
  ensureLinkTag("canonical", resolvedUrl);
};
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
`;
const sizeOptions = rawSizeData.split("\n").map((item) => item.trim()).filter(Boolean).map((label) => ({
  id: label.toLowerCase(),
  name: label
}));
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
`;
const tileFeaturedNames = ["Gạch gốm ốp lát", "Gạch cắt", "Gạch men ốp tường"];
const featuredCategoryNames = rawFeaturedCategories.split("\n").map((item) => item.trim()).filter((name) => name && name.toLowerCase() !== "null");
const nonTileFeaturedNames = featuredCategoryNames.filter((name) => !tileFeaturedNames.includes(name));
const featuredCategoriesMap = {
  gach: tileFeaturedNames,
  "gạch": tileFeaturedNames,
  "gạch ốp lát": tileFeaturedNames,
  tbvs: nonTileFeaturedNames,
  "thiet bi ve sinh": nonTileFeaturedNames,
  "thiết bị vệ sinh": nonTileFeaturedNames,
  "san go": nonTileFeaturedNames,
  "Ván sàn": nonTileFeaturedNames
};
const normalizeKey = (value = "") => value.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const getSizeOptions = () => sizeOptions.map((size) => ({ ...size }));
const getFeaturedCategories = (productType) => {
  const key = normalizeKey(productType);
  const list = featuredCategoriesMap[key] || [];
  return list.map((name) => ({ id: name, name }));
};
const apiBaseUrl = "https://api.vietceramics.com/api";
const _sfc_main$1 = {
  name: "HomeView",
  data() {
    return {
      searchQuery: "",
      searchResults: [],
      showResults: false,
      isSearching: false,
      userData: null,
      showUserMenu: false,
      spaces: [
        {
          id: "pn",
          name: "Gạch ốp lát",
          productType: "gạch",
          image: "https://cdn-icons-gif.flaticon.com/10966/10966480.gif",
          description: "BST gạch ốp lát đa bề mặt, phù hợp mọi không gian.",
          gradient: "linear-gradient(135deg, #f5f7ff 0%, #dbe3ff 100%)"
        },
        {
          id: "tbvs",
          name: "Thiết bị vệ sinh",
          productType: "thiết bị vệ sinh",
          image: "https://cdn-icons-gif.flaticon.com/17091/17091858.gif",
          description: "Thiết bị phòng tắm cao cấp với thiết kế tinh gọn.",
          gradient: "linear-gradient(135deg, #fff5f2 0%, #ffe1d8 100%)"
        },
        {
          id: "kh",
          name: "Ván sàn",
          productType: "Ván sàn",
          image: "https://cdn-icons-png.flaticon.com/128/5848/5848426.png",
          description: "Ván sàn ấm áp, kết cấu chân thực cho không gian sống.",
          gradient: "linear-gradient(135deg, #f7f4ef 0%, #eadfce 100%)"
        }
      ],
      sizes: getSizeOptions(),
      // tái sử dụng danh sách kích thước từ bộ lọc danh mục
      sanitaryCategories: getFeaturedCategories("thiết bị vệ sinh")
    };
  },
  computed: {
    sizeChips() {
      return this.sizes;
    },
    sanitaryHighlights() {
      return this.sanitaryCategories.slice(0, 14);
    }
  },
  methods: {
    checkLoginStatus() {
      const user = localStorage.getItem("user");
      if (!user) {
        this.userData = null;
        return;
      }
      try {
        const parsed = JSON.parse(user);
        if (new Date(parsed.expiresAt) > /* @__PURE__ */ new Date()) {
          this.userData = parsed;
        } else {
          localStorage.removeItem("user");
          this.userData = null;
        }
      } catch (e) {
        console.error("parse user error", e);
        localStorage.removeItem("user");
        this.userData = null;
      }
    },
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    async handleSearch() {
      var _a;
      try {
        const keyword = this.searchQuery.trim();
        if (keyword.length > 0) {
          this.isSearching = true;
          const response = await axios.get(`${apiBaseUrl}/Products/Search`, {
            params: {
              keyword,
              pageIndex: 1,
              pageSize: 10
            }
          });
          const items = Array.isArray((_a = response.data) == null ? void 0 : _a.data) ? response.data.data : [];
          console.log("Search results:", items);
          this.searchResults = items.map((item) => ({
            id: item.id,
            product_code: item.product_code,
            product_name: item.product_name,
            product_category: item.product_category || "",
            collectionName: item.custom_field121 || item.product_category || item.custom_field68 || "Chưa phân loại",
            thumbnail: "https://static.superstone.com.vn/products-test/hinh-gach/" + item.product_code + ".jpg"
          }));
          this.showResults = true;
        } else {
          this.searchResults = [];
          this.showResults = false;
        }
      } catch (error) {
        console.error("Search error:", error);
        this.searchResults = [];
        this.showResults = true;
      } finally {
        this.isSearching = false;
      }
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    closeUserMenu() {
      this.showUserMenu = false;
    },
    buildCollectionLink(item) {
      const collection = (item == null ? void 0 : item.collectionName) || "";
      const categoryRaw = (item == null ? void 0 : item.product_category) || "";
      const isTile = categoryRaw.toLowerCase().includes("gạch");
      const query = {};
      if (isTile) {
        query.productType = "gạch";
      }
      if (collection) {
        query.collection = collection;
      }
      return { name: "catalog", query };
    },
    goToProduct(productCode) {
      if (!productCode) return;
      this.$router.push({ name: "product-detail", params: { id: productCode } });
    },
    handleLogout() {
      localStorage.removeItem("user");
      this.userData = null;
      this.showUserMenu = false;
      this.$router.push("/login");
    },
    applyHomeSeo() {
      var _a;
      const spaceLabels = this.spaces.map((space) => space.name).join(", ");
      updateSeoMeta({
        title: "Vietceramics | Không gian vật liệu cao cấp",
        description: `Khám phá ${spaceLabels} cùng hàng nghìn thiết kế gạch, thiết bị vệ sinh và Ván sàn chính hãng từ Vietceramics.`,
        keywords: `Vietceramics,${spaceLabels}`,
        image: (_a = this.spaces[0]) == null ? void 0 : _a.image
      });
    }
  },
  mounted() {
    document.addEventListener("click", this.closeUserMenu);
    this.applyHomeSeo();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeUserMenu);
  },
  created() {
    this.handleSearch = this.debounce(this.handleSearch, 300);
    this.checkLoginStatus();
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  _push(`<!--[--><div class="top-bar" data-v-a8de1510><div class="container top-bar-inner" data-v-a8de1510><div class="top-right-login" data-v-a8de1510>`);
  if (!$data.userData) {
    _push(ssrRenderComponent(_component_router_link, {
      to: "/login",
      class: "btn-login-top"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<i class="fi fi-br-user" data-v-a8de1510${_scopeId}></i><span data-v-a8de1510${_scopeId}>Đăng nhập</span>`);
        } else {
          return [
            createVNode("i", { class: "fi fi-br-user" }),
            createVNode("span", null, "Đăng nhập")
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(`<div class="user-pill" data-v-a8de1510><i class="fi fi-br-user" data-v-a8de1510></i><span data-v-a8de1510>${ssrInterpolate($data.userData.name || $data.userData.username)}</span><i class="fi fi-br-angle-down small-icon" data-v-a8de1510></i></div>`);
  }
  if ($data.showUserMenu) {
    _push(`<div class="home-user-menu" data-v-a8de1510><div class="home-user-menu-item" data-v-a8de1510><i class="fi fi-br-user" data-v-a8de1510></i><span data-v-a8de1510>${ssrInterpolate($data.userData.name || $data.userData.username)}</span></div>`);
    _push(ssrRenderComponent(_component_router_link, {
      class: "home-user-menu-item",
      to: "/quote-list",
      onClick: $options.closeUserMenu
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<i class="fi fi-br-file-invoice" data-v-a8de1510${_scopeId}></i><span data-v-a8de1510${_scopeId}>Báo giá của tôi</span>`);
        } else {
          return [
            createVNode("i", { class: "fi fi-br-file-invoice" }),
            createVNode("span", null, "Báo giá của tôi")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(ssrRenderComponent(_component_router_link, {
      class: "home-user-menu-item",
      to: "/profile",
      onClick: $options.closeUserMenu
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<i class="fi fi-br-settings" data-v-a8de1510${_scopeId}></i><span data-v-a8de1510${_scopeId}>Tài khoản</span>`);
        } else {
          return [
            createVNode("i", { class: "fi fi-br-settings" }),
            createVNode("span", null, "Tài khoản")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`<button class="home-user-menu-item logout-btn" data-v-a8de1510><i class="fi fi-br-sign-out" data-v-a8de1510></i><span data-v-a8de1510>Đăng xuất</span></button></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></div><div class="home" data-v-a8de1510><section class="hero" data-v-a8de1510><div class="container hero-grid" data-v-a8de1510><div class="hero-content" data-v-a8de1510><div class="hero-head" data-v-a8de1510><div class="logo-block" data-v-a8de1510><div class="logo-wrapper" data-v-a8de1510><img${ssrRenderAttr("src", _imports_0)} alt="Logo Vietceramics" class="logo" data-v-a8de1510></div><div class="logo-text" data-v-a8de1510><span class="eyebrow-pill logo-sub" data-v-a8de1510>item</span></div></div></div><h1 class="hero-title" data-v-a8de1510> Khơi cảm hứng cho mọi không gian </h1><p class="hero-lead" data-v-a8de1510> Tìm nhanh mã sản phẩm, bộ sưu tập và lọc theo nhu cầu thiết kế. </p><div class="search-box position-relative" data-v-a8de1510><div class="search-input-wrapper" data-v-a8de1510><i class="fi fi-br-search search-icon" data-v-a8de1510></i><input type="text" class="form-control search-input" placeholder="Nhập mã sản phẩm..."${ssrRenderAttr("value", $data.searchQuery)} data-v-a8de1510></div>`);
  if ($data.showResults || $data.isSearching) {
    _push(`<div class="search-results" data-v-a8de1510>`);
    if ($data.isSearching) {
      _push(`<div class="search-loading" data-v-a8de1510><div class="spinner" data-v-a8de1510></div><span data-v-a8de1510>Đang tìm kiếm...</span></div>`);
    } else if ($data.searchResults.length === 0) {
      _push(`<div class="no-results" data-v-a8de1510> Không tìm thấy kết quả </div>`);
    } else {
      _push(`<div class="search-items" data-v-a8de1510><!--[-->`);
      ssrRenderList($data.searchResults, (item) => {
        _push(`<div class="search-item" role="button" tabindex="0" data-v-a8de1510><div class="d-flex align-items-center" data-v-a8de1510><div class="search-thumb-wrapper" data-v-a8de1510><img${ssrRenderAttr("src", item.thumbnail)} class="search-thumb"${ssrRenderAttr("alt", item.name)} data-v-a8de1510></div><div class="search-item-content" data-v-a8de1510><span class="product-name" data-v-a8de1510>${ssrInterpolate(item.product_name)}</span><div class="collection-name" data-v-a8de1510>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: $options.buildCollectionLink(item),
          class: "collection-name",
          onClick: () => {
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Bộ sưu tập: ${ssrInterpolate(item.collectionName)}`);
            } else {
              return [
                createTextVNode(" Bộ sưu tập: " + toDisplayString(item.collectionName), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div><div class="search-item-icon" data-v-a8de1510><i class="fi fi-br-angle-right" data-v-a8de1510></i></div></div></div>`);
      });
      _push(`<!--]--></div>`);
    }
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="hero-showcase" data-v-a8de1510><!--[-->`);
  ssrRenderList($data.spaces, (space) => {
    _push(`<div class="spotlight-card" style="${ssrRenderStyle({ background: space.gradient })}" data-v-a8de1510><div class="spotlight-icon" data-v-a8de1510><img${ssrRenderAttr("src", space.image)}${ssrRenderAttr("alt", space.name)} class="space-image" data-v-a8de1510></div><div class="spotlight-body" data-v-a8de1510><p class="spotlight-eyebrow" data-v-a8de1510>Danh mục</p><h3 data-v-a8de1510>${ssrInterpolate(space.name)}</h3><p class="spotlight-text" data-v-a8de1510>${ssrInterpolate(space.description)}</p></div>`);
    _push(ssrRenderComponent(_component_router_link, {
      class: "spotlight-link",
      to: { name: "catalog", query: { productType: space.productType } }
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` Khám phá <i class="fi fi-br-arrow-right" data-v-a8de1510${_scopeId}></i>`);
        } else {
          return [
            createTextVNode(" Khám phá "),
            createVNode("i", { class: "fi fi-br-arrow-right" })
          ];
        }
      }),
      _: 2
    }, _parent));
    _push(`</div>`);
  });
  _push(`<!--]--></div></div></div></section><section class="section sizes-section" data-v-a8de1510><div class="container" data-v-a8de1510><div class="section-header" data-v-a8de1510><div data-v-a8de1510><p class="eyebrow" data-v-a8de1510>Lọc theo kích thước</p><h2 data-v-a8de1510>Kích thước phổ biến</h2><p class="muted" data-v-a8de1510>Danh sách lấy trực tiếp từ bộ lọc danh mục.</p></div>`);
  _push(ssrRenderComponent(_component_router_link, {
    class: "section-link",
    to: { name: "catalog" }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Mở bộ lọc <i class="fi fi-br-arrow-right" data-v-a8de1510${_scopeId}></i>`);
      } else {
        return [
          createTextVNode(" Mở bộ lọc "),
          createVNode("i", { class: "fi fi-br-arrow-right" })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="chip-rail" data-v-a8de1510><!--[-->`);
  ssrRenderList($options.sizeChips, (size) => {
    _push(ssrRenderComponent(_component_router_link, {
      key: size.id,
      to: { name: "catalog", query: { size: size.id } },
      class: "chip"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate(size.name)}`);
        } else {
          return [
            createTextVNode(toDisplayString(size.name), 1)
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]--></div></div></section><section class="section sanitary-section" data-v-a8de1510><div class="container" data-v-a8de1510><div class="section-header" data-v-a8de1510><div data-v-a8de1510><p class="eyebrow" data-v-a8de1510>Thiết bị vệ sinh</p><h2 data-v-a8de1510>Danh mục nổi bật</h2><p class="muted" data-v-a8de1510>Chọn nhanh các nhóm sản phẩm được quan tâm nhiều.</p></div>`);
  _push(ssrRenderComponent(_component_router_link, {
    class: "section-link",
    to: { name: "catalog", query: { productType: "thiết bị vệ sinh" } }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Xem tất cả TBVS <i class="fi fi-br-arrow-right" data-v-a8de1510${_scopeId}></i>`);
      } else {
        return [
          createTextVNode(" Xem tất cả TBVS "),
          createVNode("i", { class: "fi fi-br-arrow-right" })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="pill-grid" data-v-a8de1510><!--[-->`);
  ssrRenderList($options.sanitaryHighlights, (category) => {
    _push(ssrRenderComponent(_component_router_link, {
      key: category.id,
      class: "pill-card",
      to: { name: "catalog", query: { productType: "thiết bị vệ sinh", category: category.id } }
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<span class="pill-dot" data-v-a8de1510${_scopeId}></span><span class="pill-text" data-v-a8de1510${_scopeId}>${ssrInterpolate(category.name)}</span><i class="fi fi-br-arrow-right" data-v-a8de1510${_scopeId}></i>`);
        } else {
          return [
            createVNode("span", { class: "pill-dot" }),
            createVNode("span", { class: "pill-text" }, toDisplayString(category.name), 1),
            createVNode("i", { class: "fi fi-br-arrow-right" })
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]--></div></div></section></div><!--]-->`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/HomeView.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const HomeView = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-a8de1510"]]);
const _sfc_main = {
  name: "QuoteList",
  components: {
    QrcodeVue
  },
  data() {
    return {
      quoteItems: [],
      memoryQuoteItems: [],
      showSharePopup: false,
      shareUrl: "",
      sampleItems: [
        {
          id: "sample-1",
          name: "Sản phẩm mẫu",
          code: "4674T0R1",
          image: "https://placehold.co/120x120?text=Sample",
          size: "56x37x35.5cm",
          unit: "cái",
          quantity: 1,
          origin: "Đức"
        }
      ]
    };
  },
  created() {
    this.loadQuoteItems();
    const sharedQuote = this.$route.query.q;
    if (sharedQuote) {
      this.loadSharedQuote(sharedQuote);
    }
  },
  methods: {
    safeReadStorage(key) {
      try {
        return localStorage.getItem(key);
      } catch (err) {
        return null;
      }
    },
    safeWriteStorage(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (err) {
        return false;
      }
    },
    loadQuoteItems() {
      const stored = this.safeReadStorage("quoteItems");
      if (stored) {
        try {
          this.quoteItems = JSON.parse(stored);
          this.memoryQuoteItems = [...this.quoteItems];
          return;
        } catch (err) {
          console.warn("Lỗi parse localStorage, fallback bộ nhớ.", err);
        }
      }
      this.quoteItems = this.memoryQuoteItems.length ? [...this.memoryQuoteItems] : [...this.sampleItems];
    },
    removeItem(index) {
      this.quoteItems.splice(index, 1);
      this.saveQuoteItems();
    },
    clearList() {
      if (confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách báo giá?")) {
        this.quoteItems = [];
        this.saveQuoteItems();
      }
    },
    saveQuoteItems() {
      const payload = JSON.stringify(this.quoteItems);
      this.memoryQuoteItems = [...this.quoteItems];
      if (!this.safeWriteStorage("quoteItems", payload)) {
        console.warn("Không thể ghi localStorage, lưu tạm trong bộ nhớ.");
      }
    },
    shareQuote() {
      if (!this.quoteItems.length) {
        alert("Danh sách báo giá trống. Vui lòng thêm sản phẩm trước khi chia sẻ.");
        return;
      }
      const shareData = this.quoteItems.map((item) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        image: item.image,
        price: item.price
      }));
      const jsonString = JSON.stringify(shareData);
      const encodedJson = encodeURIComponent(jsonString);
      this.shareUrl = `${window.location.origin}/bao-gia-chia-se?q=${encodedJson}`;
      this.showSharePopup = true;
    },
    copyShareUrl() {
      this.$refs.shareUrlInput.select();
      document.execCommand("copy");
      alert("Đã sao chép link chia sẻ vào clipboard!");
    },
    loadSharedQuote(encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        if (Array.isArray(decodedData)) {
          decodedData.forEach(async (item) => {
            try {
              const response = await axios.get(`/api/products/${item.id}`);
              if (response.data) {
                const product = response.data;
                this.quoteItems.push({
                  id: product.id,
                  name: product.name,
                  code: product.code,
                  image: product.image,
                  price: product.price
                });
                this.saveQuoteItems();
              }
            } catch (error) {
              console.error("Error loading product:", error);
            }
          });
        }
      } catch (error) {
        console.error("Error decoding shared quote:", error);
      }
    },
    formatNumber(num) {
      const parsed = Number(num);
      return Number.isNaN(parsed) ? "1,00" : parsed.toLocaleString("vi-VN", { minimumFractionDigits: 2 });
    },
    formatDate(date = /* @__PURE__ */ new Date()) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    getUserInfo() {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (err) {
        return null;
      }
    }
  },
  computed: {
    totalItems() {
      return this.quoteItems.length;
    },
    quoteCode() {
      var _a;
      return (((_a = this.quoteItems[0]) == null ? void 0 : _a.code) || "VC") + "-" + Math.random().toString(36).slice(2, 6);
    },
    userInfo() {
      return this.getUserInfo();
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _component_qrcode_vue = resolveComponent("qrcode-vue");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "quote-list-page container py-5" }, _attrs))} data-v-e0b1c75f><div class="row" data-v-e0b1c75f><div class="col-12" data-v-e0b1c75f><h1 class="page-title mb-4" data-v-e0b1c75f>Danh sách báo giá</h1>`);
  if (!$data.quoteItems.length) {
    _push(`<div class="empty-state text-center py-5" data-v-e0b1c75f><div class="empty-icon mb-3" data-v-e0b1c75f><i class="fi fi-br-shopping-bag" data-v-e0b1c75f></i></div><h3 class="empty-title mb-2" data-v-e0b1c75f>Danh sách báo giá trống</h3><p class="empty-desc mb-4" data-v-e0b1c75f>Bạn chưa thêm sản phẩm nào vào danh sách báo giá.</p>`);
    _push(ssrRenderComponent(_component_router_link, {
      to: "/",
      class: "btn-back-home"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<i class="fi fi-br-arrow-left" data-v-e0b1c75f${_scopeId}></i><span data-v-e0b1c75f${_scopeId}>Quay về trang chủ</span>`);
        } else {
          return [
            createVNode("i", { class: "fi fi-br-arrow-left" }),
            createVNode("span", null, "Quay về trang chủ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div>`);
  } else {
    _push(`<div class="quote-list" data-v-e0b1c75f><div class="quote-items" data-v-e0b1c75f><!--[-->`);
    ssrRenderList($data.quoteItems.slice(0, 10), (item, index) => {
      _push(`<div class="quote-item" data-v-e0b1c75f><div class="item-image" data-v-e0b1c75f><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="img-fluid" data-v-e0b1c75f></div><div class="item-info" data-v-e0b1c75f><h3 class="item-name" data-v-e0b1c75f>${ssrInterpolate(item.name)}</h3><div class="item-code" data-v-e0b1c75f>Mã: ${ssrInterpolate(item.code)}</div><div class="item-price" data-v-e0b1c75f>${ssrInterpolate(item.price)}</div></div><div class="item-actions" data-v-e0b1c75f><button class="btn-remove" data-v-e0b1c75f><i class="fi fi-br-trash" data-v-e0b1c75f></i></button></div></div>`);
    });
    _push(`<!--]--></div><div class="quote-total mt-4" data-v-e0b1c75f><div class="total-info" data-v-e0b1c75f><span class="total-label" data-v-e0b1c75f>Tổng cộng:</span><span class="total-value" data-v-e0b1c75f>${ssrInterpolate($options.totalItems)} sản phẩm</span></div>`);
    if ($data.quoteItems.length > 10) {
      _push(`<div class="total-warning" data-v-e0b1c75f><i class="fi fi-br-info" data-v-e0b1c75f></i><span data-v-e0b1c75f>Chỉ hiển thị 10 sản phẩm đầu tiên khi chia sẻ</span></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div><div class="quote-actions mt-4" data-v-e0b1c75f><button class="btn-clear" data-v-e0b1c75f><i class="fi fi-br-trash" data-v-e0b1c75f></i><span data-v-e0b1c75f>Xóa tất cả</span></button><button class="btn-share" data-v-e0b1c75f><i class="fi fi-br-share" data-v-e0b1c75f></i><span data-v-e0b1c75f>Chia sẻ</span></button></div></div>`);
  }
  _push(`</div></div>`);
  if ($data.showSharePopup) {
    _push(`<div class="share-popup-overlay" data-v-e0b1c75f><div class="share-popup" data-v-e0b1c75f><div class="share-popup-header" data-v-e0b1c75f><h3 data-v-e0b1c75f>Chia sẻ danh sách báo giá</h3><button class="btn-close" data-v-e0b1c75f><i class="fi fi-br-cross" data-v-e0b1c75f></i></button></div><div class="share-popup-content" data-v-e0b1c75f><div class="share-url-container" data-v-e0b1c75f><input type="text"${ssrRenderAttr("value", $data.shareUrl)} readonly class="share-url-input" data-v-e0b1c75f><button class="btn-copy" data-v-e0b1c75f><i class="fi fi-br-copy" data-v-e0b1c75f></i></button></div><div class="qrcode-container" data-v-e0b1c75f>`);
    _push(ssrRenderComponent(_component_qrcode_vue, {
      value: $data.shareUrl,
      size: 200,
      level: "H"
    }, null, _parent));
    _push(`<p class="qrcode-desc" data-v-e0b1c75f>Quét mã QR để xem danh sách báo giá</p></div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/QuoteList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const QuoteList = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-e0b1c75f"]]);
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    path: "/san-pham/:id",
    name: "product-detail",
    component: () => import("./assets/ProductDetail-BeuN-Eaj.js")
  },
  {
    path: "/danh-muc",
    name: "catalog",
    component: () => import("./assets/Catalog-C4DaAT-7.js")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./assets/Login-CMV5Gwex.js")
  },
  {
    path: "/quote-list",
    name: "QuoteList",
    component: QuoteList
  },
  {
    path: "/bao-gia-chia-se",
    name: "SharedQuote",
    component: () => import("./assets/SharedQuote-Bp2nPTUR.js")
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("./assets/Error404-D3P3KCo6.js")
  }
];
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition;
  }
  return { top: 0 };
};
const toastOptions = {
  position: "top-right",
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
};
const createApp = ViteSSG(
  _sfc_main$2,
  {
    routes,
    base: "/",
    scrollBehavior
  },
  ({ app, router }) => {
    app.use(BootstrapVue3);
    app.use(Toast, toastOptions);
    app.directive("lazy", {
      mounted(el, binding) {
        function loadImage() {
          el.src = binding.value;
          el.addEventListener("load", () => {
            if (el.complete && el.naturalHeight !== 0) {
              el.classList.remove("lazy-loading");
              el.classList.add("lazy-loaded");
            }
          });
        }
        function handleIntersect(entries, observer) {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage();
              observer.unobserve(el);
            }
          });
        }
        if ("IntersectionObserver" in window) {
          const observer = new IntersectionObserver(handleIntersect, {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
          });
          observer.observe(el);
        } else {
          loadImage();
        }
      }
    });
    router.isReady().then(() => {
      if (typeof document !== "undefined") {
        nextTick(() => {
          document.dispatchEvent(new Event("app-rendered"));
        });
      }
    });
  }
);
export {
  _export_sfc as _,
  getFeaturedCategories as a,
  _imports_0 as b,
  createApp,
  getSizeOptions as g,
  updateSeoMeta as u
};
