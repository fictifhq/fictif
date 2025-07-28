import { reactive as q, defineComponent as ke, useAttrs as Te, shallowRef as Se, watch as Q, createBlock as j, openBlock as S, KeepAlive as je, resolveDynamicComponent as ee, normalizeProps as Ue, guardReactiveProps as qe, unref as te, withCtx as K, mergeProps as pe, readonly as me, ref as E, onMounted as Z, nextTick as U, onUnmounted as Me, Transition as J, createElementBlock as x, createCommentVNode as C, normalizeClass as Ke, Fragment as de, createVNode as ie, createElementVNode as P, normalizeStyle as Ce, toDisplayString as Ie, useSlots as Pe, watchEffect as Ve, Comment as We, Text as ye, createSSRApp as Ge, createApp as ze, h as se, computed as F, toRefs as Je, renderSlot as ge } from "vue";
import { nameToId as we, screens as ve } from "virtual:fictif-screens-data";
let re = null;
function Xe() {
  function a(n) {
    return we[n] || n;
  }
  async function e(n) {
    if (typeof n == "object") return n;
    const r = a(n), o = ve[r];
    if (!o)
      throw console.error(`[Fictif] Screen not found: "${n}" with id: "${r}".`), new Error(`Screen not found: ${n}`);
    return (await o()).default;
  }
  function t(n) {
    return a(n) in ve;
  }
  function s() {
    return Object.keys(we);
  }
  return { resolve: e, has: t, list: s };
}
function Qe() {
  return re || (re = Xe()), re;
}
class W {
  _listeners;
  static _defaultMaxListeners = 10;
  constructor() {
    this._listeners = /* @__PURE__ */ new Map();
  }
  /**
   * Registers an event listener to be called when the event is emitted.
   * @param event The name of the event to listen for.
   * @param listener The callback function.
   * @returns The emitter instance for chaining.
   */
  on(e, t) {
    const s = this._listeners.get(e);
    return s ? s.push(t) : this._listeners.set(e, [t]), this.checkMaxListeners(e), this;
  }
  /**
   * Adds a one-time listener for the event. This listener is invoked only the next
   * time the event is emitted, after which it is removed.
   * @param event The name of the event to listen for.
   * @param listener The callback function.
   * @returns The emitter instance for chaining.
   */
  once(e, t) {
    const s = (...n) => {
      this.off(e, s), t(...n);
    };
    return s.listener = t, this.on(e, s), this;
  }
  /**
   * Removes a specific listener for a given event.
   * @param event The name of the event.
   * @param listener The listener function to remove.
   * @returns The emitter instance for chaining.
   */
  off(e, t) {
    const s = this._listeners.get(e);
    if (s) {
      const n = s.filter((r) => r !== t && r.listener !== t);
      n.length ? this._listeners.set(e, n) : this._listeners.delete(e);
    }
    return this;
  }
  /**
   * Synchronously calls each of the listeners registered for the event, in the order
   * they were registered, passing the supplied arguments to each.
   *
   * @param event The name of the event to emit.
   * @param args The arguments to pass to the listeners.
   * @returns A promise that resolves with an array of all non-undefined values
   * returned by the listeners.
   */
  async emit(e, ...t) {
    const s = this._listeners.get(e);
    if (!s || s.length === 0) {
      if (e === "error")
        throw t[0] instanceof Error ? t[0] : new Error("Unhandled error event");
      return [];
    }
    const r = [...s].map((c) => c(...t));
    return (await Promise.all(r)).filter((c) => c !== void 0);
  }
  /**
   * Adds the listener function to the beginning of the listeners array for the specified event.
   * @param event The name of the event.
   * @param listener The listener function.
   * @returns The emitter instance for chaining.
   */
  prependListener(e, t) {
    const s = this._listeners.get(e);
    return s ? s.unshift(t) : this._listeners.set(e, [t]), this.checkMaxListeners(e), this;
  }
  /**
   * Adds a one-time listener function for the event to the beginning of the listeners array.
   * @param event The name of the event.
   * @param listener The listener function.
   * @returns The emitter instance for chaining.
   */
  prependOnceListener(e, t) {
    const s = (...n) => {
      this.off(e, s), t(...n);
    };
    return s.listener = t, this.prependListener(e, s), this;
  }
  /**
   * Removes all listeners for a specific event, or all listeners from all events
   * if no event is specified.
   * @param event The optional event name.
   * @returns The emitter instance for chaining.
   */
  removeAllListeners(e) {
    return e ? this._listeners.delete(e) : this._listeners.clear(), this;
  }
  /**
   * Returns an array listing the events for which the emitter has registered listeners.
   */
  eventNames() {
    return Array.from(this._listeners.keys());
  }
  /**
   * Returns a copy of the array of listeners for the specified event.
   * @param event The name of the event.
   */
  listeners(e) {
    return [...this._listeners.get(e) || []];
  }
  /**
   * Returns the number of listeners listening to the specified event.
   * @param event The name of the event.
   */
  listenerCount(e) {
    return this._listeners.get(e)?.length || 0;
  }
  /**
   * By default, a warning is printed if more than 10 listeners are added for
   * a particular event. This is a useful default that helps in finding memory leaks.
   * @param n The new maximum.
   */
  setMaxListeners(e) {
    return W._defaultMaxListeners = e, this;
  }
  /**
   * Returns the current max listener value for the emitter.
   */
  getMaxListeners() {
    return W._defaultMaxListeners;
  }
  checkMaxListeners(e) {
    const t = this.listenerCount(e), s = this.getMaxListeners();
    s > 0 && t > s && console.warn(`[Fictif EventEmitter] Possible memory leak detected. ${t} '${String(e)}' listeners added. Use setMaxListeners() to increase limit.`);
  }
}
function mt() {
  return new W();
}
class Ye {
  constructor(e) {
    this.route = e;
  }
  name(e) {
    return this.route.name = e, this;
  }
  middleware(e) {
    if (typeof e == "string")
      this.route.middleware.push(e);
    else if (Array.isArray(e))
      this.route.middleware.push(...e);
    else if (typeof e == "object") {
      const t = this.route.method, s = e[t] || e.all;
      s && this.route.middleware.push(...Array.isArray(s) ? s : [s]);
    }
    return this;
  }
  where(e, t) {
    return this.route.constraints[e] = t.startsWith("^") ? t : `^${t}$`, this;
  }
}
class fe extends W {
  _routes;
  _middlewares;
  _fallbackHandler;
  _prefix = "";
  _namePrefix = "";
  _domain = "";
  _middlewareStack = [];
  _parent;
  constructor(e = null) {
    super(), this._parent = e, e ? (this._routes = e._routes, this._middlewares = e._middlewares, this._fallbackHandler = e._fallbackHandler) : (this._routes = [], this._middlewares = {}, this._fallbackHandler = null);
  }
  group(e) {
    const t = new fe(this);
    e(t);
  }
  prefix(e) {
    return this._prefix = e.replace(/\/$/, ""), this;
  }
  name(e) {
    return this._namePrefix = e.endsWith(".") ? e : e + ".", this;
  }
  domain(e) {
    return this._domain = e, this;
  }
  applyMiddleware(...e) {
    return this._middlewareStack.push(...e), this;
  }
  get(e, t) {
    return this._addRoute("get", e, t);
  }
  post(e, t) {
    return this._addRoute("post", e, t);
  }
  put(e, t) {
    return this._addRoute("put", e, t);
  }
  delete(e, t) {
    return this._addRoute("delete", e, t);
  }
  patch(e, t) {
    return this._addRoute("patch", e, t);
  }
  all(e, t) {
    return this._addRoute("all", e, t);
  }
  any(e, t) {
    return this.all(e, t);
  }
  view(e, t) {
    return this.get(e, t);
  }
  redirect(e, t, s = 302) {
    return this.all(e, () => ({ redirect: { to: t, status: s } }));
  }
  fallback(e) {
    const t = this._addRoute("all", ".*", e);
    return t.route.isFallback = !0, this._fallbackHandler = t.route, t;
  }
  _addResourceRoutes(e, t, s) {
    const n = e.replace(/^\//, ""), r = s ? ["index", "store", "show", "update", "destroy"] : ["index", "create", "store", "show", "edit", "update", "destroy"];
    r.includes("index") && t.index && this.get(`/${n}`, t.index).name(`${n}.index`), r.includes("create") && t.create && this.get(`/${n}/create`, t.create).name(`${n}.create`), r.includes("store") && t.store && this.post(`/${n}`, t.store).name(`${n}.store`), r.includes("show") && t.show && this.get(`/${n}/:id`, t.show).name(`${n}.show`), r.includes("edit") && t.edit && this.get(`/${n}/:id/edit`, t.edit).name(`${n}.edit`), r.includes("update") && t.update && (this.put(`/${n}/:id`, t.update).name(`${n}.update`), this.patch(`/${n}/:id`, t.update)), r.includes("destroy") && t.destroy && this.delete(`/${n}/:id`, t.destroy).name(`${n}.destroy`);
  }
  resource(e, t) {
    this._addResourceRoutes(e, t, !1);
  }
  apiResource(e, t) {
    this._addResourceRoutes(e, t, !0);
  }
  _buildPattern(e, t) {
    const s = "^" + e.replace(/(\/?)\*/g, "($1.*)?").replace(/:(\w+)\?/g, "(?:/([^/]+))?").replace(/:(\w+)/g, (n, r) => (t.push(r), "([^/]+)")) + (this.getOptions().strict ? "" : "/?$");
    return new RegExp(s, this.getOptions().caseSensitive ? "" : "i");
  }
  _addRoute(e, t, s) {
    const n = this._prefix + (t.startsWith("/") || t === "" ? t : "/" + t), r = [], o = [], c = this._domain || (this._parent?._domain ?? ""), i = {
      method: e.toLowerCase(),
      pattern: this._buildPattern(n, r),
      domainPattern: c ? this._buildPattern(c.replace(/\./g, "\\."), o) : void 0,
      paramNames: r,
      domainParamNames: o,
      handler: s,
      originalPath: n,
      middleware: [...this._middlewareStack],
      name: this._namePrefix,
      constraints: {},
      isFallback: !1,
      isScopedMiddleware: !1
    };
    this._routes.push(i);
    const l = new Ye(i);
    return this._namePrefix && (l.route.name = this._namePrefix + (l.route.name || "")), l;
  }
  getOptions() {
    return this._parent ? this._parent.getOptions() : {};
  }
}
class Ze extends fe {
  _options;
  _current = null;
  _globalMiddleware = [];
  _lookupCache = /* @__PURE__ */ new Map();
  constructor(e = {}) {
    super(null), this._options = { caseSensitive: !1, strict: !1, ...e }, e.handle && (Array.isArray(e.handle) ? e.handle : [e.handle]).forEach((s) => this.use(s));
  }
  getOptions() {
    return this._options;
  }
  current() {
    return this._current;
  }
  middleware(e, t) {
    return this._middlewares[e] = t, this;
  }
  use(e, t) {
    if (typeof e == "function")
      this._globalMiddleware.push(e);
    else if (t) {
      const s = this._addRoute("all", e.replace(/\/$/, "") + "/(.*)", () => {
      });
      s.route.isScopedMiddleware = !0;
      const n = t.name || `scoped_${this._routes.length}`;
      this.middleware(n, t), s.middleware(n);
    }
    return this;
  }
  route(e, t = {}) {
    const s = this._routes.find((o) => o.name === e);
    if (!s) throw new Error(`[RouteMap] Route with name "${e}" not found.`);
    let n = s.originalPath;
    const r = { ...t };
    return [...s.paramNames, ...s.domainParamNames].forEach((o) => {
      if (r[o] === void 0 && !s.originalPath.includes(`:${o}?`))
        throw new Error(`[RouteMap] Missing required parameter "${o}" for route "${e}".`);
      r[o] !== void 0 && (n = n.replace(`:${o}?`, String(r[o])).replace(`:${o}`, String(r[o])));
    }), n.replace(/\/:\w+\?/g, "");
  }
  clearCache() {
    this._lookupCache.clear();
  }
  _findMatch(e) {
    const t = (e.method || "get").toLowerCase();
    let s = e.path || "/";
    !this._options.strict && s.length > 1 && (s = s.replace(/\/$/, ""));
    const n = e.hostname || "", r = `${t}::${n}::${s}`;
    if (this._lookupCache.has(r)) return this._lookupCache.get(r);
    const o = this._routes.filter((c) => !c.isFallback && !c.isScopedMiddleware && (c.method === t || c.method === "all"));
    for (const c of o) {
      const i = c.domainPattern ? n.match(c.domainPattern) : !0;
      if (!i) continue;
      const l = s.match(c.pattern);
      if (l) {
        const u = i && Array.isArray(i) ? c.domainParamNames.reduce((_, p, w) => ({ ..._, [p]: i[w + 1] }), {}) : {}, f = c.paramNames.reduce((_, p, w) => ({ ..._, [p]: l[w + 1] }), {}), h = { ...u, ...f };
        let d = !0;
        for (const _ in c.constraints)
          if (h[_] && !new RegExp(c.constraints[_]).test(h[_])) {
            d = !1;
            break;
          }
        if (!d) continue;
        const m = { route: c, params: h, args: l.slice(1).map((_) => _ || "") };
        return this._lookupCache.set(r, m), m;
      }
    }
    return this._lookupCache.set(r, null), null;
  }
  async dispatch(e) {
    this.emit("beforeDispatch", e), this._current = null;
    const t = async (i) => {
      const l = this._findMatch(i);
      if (!l && !this._fallbackHandler)
        return;
      const u = l ? l.route : this._fallbackHandler, f = l ? l.args : [], h = l ? l.params : {};
      this._current = { route: u, params: h, args: f }, i.params = h;
      const d = [], m = /* @__PURE__ */ new Set(), _ = (w) => {
        const y = this._middlewares[w];
        y && !m.has(y) && (m.add(y), d.push(y));
      };
      u.middleware.forEach(_);
      const p = (w) => w < d.length ? d[w](i, () => p(w + 1)) : u.handler(i, ...f);
      return p(0);
    }, s = [], n = /* @__PURE__ */ new Set(), r = (i) => {
      i && !n.has(i) && (n.add(i), s.push(i));
    };
    this._globalMiddleware.forEach(r), this._routes.filter((i) => i.isScopedMiddleware && (e.path || "/").match(i.pattern)).forEach((i) => {
      i.middleware.forEach((l) => r(this._middlewares[l]));
    });
    const o = (i) => i < s.length ? s[i](e, () => o(i + 1)) : t(e), c = await o(0);
    return this.emit("afterDispatch", { req: e, result: c }), c;
  }
}
class G {
  // Internally, the result can have a flexible PATH.
  result = {
    // By default, the PATH is undefined, signaling the router to use the request path.
    path: void 0
  };
  component(e) {
    return this.result.component = e, this;
  }
  with(e) {
    return this.result.props = { ...this.result.props || {}, ...e }, this;
  }
  asPath(e) {
    return this.result.path = e, this;
  }
  message(e) {
    return this.with({
      flash: { ...this.result.props?.flash || {}, message: e }
    });
  }
  error(e) {
    return this.with({
      flash: { ...this.result.props?.flash || {}, error: e }
    });
  }
  build() {
    return this.result;
  }
}
function yt() {
  return new G();
}
function gt(a) {
  return new G().component(a);
}
function wt(a) {
  return new G().component(a);
}
function vt() {
  const a = new G();
  return a.result.component = !1, a.result.path = "==back==", a;
}
function bt(a) {
  const e = new G();
  return e.result.redirect = a, e;
}
let N = null, be = null;
function et(a, e) {
  if (a.hasAttribute("data-intercept-link")) return !0;
  let t = !1;
  return e && (t = e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey), !(t || a.hasAttribute("target") || a.hasAttribute("download") || a.origin !== window.location.origin);
}
class X extends Ze {
  state;
  options;
  navigationPrevented = !1;
  navigating = !1;
  constructor(e = {}) {
    super({
      handle: e?.handle
    }), this.options = e || {}, this.state = q({
      props: {},
      path: typeof window < "u" ? window.location.pathname : "/",
      component: null,
      version: null
    });
  }
  get result() {
    return this.state;
  }
  get path() {
    return this.state.path;
  }
  init(e = !0) {
    if (N) {
      N != this && console.warn(
        "[Fictif] A global router is already initialized."
      );
      return;
    }
    N = this, be = this, window.addEventListener("popstate", (t) => {
      t.state?.fictif && this.visit(t.state.path);
    }), e && document.addEventListener("click", (t) => {
      const s = t.target.closest("a");
      if (!s) return;
      const n = (s.getAttribute("method") || "get").toLowerCase();
      et(s, t) && (t.preventDefault(), this.visit(s.getAttribute("href") || "/", {
        only: s.dataset.only?.split(","),
        preserveScroll: s.hasAttribute(
          "data-preserve-scroll"
        ),
        method: n
      }));
    });
  }
  preventNavigation() {
    this.navigationPrevented = !0;
  }
  async visit(e, t = {}) {
    if (!this.navigating) {
      if (this.navigationPrevented = !1, await this.emit("leaving", { path: e }), this.navigationPrevented) return;
      await this.emit("navigation", { path: e }), this.navigating = !0;
    }
    this.emit("step", { path: e, options: t });
    try {
      let s = await this.resolve(e, t);
      if (typeof s == "object" && s && typeof s.build == "function" && (s = s.build()), !s) {
        await this.emit("error", {
          path: e,
          error: new Error("No route handler returned a result.")
        });
        return;
      }
      if (s.redirect) {
        await this.visit(s.redirect, { replace: !0 });
        return;
      }
      let n;
      s.path === "==back==" ? n = this.state.path : s.path ? n = s.path : n = e;
      const r = {
        ...s,
        path: n
      };
      this.navigating = !1, await this.emit("navigated", { page: r }), await this.push(r, t);
    } catch (s) {
      await this.emit("error", { path: e, error: s }), console.error(
        `[Fictif Router] Failed to resolve route "${e}":`,
        s
      );
    }
  }
  async push(e, t = {}) {
    const s = { ...this.state.props, ...e.props }, n = e.component === !1 ? this.state.component : e.component;
    this.state.component = n, this.state.props = s, this.state.path = e.path, e.version && (this.state.version = e.version);
    const r = t.replace ? "replaceState" : "pushState";
    be === this && window.history[r](
      { fictif: !0, path: e.path },
      "",
      e.path
    ), await this.emit("push", { page: this.state, options: t }), await this.emit("ready", { page: this.state });
  }
  async resolve(e, t = {}) {
    const s = {
      ...t,
      path: e,
      method: t.method || "GET",
      old: this.result
    };
    return this.dispatch(s);
  }
}
function ae(a) {
  if (a instanceof X)
    return a;
  if (Array.isArray(a) || typeof a == "function" || typeof a == "object")
    return Ae(a);
  if (N)
    return N;
  throw new Error("[Fictif] No global router has been initialized to be used.");
}
function Ae(a) {
  return a instanceof X ? a : Array.isArray(a) || typeof a == "function" ? new X({
    handle: a
  }) : new X(a);
}
function _t(a) {
  const e = Ae(a);
  return e.init(), e;
}
let Y = null;
class tt {
  options;
  lastData = {};
  managedTagKey;
  constructor(e) {
    this.options = e, this.managedTagKey = Math.random().toString(36).substring(7);
  }
  init() {
    Y = this;
  }
  update(e) {
    e.reset !== !1 && (this.lastData = {}), this.lastData = { ...this.lastData, ...e };
    const t = this._compile(this.lastData);
    typeof window < "u" && window.document && this._updateDOM(t);
  }
  renderToString() {
    const e = this._compile(this.lastData), t = [], s = [];
    for (const n of e) {
      const r = this._renderTagToString(n);
      n.props.body ? s.push(r) : t.push(r);
    }
    return { headTags: t.join(`
    `), bodyTags: s.join(`
    `) };
  }
  _compile(e) {
    const t = [];
    if (this.options.title) {
      const r = this.options.title(e.title);
      r && t.push({ tag: "title", props: {}, innerHTML: r });
    } else e.title && t.push({ tag: "title", props: {}, innerHTML: e.title });
    const s = (r, o) => {
      if (r)
        for (const c in r) {
          const i = r[c], l = e[c];
          let u;
          typeof i == "function" ? u = i(l) : u = l !== void 0 ? l : i, u != null && t.push({ tag: "meta", props: { [o]: c, content: String(u) } });
        }
    }, n = { ...this.options.namedMeta };
    if (this.options.description && (n.description = this.options.description), s(n, "name"), s(this.options.propertyMeta, "property"), s(this.options.httpEquivMeta, "http-equiv"), this.options.favicon) {
      let r;
      if (typeof this.options.favicon == "function" ? r = this.options.favicon(e.favicon) : r = e.favicon !== void 0 ? e.favicon : this.options.favicon, r) {
        const o = typeof r == "string" ? { href: r } : r;
        t.push({ tag: "link", props: { rel: "icon", ...o } });
      }
    }
    if (this.options.link)
      for (const r in this.options.link)
        (Array.isArray(this.options.link[r]) ? this.options.link[r] : [this.options.link[r]]).forEach((c) => {
          const i = typeof c == "string" ? { href: c } : c;
          t.push({ tag: "link", props: { rel: r, ...i } });
        });
    return this.options.script && this.options.script.forEach((r) => {
      const o = typeof r == "string" ? { src: r } : r;
      t.push({ tag: "script", props: o });
    }), e.children && e.children.forEach((r) => {
      const { elementTagType: o, innerHTML: c, ...i } = r;
      o && t.push({ tag: o, props: i, innerHTML: c });
    }), t;
  }
  _updateDOM(e) {
    const t = window.document, s = `[data-fictif-head="${this.managedTagKey}"]`;
    t.querySelectorAll(s).forEach((r) => r.remove());
    const n = e.find((r) => r.tag === "title");
    t.title = n?.innerHTML || "", e.forEach((r) => {
      if (r.tag === "title") return;
      const o = t.createElement(r.tag);
      o.setAttribute("data-fictif-head", this.managedTagKey);
      for (const [i, l] of Object.entries(r.props))
        l === !0 || l === "" ? o.setAttribute(i, "") : l !== !1 && l !== null && l !== void 0 && o.setAttribute(i, String(l));
      r.innerHTML && (o.innerHTML = r.innerHTML), (r.props.body ? t.body : t.head).appendChild(o);
    });
  }
  _renderTagToString(e) {
    if (e.tag === "title") return `<title>${e.innerHTML}</title>`;
    const t = Object.entries(e.props).map(([r, o]) => o === !0 || o === "" ? r : o === !1 || o === null || o === void 0 ? null : `${r}="${String(o).replace(/"/g, '"')}"`).filter(Boolean).join(" "), s = ["meta", "link", "base"].includes(e.tag), n = t ? " " + t : "";
    return s ? `<${e.tag}${n}>` : `<${e.tag}${n}>${e.innerHTML || ""}</${e.tag}>`;
  }
}
function le(a) {
  return a ? ce(a) : Y || ce();
}
function ce(a) {
  return new tt(a || {});
}
function Et(a) {
  const e = ce(a);
  return e.init(), e;
}
const $e = typeof window < "u" && typeof window.document < "u";
class st {
  store = /* @__PURE__ */ new Map();
  constructor() {
    $e && this.add(document.cookie);
  }
  add(e) {
    if (typeof e == "string")
      e.split(";").forEach((t) => {
        const s = t.match(/([^=]+)=(.*)/);
        if (s) {
          const n = s[1].trim(), r = s[2].trim();
          n && this.store.set(n, r);
        }
      });
    else
      for (const [t, s] of Object.entries(e))
        this.store.set(t, String(s));
  }
  get(e) {
    return this.store.get(e);
  }
  getRecord() {
    return Object.fromEntries(this.store);
  }
}
const _e = new st(), B = {
  ABORTED: "ABORTED",
  NETWORK_ERROR: "NETWORK_ERROR",
  DEDUPED: "DEDUPED",
  TIMEOUT: "TIMEOUT",
  CACHE_ERROR: "CACHE_ERROR"
};
let I = null;
const z = /* @__PURE__ */ new Map();
class ue {
  options;
  cache = /* @__PURE__ */ new Map();
  _extendPatterns = /* @__PURE__ */ new Map();
  constructor(e = {}) {
    e.inheritOptions !== !1 && I ? this.options = this._deepMerge(I.options, e) : this.options = e;
  }
  init() {
    I = this;
  }
  before(e) {
    this.options.before = [...this.options.before || [], e];
  }
  after(e) {
    this.options.after = [...this.options.after || [], e];
  }
  onError(e) {
    this.options.onError = [...this.options.onError || [], e];
  }
  get(e, t) {
    return this.request(e, { ...t, method: "GET" });
  }
  post(e, t) {
    return this.request(e, { ...t, method: "POST" });
  }
  put(e, t) {
    return this.request(e, { ...t, method: "PUT" });
  }
  delete(e, t) {
    return this.request(e, { ...t, method: "DELETE" });
  }
  patch(e, t) {
    return this.request(e, { ...t, method: "PATCH" });
  }
  async request(e, t = {}) {
    let s = { ...t };
    const n = { ...this.options.extend, ...t.extend };
    for (const d in n) {
      const [m, _] = d.startsWith(":") ? d.substring(1).split(":", 2) : [null, d], p = (t.method || "GET").toUpperCase();
      if (this._getPatternRegex(_).test(e) && (!m || m.toUpperCase() === p)) {
        const y = n[d];
        s = y.inheritOptions === !1 ? y : this._deepMerge(s, y);
      }
    }
    const r = this._deepMerge({
      baseUrl: "",
      credentials: "include",
      timeout: 1e4,
      retries: 3,
      retryDelay: (d) => Math.min(d * 1e3, 3e4),
      retryCondition: (d) => (d.response?.status ?? 0) >= 500,
      dedupe: !0,
      debug: void 0,
      expectsJSON: !0,
      expectsDownloads: !1,
      bodyType: "auto",
      xsrf: !0,
      xsrfHeader: "X-XSRF-TOKEN",
      xsrfCookie: "XSRF-TOKEN",
      cacheTtl: 0,
      usesCache: !0,
      followRedirects: 5,
      caseSensitive: !1,
      strict: !1
    }, this.options, s), o = (d, m) => r.debug?.(d, m), c = typeof r.key == "string" ? r.key : null, i = this._getAutoKey(r, e, o), l = c ?? i;
    if (r.dedupe && l) {
      const d = z.get(l);
      if (d)
        if (c)
          o(`[DEDUPED] Aborting previous request for key: ${l}`), d.abort(), z.delete(l);
        else
          return o(`[DEDUPED] Reusing in-flight request for key: ${l}`), d.promise;
    }
    if (r.usesCache && i && this.cache.has(i)) {
      const d = this.cache.get(i);
      if (Date.now() - d.at < r.cacheTtl)
        return o(`[CACHE HIT] Using cached response for key: ${i}`), this._processResponse(d.response.clone(), r, o);
      this.cache.delete(i);
    }
    const u = new AbortController(), f = { abort: () => u.abort() }, h = new Promise(async (d, m) => {
      const _ = this._mergeSignals(u.signal, r.signal), p = r.timeout && r.timeout > 0 ? setTimeout(() => u.abort(this._createError(B.TIMEOUT, "Request timed out")), r.timeout) : null, w = () => {
        p && clearTimeout(p);
      };
      _.addEventListener("abort", () => {
        w();
        const y = _.reason || this._createError(B.ABORTED, "Request was aborted");
        y?.code !== B.DEDUPED && m(y);
      });
      try {
        let y = 0;
        const D = r.retries === !0 ? 1 / 0 : r.retries || 0;
        for (; y <= D; )
          try {
            const v = this._buildURL(r.baseUrl, e, r.params), [b, k] = this._prepareBody(r, o), A = await this._prepareHeaders(r, k);
            let L = b;
            if (r.onUploadProgress && b) {
              const T = this._addUploadProgress(b, r.onUploadProgress, f);
              T && (L = T.body, T.total > 0 && A.set("Content-Length", String(T.total)));
            }
            const H = {
              method: r.method || "GET",
              headers: A,
              body: L,
              signal: _,
              credentials: r.credentials,
              redirect: r.followRedirects === !1 || r.followRedirects === 0 ? "manual" : "follow"
            }, M = this._createRequest(v, H, r), $ = {};
            M.headers.forEach((T, O) => {
              $[O] = T;
            }), o(`[REQUEST] ${M.method} ${M.url}`, { headers: $ });
            let g;
            if (r.before)
              for (const T of r.before) {
                const O = await T(M);
                if (O instanceof Response) {
                  g = O, o("[MOCKED] Request was handled by a 'before' hook.");
                  break;
                }
              }
            const R = g ?? await fetch(M).catch((T) => {
              throw this._createError(B.NETWORK_ERROR, T.message);
            });
            if (!R.ok) throw await this._createErrorFromResponse(R);
            i && r.cacheTtl > 0 && this.cache.set(i, { response: R.clone(), at: Date.now(), options: r }), d(await this._processResponse(R, r, o)), w();
            return;
          } catch (v) {
            const b = v;
            if (_.aborted) throw b;
            y++;
            let k = r.retryCondition(b);
            if (r.onError)
              for (const A of r.onError)
                await A(b, y, r) === !1 && (k = !1);
            if (y > D || !k)
              throw w(), b;
            o(`[RETRY] Attempt ${y} failed. Retrying in ${r.retryDelay(y)}ms...`, { error: b.message }), await new Promise((A) => setTimeout(A, r.retryDelay(y)));
          }
      } catch (y) {
        w(), m(y);
      }
    });
    if (r.dedupe && l) {
      const d = () => u.abort(this._createError(B.DEDUPED, `Request with key '${l}' was superseded.`));
      z.set(l, { promise: h, abort: d }), h.finally(() => {
        z.delete(l);
      });
    }
    return h;
  }
  async _processResponse(e, t, s) {
    s(`[RESPONSE] ${e.status} ${e.statusText} from ${e.url}`);
    let n = e.clone();
    if (t.onDownloadProgress) {
      const o = this._addDownloadProgress(n, t.onDownloadProgress, { abort: () => {
      } });
      o && (n = o);
    }
    const r = await this._parseBody(n, t);
    if (t.after)
      for (const o of t.after) await o(e.clone(), r);
    return r;
  }
  // --- PRIVATE HELPERS ---
  _deepMerge(...e) {
    const t = (s) => s && typeof s == "object" && !Array.isArray(s);
    return e.reduce((s, n) => (n && Object.keys(n).forEach((r) => {
      const o = s[r], c = n[r];
      Array.isArray(o) && Array.isArray(c) ? s[r] = [...o, ...c] : t(o) && t(c) ? s[r] = this._deepMerge(o, c) : s[r] = c;
    }), s), {});
  }
  _getPatternRegex(e) {
    if (this._extendPatterns.has(e)) return this._extendPatterns.get(e);
    const t = "^" + e.replace(/(\/?)\*/g, "($1.*)?").replace(/:(\w+)(\?)?/g, (n, r, o) => o ? "(?:/([^/]+))?" : "([^/]+)") + (this.options.strict ? "" : "/?$"), s = new RegExp(t, this.options.caseSensitive ? "" : "i");
    return this._extendPatterns.set(e, s), s;
  }
  _getAutoKey(e, t, s) {
    if (typeof e.key == "function") return e.key();
    try {
      const n = e.method === "GET" ? void 0 : e.body, r = e.params ? Object.fromEntries(Object.entries(e.params).sort(([o], [c]) => o.localeCompare(c))) : void 0;
      return JSON.stringify({ path: t, method: e.method, params: r, body: n });
    } catch {
      return s("[WARN] Auto key generation failed for request with non-serializable body. Caching/Deduplication disabled."), null;
    }
  }
  _createRequest(e, t, s) {
    const n = new Request(e, t);
    return n.options = s, n;
  }
  _buildURL(e, t, s) {
    const r = e || "http://example.com", o = new URL(t, r);
    if (s) {
      const c = new URLSearchParams();
      for (const [i, l] of Object.entries(s))
        Array.isArray(l) ? l.forEach((u) => c.append(i, String(u))) : l != null && c.append(i, String(l));
      o.search = c.toString();
    }
    return e ? o.toString() : o.pathname + o.search + o.hash;
  }
  _prepareBody(e, t) {
    const { body: s, bodyType: n } = e;
    if (!s || typeof s != "object" || s instanceof Blob || s instanceof ArrayBuffer || s instanceof URLSearchParams || s instanceof ReadableStream)
      return [s, null];
    let r = n;
    if (n === "auto" && (r = Object.values(s).some((c) => c instanceof Blob) ? "formdata" : "json"), r === "json")
      return [JSON.stringify(s), "application/json"];
    if (r === "formdata") {
      const o = new FormData();
      for (const [c, i] of Object.entries(s)) o.append(c, i);
      return [o, null];
    }
    return [s, null];
  }
  async _prepareHeaders(e, t) {
    const s = new Headers(), n = this._deepMerge(this.options.headers, e.headers);
    for (const i in n) {
      const l = this.options.headers?.[i], u = e.headers?.[i];
      let f;
      typeof u == "function" ? f = await u(typeof l == "string" ? l : void 0) : typeof l == "function" ? f = await l(typeof u == "string" ? u : void 0) : f = u ?? l, f != null && s.set(i, f);
    }
    const r = {};
    (e.credentials === "include" || e.credentials === "same-origin") && Object.assign(r, _e.getRecord());
    const o = this._deepMerge(this.options.cookies, e.cookies);
    for (const i in o) {
      const l = this.options.cookies?.[i], u = e.cookies?.[i];
      let f;
      typeof u == "function" ? f = await u(r[i]) : typeof l == "function" ? f = await l(r[i]) : f = u ?? l, f ? r[i] = f : delete r[i];
    }
    const c = Object.entries(r).map(([i, l]) => `${i}=${l}`).join("; ");
    if (c && s.set("Cookie", c), t && !s.has("Content-Type") && s.set("Content-Type", t), e.xsrf && !s.has(e.xsrfHeader)) {
      const i = _e.get(e.xsrfCookie);
      i && s.set(e.xsrfHeader, decodeURIComponent(i));
    }
    return s;
  }
  _mergeSignals(...e) {
    const t = new AbortController();
    for (const s of e)
      if (s) {
        if (s.aborted) {
          t.abort(s.reason);
          break;
        }
        s.addEventListener("abort", () => t.abort(s.reason));
      }
    return t.signal;
  }
  _createError(e, t) {
    const s = new Error(t);
    return s.code = e, s;
  }
  async _createErrorFromResponse(e) {
    const t = new Error(`Request failed with status ${e.status}`);
    t.response = e.clone();
    try {
      (e.headers.get("content-type") || "").includes("application/json") ? t.data = await e.json() : t.data = await e.text();
    } catch {
      t.data = "Could not parse error response body.";
    }
    return t;
  }
  async _parseBody(e, t) {
    if (t.expectsDownloads) return e.blob();
    if (e.status === 204 || e.status === 205) return null;
    const s = e.headers.get("Content-Type") || "";
    return t.expectsJSON && s.includes("application/json") ? e.json() : e.text();
  }
  _addDownloadProgress(e, t, s) {
    const n = parseInt(e.headers.get("Content-Length") || "0", 10);
    if (!e.body) return null;
    let r = 0;
    const o = new ReadableStream({
      async start(c) {
        const i = e.body.getReader();
        for (; ; )
          try {
            const { done: l, value: u } = await i.read();
            if (l) break;
            r += u.length, t({ loaded: r, total: n }, s), c.enqueue(u);
          } catch (l) {
            c.error(l);
            break;
          }
        c.close();
      }
    });
    return new Response(o, { headers: e.headers, status: e.status, statusText: e.statusText });
  }
  _addUploadProgress(e, t, s) {
    if (!$e && typeof e.on == "function") {
      const i = e, l = i.readableLength || 0;
      let u = 0;
      return i.on("data", (f) => {
        u += f.length, t({ loaded: u, total: l }, s);
      }), { body: i, total: l };
    }
    const n = e instanceof Blob ? e : new Blob([e]), r = n.size;
    if (r === 0) return null;
    let o = 0;
    return { body: new ReadableStream({
      async start(i) {
        const l = n.stream().getReader();
        for (; ; )
          try {
            const { done: u, value: f } = await l.read();
            if (u) break;
            o += f.length, t({ loaded: o, total: r }, s), i.enqueue(f);
          } catch (u) {
            i.error(u);
            break;
          }
        i.close();
      }
    }), total: r };
  }
}
function rt(a) {
  return a ? new ue(a) : I || new ue();
}
function Rt(a) {
  const e = new ue(a);
  return e.init(), e;
}
function nt({
  prefix: a = "X-Inertia",
  version: e = null
  //page,
} = {}) {
  return async (t, s) => {
    const n = rt();
    let r = "static";
    typeof e == "function" ? r = e() || "static" : typeof e == "string" ? r = e : typeof e == "number" ? r = String(e) : t.old && (r = t.old.version || "static");
    const o = {
      "X-Requested-With": "XMLHttpRequest",
      [a]: "true",
      // Send the asset version on every visit
      ...r && { [a + "-Version"]: r },
      // Send partial reload headers if specified
      ...t.only?.length && {
        [a + "-Only"]: t.only.join(",")
        //[prefix + '-Partial-Component']: page.value.component as string,
      },
      ...t.headers
    };
    try {
      const c = await n.request(t.path || "/", {
        method: t.method,
        body: t.body,
        headers: o
      });
      return {
        path: c.url,
        // For inertia compatibility
        ...c
      };
    } catch (c) {
      if (!c.response)
        return s(t);
      const i = c.response;
      throw i.status === 409 && i.headers.get(a + "-Location") ? new Error("Asset version mismatch, forcing full reload.") : [301, 302].includes(i.status) ? (window.location.href = i.headers.get("Location") || t.path, new Error("Server-side redirect.")) : (i.status === 422, c);
    }
  };
}
const ot = /* @__PURE__ */ ke({
  inheritAttrs: !1,
  __name: "display",
  props: {
    screen: {
      type: Object,
      required: !0
    },
    renderKey: {
      type: [String, Number],
      required: !0
    }
  },
  setup(a) {
    const e = a, t = Te(), s = Se(null);
    let n = null;
    return Q(() => e.screen, (r) => {
      if (!r) {
        s.value = null, n = null;
        return;
      }
      const o = r, c = o.layout || null;
      o.title, o.meta, c !== n && (c?.name && n?.name ? c.name !== n.name : c !== n) && (s.value = c, n = c);
    }, { immediate: !0 }), (r, o) => s.value ? (S(), j(
      je,
      { key: 0 },
      [
        (S(), j(
          ee(s.value),
          Ue(qe(te(t))),
          {
            default: K(() => [
              (S(), j(
                ee(a.screen),
                pe(te(t), { key: a.renderKey }),
                null,
                16
                /* FULL_PROPS */
              ))
            ]),
            _: 1
            /* STABLE */
          },
          16
          /* FULL_PROPS */
        ))
      ],
      1024
      /* DYNAMIC_SLOTS */
    )) : (S(), j(
      ee(a.screen),
      pe({ key: 1 }, te(t), { key: a.renderKey }),
      null,
      16
      /* FULL_PROPS */
    ));
  }
}), xe = {
  inspirationalMessages: [
    {
      message: "“Success usually comes to those who are too busy to be looking for it.” — Henry David Thoreau",
      background: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    },
    {
      message: "“Opportunities don't happen, you create them.” — Chris Grosser",
      background: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80"
    },
    {
      message: "“Don’t be afraid to give up the good to go for the great.” — John D. Rockefeller",
      background: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
    }
  ]
};
let ne = null, Ee = !1;
const oe = /* @__PURE__ */ new Set();
function it() {
  const a = q({
    isVisible: !1,
    mode: "full",
    message: "",
    background: ""
  }), e = () => {
    oe.forEach((i) => i(me(a)));
  }, t = () => {
    const { inspirationalMessages: i } = xe;
    if (i.length === 0) return;
    const l = i[Math.floor(Math.random() * i.length)];
    a.message = l.message, a.background = l.background;
  }, s = (i = {}) => {
    if (!Ee) {
      console.warn(
        "Curtain.start() was called, but no <Curtain> component is mounted in your application tree currently. Please add `<Curtain />` to your root component (e.g., App.vue)."
      );
      return;
    }
    const { mode: l = "full", customMessage: u, customBackground: f } = i;
    a.mode = l, l === "full" && (u ? a.message = u : t(), f && (a.background = f)), a.isVisible = !0, e();
  }, n = () => {
    a.isVisible = !1, e();
  }, r = (i) => {
    oe.add(i);
  }, o = (i) => {
    oe.delete(i);
  }, c = (i) => {
    Ee = i;
  };
  return t(), {
    state: me(a),
    start: s,
    done: n,
    subscribe: r,
    unsubscribe: o,
    setCurtainMounted: c
  };
}
function De() {
  return ne || (ne = it()), ne;
}
function kt(a) {
  Object.assign(xe, a);
}
const at = {
  key: 1,
  class: "curtain__light-spinner-positioner"
}, lt = {
  key: 2,
  class: "curtain__bottom-bar"
}, ct = {
  __name: "curtain",
  setup(a) {
    const e = E(!1), t = E("full"), s = E(""), n = E(""), r = E(!1), o = De();
    let c = !1;
    const i = () => {
      if (c) return;
      const d = document.querySelectorAll(".fictif-pre-curtain");
      for (const m of d)
        m.remove();
      c = !0;
    }, l = () => {
      i();
    }, u = (d) => {
      e.value = d.isVisible, t.value = d.mode, s.value = d.message, n.value = d.background;
    };
    Z(() => {
      o.setCurtainMounted(!0), o.subscribe(u), u(o.state), U(() => {
        e.value || i();
      });
    }), Me(() => {
      o.setCurtainMounted(!1), o.unsubscribe(u), h();
    });
    const f = () => {
      document.body.style.overflow = "hidden";
      const d = window.innerWidth - document.documentElement.clientWidth;
      d > 0 && (document.body.style.paddingRight = `${d}px`);
    }, h = () => {
      setTimeout(() => {
        document.body.style.overflow = "", document.body.style.paddingRight = "";
      }, 300);
    };
    return Q(e, (d) => {
      d ? f() : h();
    }), Q(n, (d) => {
      if (!d || t.value !== "full") {
        r.value = !1;
        return;
      }
      const m = new Image();
      m.src = d, m.onload = () => {
        n.value === d && (r.value = !0);
      }, m.onerror = () => {
        r.value = !1;
      };
    }, { immediate: !0 }), (d, m) => (S(), j(J, {
      name: "curtain-fade",
      onAfterEnter: l
    }, {
      default: K(() => [
        e.value ? (S(), x(
          "div",
          {
            key: 0,
            class: Ke(["fictif-curtain", `fictif-curtain--${t.value}`]),
            role: "dialog",
            "aria-modal": "true",
            "aria-busy": "true",
            "aria-live": "assertive"
          },
          [
            C(" Full Mode: Background & Overlay "),
            t.value === "full" ? (S(), x(
              de,
              { key: 0 },
              [
                ie(J, { name: "content-fade" }, {
                  default: K(() => [
                    r.value ? (S(), x(
                      "div",
                      {
                        key: 0,
                        class: "curtain__bg",
                        style: Ce({ backgroundImage: `url(${n.value})` })
                      },
                      null,
                      4
                      /* STYLE */
                    )) : C("v-if", !0)
                  ]),
                  _: 1
                  /* STABLE */
                }),
                m[0] || (m[0] = P(
                  "div",
                  { class: "curtain__overlay" },
                  null,
                  -1
                  /* CACHED */
                ))
              ],
              64
              /* STABLE_FRAGMENT */
            )) : C("v-if", !0),
            C(" Light Mode Only: Spinner "),
            t.value === "light" ? (S(), x("div", at, m[1] || (m[1] = [
              P(
                "div",
                { class: "fictif-spinner" },
                [
                  P("div", {
                    class: "spinner-arc",
                    style: { "border-top-color": "#e5e7eb", "animation-delay": "-0.45s" }
                  }),
                  P("div", {
                    class: "spinner-arc",
                    style: { "border-top-color": "#9ca3af", "animation-delay": "-0.3s" }
                  }),
                  P("div", {
                    class: "spinner-arc",
                    style: { "border-top-color": "white", "animation-delay": "-0.15s" }
                  })
                ],
                -1
                /* CACHED */
              )
            ]))) : C("v-if", !0),
            C(" Full Mode Only: Bottom Bar for Message and Spinner "),
            t.value === "full" ? (S(), x("div", lt, [
              ie(J, {
                name: "content-fade",
                mode: "out-in"
              }, {
                default: K(() => [
                  s.value ? (S(), x(
                    "p",
                    {
                      key: s.value,
                      class: "curtain__message"
                    },
                    Ie(s.value),
                    1
                    /* TEXT */
                  )) : C("v-if", !0)
                ]),
                _: 1
                /* STABLE */
              }),
              m[2] || (m[2] = P(
                "div",
                { class: "fictif-spinner" },
                [
                  P("div", {
                    class: "spinner-arc",
                    style: { "border-top-color": "#e5e7eb", "animation-delay": "-0.45s" }
                  }),
                  P("div", {
                    class: "spinner-arc",
                    style: { "border-top-color": "#9ca3af", "animation-delay": "-0.3s" }
                  }),
                  P("div", {
                    class: "spinner-arc",
                    style: { "border-top-color": "white", "animation-delay": "-0.15s" }
                  })
                ],
                -1
                /* CACHED */
              ))
            ])) : C("v-if", !0)
          ],
          2
          /* CLASS */
        )) : C("v-if", !0)
      ]),
      _: 1
      /* STABLE */
    }));
  }
}, ut = /* @__PURE__ */ ke({
  __name: "head",
  setup(a) {
    const e = Te(), t = Pe();
    let s;
    try {
      s = le();
    } catch {
      console.error("[Fictif Head] Missing global head manager. Did you forget to provide it?");
    }
    const n = () => {
      const o = { children: [] };
      if (!t.default) return o;
      const c = (i) => {
        for (const l of i)
          if (!(!l || l.type === We || l.type === ye)) {
            if (l.type === de && Array.isArray(l.children)) {
              c(l.children);
              continue;
            }
            if (typeof l.type == "string") {
              let u = "";
              Array.isArray(l.children) ? u = l.children.map((f) => typeof f == "string" ? f : f.type === ye ? f.children : "").join("") : typeof l.children == "string" && (u = l.children), l.type.toLowerCase() === "title" ? o.title = u : o.children.push({
                elementTagType: l.type,
                innerHTML: u || void 0,
                ...l.props || {}
              });
            }
          }
      };
      return c(t.default()), o;
    }, r = () => {
      if (!s) return;
      const o = { ...e }, c = n(), i = {
        reset: !0,
        ...o,
        ...c,
        children: [
          ...o.children || [],
          ...c.children || []
        ]
      };
      s.update(i);
    };
    return Z(() => {
      r(), Ve(r);
    }), Me(() => {
      s && s.update({ reset: !0 });
    }), (o, c) => C(" This component is intentionally renderless ");
  }
}), Re = {
  install(a) {
    a.component("Head", ut);
  }
};
async function Tt(a) {
  let {
    mountTo: e = "#app",
    setup: t,
    progress: s = {},
    resolve: n,
    initialData: r = void 0,
    copyInitialData: o = !0,
    isSSR: c = void 0,
    appName: i = "App"
  } = typeof a == "object" && a ? a : {}, l, u;
  N ? l = ae() : (l = ae({
    handle: nt()
  }), l.init()), Y ? u = le() : (u = le({
    // maybe some default config
    title: (p) => p ? p + " | " + i : i
  }), u.init());
  const f = n || Qe().resolve;
  if (typeof e == "string") {
    const p = document.querySelector(e);
    if (!p)
      throw new Error(`[Fictif] Given 'mountTo' query selector didnt resolve to an html element, given: "${e}".`);
    e = p;
  }
  if (!e && typeof t != "function")
    throw new Error("[Fictif] Didnt receive a root element to mount to.");
  const h = Se({
    component: "",
    props: {},
    path: location.pathname,
    version: "static"
    // Handled in other places
  });
  l.on(
    "push",
    async ({
      page: p,
      options: w
    }) => {
      const y = typeof p.component == "string" ? await f(p.component) : p.component;
      if ((typeof w.preserveScroll == "boolean" ? !w.preserveScroll : h.value.component != y) && window.scrollTo(0, 0), w.only?.length) {
        const D = { ...p.value.props, ...p.props };
        h.value = { ...p, props: D, component: y };
      } else
        h.value = { ...p, component: y };
    }
  ), async function() {
    await l.init(), o && e && e.dataset.page ? r = JSON.parse(e.dataset.page) : typeof r == "string" && (r = JSON.parse(r)), r ? await l.push(r) : await l.visit(location.pathname);
  }();
  const d = {
    name: "FictifAppRoot",
    setup() {
      return Z(() => {
        document.body.classList.add("fictif-app-mounted");
      }), () => {
        const p = se("div", { id: "fictif-root-wrapper" }, [
          se(ct, {}),
          h.value && typeof h.value.component == "object" ? se(ot, {
            key: h.value.path,
            // @ts-ignore
            screen: h.value.component,
            renderKey: `${h.value.path}-${Date.now()}`,
            ...h.value.props
          }) : void 0
        ]);
        return u.update({ reset: !1 }), p;
      };
    }
  };
  let m;
  t ? m = t({ el: e, App: d, plugin: Re }) : (m = (typeof c == "boolean" ? c : e && e.hasAttribute("data-server-rendered")) ? Ge(d) : ze(d), m.use(Re)), e && m.mount(e);
  const _ = De();
  if (s != !1) {
    _.start();
    let p;
    l.on("navigation", () => {
      p = window.setTimeout(
        _.start,
        s?.delay || 300
      );
    });
    const w = () => {
      clearTimeout(p), _.done();
    };
    l.on("ready", w), l.on("error", w);
  }
}
function V(a) {
  if (a === null || typeof a != "object")
    return a;
  if (a instanceof Date)
    return new Date(a.getTime());
  if (a instanceof File)
    return a;
  if (Array.isArray(a)) {
    const t = [];
    for (let s = 0; s < a.length; s++)
      t[s] = V(a[s]);
    return t;
  }
  const e = {};
  for (const t in a)
    Object.prototype.hasOwnProperty.call(a, t) && (e[t] = V(a[t]));
  return e;
}
function St(a, e = {}) {
  const t = typeof a == "function" ? a() : a, s = q(V(t)), n = V(t), r = q({}), o = E(!1), c = E(!1), i = E(!1), l = E(null), u = E(!1);
  let f = null;
  const h = ae();
  Q(s, () => {
    u.value = JSON.stringify(s) !== JSON.stringify(n);
  }, { deep: !0 });
  const d = F(() => Object.keys(r).length > 0), m = (...v) => {
    (v.length > 0 ? v : Object.keys(r)).forEach((k) => {
      delete r[k];
    });
  }, _ = (...v) => {
    (v.length > 0 ? v : Object.keys(n)).forEach((k) => {
      s[k] = n[k];
    }), u.value = !1, c.value = !1, i.value = !1, f && clearTimeout(f), m();
  }, p = (v, b) => {
    s[v] = b;
  }, w = async (v) => {
    o.value = !0;
    try {
      return await v();
    } finally {
      o.value = !1;
    }
  }, y = (v, b, k = {}) => {
    const A = e.transform ? e.transform(s) : s, L = {
      ...k,
      method: v,
      body: A
    };
    o.value = !0, c.value = !1, i.value = !1, f && clearTimeout(f), m(), k.onStart?.();
    const H = (g) => {
      Object.assign(n, V(s)), u.value = !1, c.value = !0, i.value = !0, k.onSuccess?.(g.page), f = window.setTimeout(
        () => i.value = !1,
        e.successfulTimeout ?? 2e3
      );
    }, M = (g) => {
      const T = g.error?.response?.data?.errors ?? {};
      Object.assign(r, T), k.onError?.(r);
    }, $ = () => {
      o.value = !1, h.off("push", H), h.off("error", M), h.off("ready", $), h.off("navigated", $), k.onFinish?.();
    };
    h.once("push", H), h.once("error", M), h.once("ready", $), h.visit(b, L).catch(M);
  };
  return q({
    ...Je(s),
    data: s,
    isDirty: u,
    errors: r,
    hasErrors: d,
    processing: o,
    progress: l,
    wasSuccessful: c,
    recentlySuccessful: i,
    submit: y,
    get: (v, b) => y("GET", v, b),
    post: (v, b) => y("POST", v, b),
    put: (v, b) => y("PUT", v, b),
    patch: (v, b) => y("PATCH", v, b),
    delete: (v, b) => y("DELETE", v, b),
    process: w,
    reset: _,
    clearErrors: m,
    setData: p
  });
}
function Mt(a, e = 300, t = 10) {
  if (a || (a = document.querySelector("main")), !a || !(a instanceof HTMLElement) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const n = performance.now(), r = a.style.transform;
  function o(c) {
    if (c - n >= e) {
      a.style.transform = r;
      return;
    }
    const l = (Math.random() * 2 - 1) * t, u = (Math.random() * 2 - 1) * t;
    a.style.transform = `translate(${l}px, ${u}px)`, requestAnimationFrame(o);
  }
  requestAnimationFrame(o);
}
const dt = {
  key: 0,
  class: "fictif-multistep__overlay"
}, ft = 50, Ct = {
  __name: "multi-step",
  emits: ["before-leave", "after-leave"],
  setup(a, { expose: e, emit: t }) {
    const s = t, n = Pe(), r = E(null), o = E(null), c = E(null), i = E(!1), l = E("next"), u = E(0), f = F(
      () => n.default ? n.default().map((g) => g.props.name) : Object.keys(n)
    ), h = E(0), d = F(() => f.value[h.value]), m = F(() => `ms-slide-${l.value}`), _ = E(d.value), p = E(0), w = E(0), y = F(() => h.value < f.value.length - 1), D = F(() => h.value > 0);
    function v(g) {
      if (!g) return { w: 0, h: 0 };
      const { width: R, height: T } = g.getBoundingClientRect();
      return { w: Math.round(R), h: Math.round(T) };
    }
    Z(async () => {
      await U();
      const { w: g, h: R } = v(o.value);
      p.value = g, w.value = R;
    });
    async function b(g) {
      if (i.value || g < 0 || g >= f.value.length || g === h.value)
        return;
      let R = !1;
      const T = () => R = !0;
      let O;
      const he = g > h.value ? "next" : "prev", Oe = {
        from: d.value,
        to: f.value[g],
        direction: he,
        next: () => O(),
        cancel: T
      };
      if (await new Promise((Be) => {
        O = Be, s("before-leave", Oe), O();
      }), R) return;
      await U();
      const { w: Le, h: He } = v(o.value);
      _.value = f.value[g], await U();
      const { w: Fe, h: Ne } = v(c.value);
      l.value = he, h.value = g, i.value = !0, p.value = Le, w.value = He, await U(), p.value = Fe, w.value = Ne;
    }
    function k() {
      i.value = !1, s("after-leave", { current: d.value });
    }
    const A = (g) => u.value = g.touches[0].clientX, L = (g) => {
      const R = g.changedTouches[0].clientX - u.value;
      Math.abs(R) < ft || (R < 0 ? M() : $());
    }, H = (g) => {
      const R = f.value.indexOf(g);
      b(R);
    }, M = () => y.value && b(h.value + 1), $ = () => D.value && b(h.value - 1);
    return e({ goto: H, next: M, back: $, currentStep: d, currentStepIndex: h, steps: f, canGoNext: y, canGoBack: D }), (g, R) => (S(), x(
      de,
      null,
      [
        P(
          "div",
          {
            ref_key: "container",
            ref: r,
            class: "fictif-multistep",
            style: Ce({ width: p.value + "px", height: w.value + "px" }),
            onTouchstart: A,
            onTouchend: L
          },
          [
            i.value ? (S(), x("div", dt)) : C("v-if", !0),
            ie(J, {
              name: m.value,
              onAfterEnter: k
            }, {
              default: K(() => [
                d.value ? (S(), x("div", {
                  key: d.value,
                  class: "fictif-multistep__step",
                  ref: "stepEl"
                }, [
                  P(
                    "div",
                    {
                      class: "fictif-multistep__content",
                      ref_key: "contentEl",
                      ref: o
                    },
                    [
                      ge(g.$slots, d.value)
                    ],
                    512
                    /* NEED_PATCH */
                  )
                ])) : C("v-if", !0)
              ]),
              _: 3
              /* FORWARDED */
            }, 8, ["name"])
          ],
          36
          /* STYLE, NEED_HYDRATION */
        ),
        P(
          "div",
          {
            ref_key: "sizerEl",
            ref: c,
            class: "fictif-multistep__sizer"
          },
          [
            ge(g.$slots, _.value)
          ],
          512
          /* NEED_PATCH */
        )
      ],
      64
      /* STABLE_FRAGMENT */
    ));
  }
};
export {
  ue as API,
  ct as Curtain,
  ot as Display,
  W as EventEmitter,
  Re as FictifVuePlugin,
  ut as Head,
  tt as HeadManager,
  Ct as MultiStep,
  fe as RouteGroup,
  Ze as RouteMap,
  X as Router,
  vt as back,
  kt as configureCurtain,
  mt as createEmitter,
  Tt as createFictifApp,
  ce as createHead,
  nt as createInertiaHandler,
  Ae as createRouter,
  xe as defaults,
  B as errorCodes,
  N as global,
  I as globalAPI,
  Y as globalHead,
  Rt as initAPI,
  Et as initHead,
  _t as initRouter,
  _e as jar,
  bt as redirect,
  yt as response,
  wt as screen,
  Mt as shakeElement,
  et as shouldInterceptLink,
  rt as useAPI,
  De as useCurtain,
  St as useForm,
  le as useHead,
  ae as useRouter,
  Qe as useScreens,
  gt as view
};
