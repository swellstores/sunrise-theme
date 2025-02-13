const t = {
    addToCart: window.Shopify.routes.root + "cart/add.js",
    updateCart: window.Shopify.routes.root + "cart/update.js",
    getCart: window.Shopify.routes.root + "cart.js",
    clearCart: window.Shopify.routes.root + "cart/clear.js",
  },
  e = {
    async addToCart(e, n = 1) {
      try {
        const i = await fetch(t.addToCart, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({ items: [{ id: e, quantity: n }] }),
        });
        if (!i.ok) throw new Error("Network response was not ok");
        const r = await i.json();
        return console.log("Product added to cart:", r), r;
      } catch (t) {
        throw (console.error("Error adding product to cart:", t), t);
      }
    },
    async getCart() {
      try {
        const e = await fetch(t.getCart, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });
        if (!e.ok) throw new Error("Network response was not ok");
        const n = await e.json();
        return console.log("Cart:", n), n;
      } catch (t) {
        throw (console.error("Error getting cart:", t), t);
      }
    },
    async clearCart() {
      try {
        const e = await fetch(t.clearCart, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });
        if (!e.ok) throw new Error("Network response was not ok");
        const n = await e.json();
        return console.log("Cart cleared:", n), n;
      } catch (t) {}
    },
    async updateCart(e) {
      try {
        const n = await fetch(t.updateCart, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({ updates: e }),
        });
        if (!n.ok) throw new Error("Network response was not ok");
        const i = await n.json();
        return console.log("Cart updated:", i), i;
      } catch (t) {
        throw (console.error("Error updating cart:", t), t);
      }
    },
  };
class n extends HTMLElement {
  constructor() {
    super(), this.init();
  }
  init() {
    this &&
      document.addEventListener(
        "quantity-change",
        this.handleUpdateCart.bind(this)
      );
  }
  async fetchCartContent() {
    const t = await fetch("/?sections=cart");
    if (!t.ok) throw new Error("Failed to fetch cart");
    const e = await t.json();
    return new DOMParser().parseFromString(e.cart, "text/html");
  }
  async handleUpdateCart(t) {
    const { variantId: n, quantity: i } = t.detail,
      r = document.querySelectorAll("input[data-variant-id]"),
      o = this.querySelector(`tr[data-variant-id="${n}"]`),
      s = {};
    r.forEach((t) => {
      const e = t.getAttribute("data-variant-id"),
        n = parseInt(t.value, 10);
      s[e] = n;
    });
    try {
      0 === i && o && o.classList.add("opacity-20"), await e.updateCart(s);
      const t = await this.fetchCartContent();
      this.updateCartContent(t);
    } catch (t) {
      console.error("Error handling update cart:", t);
    }
  }
  async updateCartContent(t) {
    const e = this,
      n = t.querySelector("cart-root").innerHTML;
    if (!e || !n) throw new Error("No cart content found to update");
    e.innerHTML = n;
  }
}
const i = {
  activeComponent: null,
  open(t) {
    this.activeComponent &&
      this.activeComponent !== t &&
      this.activeComponent.close(),
      (this.activeComponent = t),
      t.open();
  },
  close(t) {
    this.activeComponent === t && (t.close(), (this.activeComponent = null));
  },
};
class r extends HTMLElement {
  constructor() {
    super(),
      (this.body = document.body),
      (this.trigger = document.querySelector("cart-trigger")),
      (this.target = this),
      (this.content = document.querySelector("cart-drawer-content")),
      (this.drawerTriggers = document.querySelectorAll("cart-drawer-trigger")),
      (this.backdropOverlay = document.querySelector("backdrop-root")),
      (this.announcement = document.querySelector("announcement-root")),
      (this.header = document.querySelector("header")),
      (this.searchDialog = document.querySelector("search-dialog-root")),
      (this.cartDrawerButton = document.querySelector("cart-drawer-button")),
      (this.cartCount = document.querySelector("cart-count")),
      (this.cartSubtotal = document.querySelector("cart-drawer-subtotal")),
      (this.cartItemPrices = document.querySelectorAll(
        "cart-drawer-item-price"
      )),
      (this.pdpQuantitySelector = document.querySelector(
        "quantity-selector-root[data-context='pdp']"
      )),
      (this.cartQuantitySelector = document.querySelector("form#cart")),
      this.init();
  }
  init() {
    this.updateSelectors();
    this.bindEvents();

    this.trigger && this.trigger.addEventListener("click", () => i.open(this)),
      this.drawerTriggers.length > 0 &&
        this.drawerTriggers.forEach((t) => {
          t.addEventListener("click", () => i.close(this));
        }),
      document.addEventListener("keydown", (t) => {
        "Escape" === t.key &&
          this.target &&
          "false" === this.target.getAttribute("aria-hidden") &&
          i.close(this);
      }),
      this.backdropOverlay &&
        this.backdropOverlay.addEventListener("click", (t) => {
          this.target &&
            "false" === this.target.getAttribute("aria-hidden") &&
            !this?.target.contains(t.target) &&
            i.close(this);
        }),
      document.addEventListener(
        "quantity-change",
        this.handleUpdateCart.bind(this)
      );

    if (this.pdpQuantitySelector) {
      this.cartDrawerButton.addEventListener(
        "click",
        this.handlePDPAddToCart.bind(this)
      );
    }
  }

  updateSelectors() {
    this.trigger = document.querySelector("cart-trigger");
    this.drawerTriggers = document.querySelectorAll("cart-drawer-trigger");
    this.cartDrawerButton = document.querySelector("cart-drawer-button");
    this.pdpQuantitySelector = document.querySelector(
      "quantity-selector-root[data-context='pdp']"
    );
    this.cartQuantitySelector = document.querySelector("form#cart");
  }

  bindEvents() {
    this.trigger && this.trigger.addEventListener("click", () => i.open(this));
    this.drawerTriggers.length > 0 &&
      this.drawerTriggers.forEach((t) => {
        t.addEventListener("click", () => i.close(this));
      });
    // this.cartDrawerButton &&
    //   this.cartDrawerButton.addEventListener(
    //     "click",
    //     this.handleAddToCart.bind(this)
    //   );
  }

  async handlePDPAddToCart(event) {
    event.preventDefault();

    if (!this.pdpQuantitySelector) return;

    const quantityInput = this.pdpQuantitySelector.querySelector("input");

    if (!quantityInput) {
      console.error("Quantity input not found");
      return;
    }
    let variantId;
    const quantity = parseInt(quantityInput.value);

    const variantContainer =
      document.querySelector("variant-radio") ||
      document.querySelector("select[data-index='option1']");

    const addToCartButton = document.querySelector(".add-to-cart-button");
    const hiddenVariantInput = document.querySelector('input[name="id"]');

    if (variantContainer) {
      if (addToCartButton) {
        variantId = addToCartButton.getAttribute("data-variant-id");
      } else if (hiddenVariantInput) {
        variantId = hiddenVariantInput.value;
      } else {
        console.error("🚨 Variant ID not found!");
      }
    } else {
      // If no variants, use data-variant-id directly from the quantity input
      variantId = quantityInput.getAttribute("data-variant-id");
      if (!variantId) {
        console.error("Variant ID not found");
        return;
      }
    }

    try {
      const response = await fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity,
        }),
      });

      if (!response.ok) throw new Error("Failed to add item to cart");

      const data = await response.json();

      // Fetch the updated cart details
      const cartResponse = await fetch("/cart.js");
      if (!cartResponse.ok) throw new Error("Failed to fetch cart details");
      const cartData = await cartResponse.json();

      // Update item count
      if (this.cartCount) {
        this.cartCount.textContent = cartData.item_count; // Update item count in UI
      }

      // Fetch and update cart drawer content
      const updatedCartContent = await this.fetchCartDrawerContent();
      this.updateCartDrawerContent(updatedCartContent);

      // Open cart drawer
      if (typeof i !== "undefined" && typeof i.open === "function") {
        i.open(this);
      } else {
        console.error("Cart drawer opening logic is not defined");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }

  async fetchCartDrawerContent() {
    const t = await fetch("/?sections=cart-drawer");
    if (!t.ok) throw new Error("Failed to fetch cart-drawer");
    const e = await t.json();
    return new DOMParser().parseFromString(e["cart-drawer"], "text/html");
  }
  toggleLoader(t) {
    const e = this.cartDrawerButton.querySelector("span"),
      n = this.cartDrawerButton.querySelector('div[role="status"]');
    e && e.classList.toggle("hidden", t),
      n && (n.classList.toggle("hidden", !t), n.classList.toggle("flex", t));
  }
  async handleAddToCart(t) {
    t.preventDefault();
    const n = this.cartDrawerButton.getAttribute("data-variant-id"),
      r = Number(this.cartDrawerButton.getAttribute("data-variant-quantity"));
    this.toggleLoader(!0);
    try {
      await e.addToCart(n, r);
      const t = await this.fetchCartDrawerContent();
      this.updateCartDrawerContent(t);
      const o = await e.getCart();
      (this.cartCount.textContent = o.item_count), i.open(this);
    } catch (t) {
      console.error("Error handling add to cart:", t);
    } finally {
      this.toggleLoader(!1);
    }
  }

  async handleUpdateCart(t) {
    const { variantId: n, quantity: i } = t.detail;

    const a = this.cartSubtotal;
    const c = a.querySelector("span");
    const l = a.querySelector('div[role="status"]');

    try {
      // Fetch updated cart content and update DOM
      // const updatedCartHTML = await this.fetchCartDrawerContent();
      // this.updateCartDrawerContent(updatedCartHTML);

      // Requery cart item inputs after refresh
      const r = this.cartQuantitySelector.querySelectorAll(
        "input[data-variant-id]"
      );

      console.log(
        "Updated cart inputs:",
        [...r].map((el) => el.getAttribute("data-variant-id"))
      );

      // Build the payload dynamically from the DOM
      const payload = {};
      r.forEach((input) => {
        const id = input.getAttribute("data-variant-id");
        const quantity = parseInt(input.value, 10);

        if (id === n) {
          // Update the specific variant quantity
          payload[id] = i;
        } else {
          // Add other items as-is
          payload[id] = quantity;
        }
      });

      // Log the payload before the update
      console.log("Payload before cart update:", payload);

      // Handle UI updates
      if (i === 0) {
        const o = this.querySelector(
          `cart-drawer-item[data-variant-id="${n}"]`
        );
        if (o) o.classList.add("opacity-20");
      }
      if (c) c.classList.add("hidden");
      if (l) {
        l.classList.remove("hidden");
        l.classList.add("flex");
      }

      await e.updateCart(payload);
      const t = await this.fetchCartDrawerContent();
      const cartData = await e.getCart();
      this.cartCount.textContent = cartData.item_count;

      this.updateCartDrawerContent(t);
    } catch (error) {
      console.error("Error handling update cart:", error);
    } finally {
      l && (l.classList.add("hidden"), l.classList.remove("flex")),
        c && c.classList.remove("hidden");
    }
  }

  async updateCartDrawerContent(t) {
    const e = this.content,
      n = t.querySelector("cart-drawer-content")?.innerHTML;
    if (!n || !e) throw new Error("No cart drawer content found to update");
    e.innerHTML = n;
    const i = t.querySelector("cart-drawer-subtotal")?.innerHTML;
    if (!i || !this.cartSubtotal)
      throw new Error(
        "No existing subtotal element found or no new subtotal found"
      );
    this.cartSubtotal.innerHTML = i;

    const root = document.querySelector("cart-drawer-root"),
      newRootContent = t.querySelector("cart-drawer-root")?.innerHTML;

    if (!newRootContent || !root)
      throw new Error("No cart drawer root content found to update");

    root.innerHTML = newRootContent;
    // Reinitialize event listeners
    this.reinitializeEvents();
  }

  reinitializeEvents() {
    this.updateSelectors(); // Re-query all selectors
    this.bindEvents(); // Rebind all events
  }

  open() {
    this.header &&
      this.backdropOverlay &&
      this.target &&
      this.searchDialog &&
      (this.body.classList.add("overflow-hidden"),
      this.header.classList.remove("z-60"),
      this.header.classList.add("z-10"),
      this.announcement &&
        (this.announcement.classList.remove("z-60"),
        this.announcement.classList.add("z-10")),
      this.searchDialog.classList.remove("z-50"),
      this.backdropOverlay.classList.remove("translate-x-full"),
      this.target.classList.remove("translate-x-full"),
      this.target.setAttribute("aria-hidden", "false"));
  }
  close() {
    this.header &&
      this.backdropOverlay &&
      this.target &&
      (this.body.classList.remove("overflow-hidden"),
      this.header.classList.add("z-60"),
      this.header.classList.remove("z-10"),
      this.announcement &&
        (this.announcement.classList.add("z-60"),
        this.announcement.classList.remove("z-10")),
      this.searchDialog.classList.add("z-50"),
      this.backdropOverlay.classList.add("translate-x-full"),
      this.target.classList.add("translate-x-full"),
      this.target.setAttribute("aria-hidden", "true"));
  }
}
const o = Math.min,
  s = Math.max,
  a = Math.round,
  c = Math.floor,
  l = (t) => ({ x: t, y: t }),
  d = { left: "right", right: "left", bottom: "top", top: "bottom" },
  u = { start: "end", end: "start" };
function h(t, e, n) {
  return s(t, o(e, n));
}
function f(t, e) {
  return "function" == typeof t ? t(e) : t;
}
function p(t) {
  return t.split("-")[0];
}
function m(t) {
  if (typeof t !== "string" || !t.includes("-")) {
    return null; // Return null or a default value
  }
  return t.split("-")[1];
}
function g(t) {
  return "x" === t ? "y" : "x";
}
function y(t) {
  return "y" === t ? "height" : "width";
}
function w(t) {
  return ["top", "bottom"].includes(p(t)) ? "y" : "x";
}
function v(t) {
  return g(w(t));
}
function b(t, e, n) {
  if (!e || !e.reference || !e.floating) {
    console.error("Invalid argument for 'e':", e);
    return ["error", "error"];
  }
  void 0 === n && (n = !1);
  const i = m(t),
    r = v(t),
    o = y(r);
  let s =
    "x" === r
      ? i === (n ? "end" : "start")
        ? "right"
        : "left"
      : "start" === i
        ? "bottom"
        : "top";
  return e.reference[o] > e.floating[o] && (s = L(s)), [s, L(s)];
}
function x(t) {
  return t.replace(/start|end/g, (t) => u[t]);
}
function L(t) {
  return t.replace(/left|right|bottom|top/g, (t) => d[t]);
}
function E(t) {
  return "number" != typeof t
    ? (function (t) {
        return { top: 0, right: 0, bottom: 0, left: 0, ...t };
      })(t)
    : { top: t, right: t, bottom: t, left: t };
}
function C(t) {
  const { x: e, y: n, width: i, height: r } = t;
  return {
    width: i,
    height: r,
    top: n,
    left: e,
    right: e + i,
    bottom: n + r,
    x: e,
    y: n,
  };
}
function q(t, e, n) {
  let { reference: i, floating: r } = t;
  const o = w(e),
    s = v(e),
    a = y(s),
    c = p(e),
    l = "y" === o,
    d = i.x + i.width / 2 - r.width / 2,
    u = i.y + i.height / 2 - r.height / 2,
    h = i[a] / 2 - r[a] / 2;
  let f;
  switch (c) {
    case "top":
      f = { x: d, y: i.y - r.height };
      break;
    case "bottom":
      f = { x: d, y: i.y + i.height };
      break;
    case "right":
      f = { x: i.x + i.width, y: u };
      break;
    case "left":
      f = { x: i.x - r.width, y: u };
      break;
    default:
      f = { x: i.x, y: i.y };
  }
  switch (m(e)) {
    case "start":
      f[s] -= h * (n && l ? -1 : 1);
      break;
    case "end":
      f[s] += h * (n && l ? -1 : 1);
  }
  return f;
}
async function S(t, e) {
  var n;
  void 0 === e && (e = {});
  const { x: i, y: r, platform: o, rects: s, elements: a, strategy: c } = t,
    {
      boundary: l = "clippingAncestors",
      rootBoundary: d = "viewport",
      elementContext: u = "floating",
      altBoundary: h = !1,
      padding: p = 0,
    } = f(e, t),
    m = E(p),
    g = a[h ? ("floating" === u ? "reference" : "floating") : u],
    y = C(
      await o.getClippingRect({
        element:
          null == (n = await (null == o.isElement ? void 0 : o.isElement(g))) ||
          n
            ? g
            : g.contextElement ||
              (await (null == o.getDocumentElement
                ? void 0
                : o.getDocumentElement(a.floating))),
        boundary: l,
        rootBoundary: d,
        strategy: c,
      })
    ),
    w =
      "floating" === u
        ? { x: i, y: r, width: s.floating.width, height: s.floating.height }
        : s.reference,
    v = await (null == o.getOffsetParent
      ? void 0
      : o.getOffsetParent(a.floating)),
    b = ((await (null == o.isElement ? void 0 : o.isElement(v))) &&
      (await (null == o.getScale ? void 0 : o.getScale(v)))) || { x: 1, y: 1 },
    x = C(
      o.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: a,
            rect: w,
            offsetParent: v,
            strategy: c,
          })
        : w
    );
  return {
    top: (y.top - x.top + m.top) / b.y,
    bottom: (x.bottom - y.bottom + m.bottom) / b.y,
    left: (y.left - x.left + m.left) / b.x,
    right: (x.right - y.right + m.right) / b.x,
  };
}
function k() {
  return "undefined" != typeof window;
}
function A(t) {
  return O(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function T(t) {
  var e;
  return (
    (null == t || null == (e = t.ownerDocument) ? void 0 : e.defaultView) ||
    window
  );
}
function R(t) {
  var e;
  return null == (e = (O(t) ? t.ownerDocument : t.document) || window.document)
    ? void 0
    : e.documentElement;
}
function O(t) {
  return !!k() && (t instanceof Node || t instanceof T(t).Node);
}
function D(t) {
  return !!k() && (t instanceof Element || t instanceof T(t).Element);
}
function M(t) {
  return !!k() && (t instanceof HTMLElement || t instanceof T(t).HTMLElement);
}
function P(t) {
  return (
    !(!k() || "undefined" == typeof ShadowRoot) &&
    (t instanceof ShadowRoot || t instanceof T(t).ShadowRoot)
  );
}
function I(t) {
  const { overflow: e, overflowX: n, overflowY: i, display: r } = z(t);
  return (
    /auto|scroll|overlay|hidden|clip/.test(e + i + n) &&
    !["inline", "contents"].includes(r)
  );
}
function H(t) {
  return ["table", "td", "th"].includes(A(t));
}
function F(t) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return t.matches(e);
    } catch (t) {
      return !1;
    }
  });
}
function B(t) {
  const e = N(),
    n = D(t) ? z(t) : t;
  return (
    "none" !== n.transform ||
    "none" !== n.perspective ||
    (!!n.containerType && "normal" !== n.containerType) ||
    (!e && !!n.backdropFilter && "none" !== n.backdropFilter) ||
    (!e && !!n.filter && "none" !== n.filter) ||
    ["transform", "perspective", "filter"].some((t) =>
      (n.willChange || "").includes(t)
    ) ||
    ["paint", "layout", "strict", "content"].some((t) =>
      (n.contain || "").includes(t)
    )
  );
}
function N() {
  return (
    !("undefined" == typeof CSS || !CSS.supports) &&
    CSS.supports("-webkit-backdrop-filter", "none")
  );
}
function j(t) {
  return ["html", "body", "#document"].includes(A(t));
}
function z(t) {
  return T(t).getComputedStyle(t);
}
function W(t) {
  return D(t)
    ? { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop }
    : { scrollLeft: t.scrollX, scrollTop: t.scrollY };
}
function _(t) {
  if ("html" === A(t)) return t;
  const e = t.assignedSlot || t.parentNode || (P(t) && t.host) || R(t);
  return P(e) ? e.host : e;
}
function V(t) {
  const e = _(t);
  return j(e)
    ? t.ownerDocument
      ? t.ownerDocument.body
      : t.body
    : M(e) && I(e)
      ? e
      : V(e);
}
function X(t, e, n) {
  var i;
  void 0 === e && (e = []), void 0 === n && (n = !0);
  const r = V(t),
    o = r === (null == (i = t.ownerDocument) ? void 0 : i.body),
    s = T(r);
  if (o) {
    const t = $(s);
    return e.concat(
      s,
      s.visualViewport || [],
      I(r) ? r : [],
      t && n ? X(t) : []
    );
  }
  return e.concat(r, X(r, [], n));
}
function $(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function J(t) {
  const e = z(t);
  let n = parseFloat(e.width) || 0,
    i = parseFloat(e.height) || 0;
  const r = M(t),
    o = r ? t.offsetWidth : n,
    s = r ? t.offsetHeight : i,
    c = a(n) !== o || a(i) !== s;
  return c && ((n = o), (i = s)), { width: n, height: i, $: c };
}
function U(t) {
  return D(t) ? t : t.contextElement;
}
function G(t) {
  const e = U(t);
  if (!M(e)) return l(1);
  const n = e.getBoundingClientRect(),
    { width: i, height: r, $: o } = J(e);
  let s = (o ? a(n.width) : n.width) / i,
    c = (o ? a(n.height) : n.height) / r;
  return (
    (s && Number.isFinite(s)) || (s = 1),
    (c && Number.isFinite(c)) || (c = 1),
    { x: s, y: c }
  );
}
const Y = l(0);
function K(t) {
  const e = T(t);
  return N() && e.visualViewport
    ? { x: e.visualViewport.offsetLeft, y: e.visualViewport.offsetTop }
    : Y;
}
function Q(t, e, n, i) {
  void 0 === e && (e = !1), void 0 === n && (n = !1);
  const r = t.getBoundingClientRect(),
    o = U(t);
  let s = l(1);
  e && (i ? D(i) && (s = G(i)) : (s = G(t)));
  const a = (function (t, e, n) {
    return void 0 === e && (e = !1), !(!n || (e && n !== T(t))) && e;
  })(o, n, i)
    ? K(o)
    : l(0);
  let c = (r.left + a.x) / s.x,
    d = (r.top + a.y) / s.y,
    u = r.width / s.x,
    h = r.height / s.y;
  if (o) {
    const t = T(o),
      e = i && D(i) ? T(i) : i;
    let n = t,
      r = $(n);
    for (; r && i && e !== n; ) {
      const t = G(r),
        e = r.getBoundingClientRect(),
        i = z(r),
        o = e.left + (r.clientLeft + parseFloat(i.paddingLeft)) * t.x,
        s = e.top + (r.clientTop + parseFloat(i.paddingTop)) * t.y;
      (c *= t.x),
        (d *= t.y),
        (u *= t.x),
        (h *= t.y),
        (c += o),
        (d += s),
        (n = T(r)),
        (r = $(n));
    }
  }
  return C({ width: u, height: h, x: c, y: d });
}
function Z(t, e) {
  const n = W(t).scrollLeft;
  return e ? e.left + n : Q(R(t)).left + n;
}
function tt(t, e, n) {
  let i;
  if ("viewport" === e)
    i = (function (t, e) {
      const n = T(t),
        i = R(t),
        r = n.visualViewport;
      let o = i.clientWidth,
        s = i.clientHeight,
        a = 0,
        c = 0;
      if (r) {
        (o = r.width), (s = r.height);
        const t = N();
        (!t || (t && "fixed" === e)) && ((a = r.offsetLeft), (c = r.offsetTop));
      }
      return { width: o, height: s, x: a, y: c };
    })(t, n);
  else if ("document" === e)
    i = (function (t) {
      const e = R(t),
        n = W(t),
        i = t.ownerDocument.body,
        r = s(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth),
        o = s(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
      let a = -n.scrollLeft + Z(t);
      const c = -n.scrollTop;
      return (
        "rtl" === z(i).direction && (a += s(e.clientWidth, i.clientWidth) - r),
        { width: r, height: o, x: a, y: c }
      );
    })(R(t));
  else if (D(e))
    i = (function (t, e) {
      const n = Q(t, !0, "fixed" === e),
        i = n.top + t.clientTop,
        r = n.left + t.clientLeft,
        o = M(t) ? G(t) : l(1);
      return {
        width: t.clientWidth * o.x,
        height: t.clientHeight * o.y,
        x: r * o.x,
        y: i * o.y,
      };
    })(e, n);
  else {
    const n = K(t);
    i = { ...e, x: e.x - n.x, y: e.y - n.y };
  }
  return C(i);
}
function et(t, e) {
  const n = _(t);
  return !(n === e || !D(n) || j(n)) && ("fixed" === z(n).position || et(n, e));
}
function nt(t, e, n) {
  const i = M(e),
    r = R(e),
    o = "fixed" === n,
    s = Q(t, !0, o, e);
  let a = { scrollLeft: 0, scrollTop: 0 };
  const c = l(0);
  if (i || (!i && !o))
    if ((("body" !== A(e) || I(r)) && (a = W(e)), i)) {
      const t = Q(e, !0, o, e);
      (c.x = t.x + e.clientLeft), (c.y = t.y + e.clientTop);
    } else r && (c.x = Z(r));
  let d = 0,
    u = 0;
  if (r && !i && !o) {
    const t = r.getBoundingClientRect();
    (u = t.top + a.scrollTop), (d = t.left + a.scrollLeft - Z(r, t));
  }
  return {
    x: s.left + a.scrollLeft - c.x - d,
    y: s.top + a.scrollTop - c.y - u,
    width: s.width,
    height: s.height,
  };
}
function it(t) {
  return "static" === z(t).position;
}
function rt(t, e) {
  if (!M(t) || "fixed" === z(t).position) return null;
  if (e) return e(t);
  let n = t.offsetParent;
  return R(t) === n && (n = n.ownerDocument.body), n;
}
function ot(t, e) {
  const n = T(t);
  if (F(t)) return n;
  if (!M(t)) {
    let e = _(t);
    for (; e && !j(e); ) {
      if (D(e) && !it(e)) return e;
      e = _(e);
    }
    return n;
  }
  let i = rt(t, e);
  for (; i && H(i) && it(i); ) i = rt(i, e);
  return i && j(i) && it(i) && !B(i)
    ? n
    : i ||
        (function (t) {
          let e = _(t);
          for (; M(e) && !j(e); ) {
            if (B(e)) return e;
            if (F(e)) return null;
            e = _(e);
          }
          return null;
        })(t) ||
        n;
}
const st = {
  convertOffsetParentRelativeRectToViewportRelativeRect: function (t) {
    let { elements: e, rect: n, offsetParent: i, strategy: r } = t;
    const o = "fixed" === r,
      s = R(i),
      a = !!e && F(e.floating);
    if (i === s || (a && o)) return n;
    let c = { scrollLeft: 0, scrollTop: 0 },
      d = l(1);
    const u = l(0),
      h = M(i);
    if ((h || (!h && !o)) && (("body" !== A(i) || I(s)) && (c = W(i)), M(i))) {
      const t = Q(i);
      (d = G(i)), (u.x = t.x + i.clientLeft), (u.y = t.y + i.clientTop);
    }
    return {
      width: n.width * d.x,
      height: n.height * d.y,
      x: n.x * d.x - c.scrollLeft * d.x + u.x,
      y: n.y * d.y - c.scrollTop * d.y + u.y,
    };
  },
  getDocumentElement: R,
  getClippingRect: function (t) {
    let { element: e, boundary: n, rootBoundary: i, strategy: r } = t;
    const a = [
        ...("clippingAncestors" === n
          ? F(e)
            ? []
            : (function (t, e) {
                const n = e.get(t);
                if (n) return n;
                let i = X(t, [], !1).filter((t) => D(t) && "body" !== A(t)),
                  r = null;
                const o = "fixed" === z(t).position;
                let s = o ? _(t) : t;
                for (; D(s) && !j(s); ) {
                  const e = z(s),
                    n = B(s);
                  n || "fixed" !== e.position || (r = null),
                    (
                      o
                        ? !n && !r
                        : (!n &&
                            "static" === e.position &&
                            r &&
                            ["absolute", "fixed"].includes(r.position)) ||
                          (I(s) && !n && et(t, s))
                    )
                      ? (i = i.filter((t) => t !== s))
                      : (r = e),
                    (s = _(s));
                }
                return e.set(t, i), i;
              })(e, this._c)
          : [].concat(n)),
        i,
      ],
      c = a[0],
      l = a.reduce(
        (t, n) => {
          const i = tt(e, n, r);
          return (
            (t.top = s(i.top, t.top)),
            (t.right = o(i.right, t.right)),
            (t.bottom = o(i.bottom, t.bottom)),
            (t.left = s(i.left, t.left)),
            t
          );
        },
        tt(e, c, r)
      );
    return {
      width: l.right - l.left,
      height: l.bottom - l.top,
      x: l.left,
      y: l.top,
    };
  },
  getOffsetParent: ot,
  getElementRects: async function (t) {
    const e = this.getOffsetParent || ot,
      n = this.getDimensions,
      i = await n(t.floating);
    return {
      reference: nt(t.reference, await e(t.floating), t.strategy),
      floating: { x: 0, y: 0, width: i.width, height: i.height },
    };
  },
  getClientRects: function (t) {
    return Array.from(t.getClientRects());
  },
  getDimensions: function (t) {
    const { width: e, height: n } = J(t);
    return { width: e, height: n };
  },
  getScale: G,
  isElement: D,
  isRTL: function (t) {
    return "rtl" === z(t).direction;
  },
};
function at(t, e, n, i) {
  void 0 === i && (i = {});
  const {
      ancestorScroll: r = !0,
      ancestorResize: a = !0,
      elementResize: l = "function" == typeof ResizeObserver,
      layoutShift: d = "function" == typeof IntersectionObserver,
      animationFrame: u = !1,
    } = i,
    h = U(t),
    f = r || a ? [...(h ? X(h) : []), ...X(e)] : [];
  f.forEach((t) => {
    r && t.addEventListener("scroll", n, { passive: !0 }),
      a && t.addEventListener("resize", n);
  });
  const p =
    h && d
      ? (function (t, e) {
          let n,
            i = null;
          const r = R(t);
          function a() {
            var t;
            clearTimeout(n), null == (t = i) || t.disconnect(), (i = null);
          }
          return (
            (function l(d, u) {
              void 0 === d && (d = !1), void 0 === u && (u = 1), a();
              const {
                left: h,
                top: f,
                width: p,
                height: m,
              } = t.getBoundingClientRect();
              if ((d || e(), !p || !m)) return;
              const g = {
                rootMargin:
                  -c(f) +
                  "px " +
                  -c(r.clientWidth - (h + p)) +
                  "px " +
                  -c(r.clientHeight - (f + m)) +
                  "px " +
                  -c(h) +
                  "px",
                threshold: s(0, o(1, u)) || 1,
              };
              let y = !0;
              function w(t) {
                const e = t[0].intersectionRatio;
                if (e !== u) {
                  if (!y) return l();
                  e
                    ? l(!1, e)
                    : (n = setTimeout(() => {
                        l(!1, 1e-7);
                      }, 1e3));
                }
                y = !1;
              }
              try {
                i = new IntersectionObserver(w, {
                  ...g,
                  root: r.ownerDocument,
                });
              } catch (t) {
                i = new IntersectionObserver(w, g);
              }
              i.observe(t);
            })(!0),
            a
          );
        })(h, n)
      : null;
  let m,
    g = -1,
    y = null;
  l &&
    ((y = new ResizeObserver((t) => {
      let [i] = t;
      i &&
        i.target === h &&
        y &&
        (y.unobserve(e),
        cancelAnimationFrame(g),
        (g = requestAnimationFrame(() => {
          var t;
          null == (t = y) || t.observe(e);
        }))),
        n();
    })),
    h && !u && y.observe(h),
    y.observe(e));
  let w = u ? Q(t) : null;
  return (
    u &&
      (function e() {
        const i = Q(t);
        !w ||
          (i.x === w.x &&
            i.y === w.y &&
            i.width === w.width &&
            i.height === w.height) ||
          n();
        (w = i), (m = requestAnimationFrame(e));
      })(),
    n(),
    () => {
      var t;
      f.forEach((t) => {
        r && t.removeEventListener("scroll", n),
          a && t.removeEventListener("resize", n);
      }),
        null == p || p(),
        null == (t = y) || t.disconnect(),
        (y = null),
        u && cancelAnimationFrame(m);
    }
  );
}
const ct = function (t) {
    return (
      void 0 === t && (t = 0),
      {
        name: "offset",
        options: t,
        async fn(e) {
          var n, i;
          const { x: r, y: o, placement: s, middlewareData: a } = e,
            c = await (async function (t, e) {
              const { placement: n, platform: i, elements: r } = t,
                o = await (null == i.isRTL ? void 0 : i.isRTL(r.floating)),
                s = p(n),
                a = m(n),
                c = "y" === w(n),
                l = ["left", "top"].includes(s) ? -1 : 1,
                d = o && c ? -1 : 1,
                u = f(e, t);
              let {
                mainAxis: h,
                crossAxis: g,
                alignmentAxis: y,
              } = "number" == typeof u
                ? { mainAxis: u, crossAxis: 0, alignmentAxis: null }
                : {
                    mainAxis: u.mainAxis || 0,
                    crossAxis: u.crossAxis || 0,
                    alignmentAxis: u.alignmentAxis,
                  };
              return (
                a && "number" == typeof y && (g = "end" === a ? -1 * y : y),
                c ? { x: g * d, y: h * l } : { x: h * l, y: g * d }
              );
            })(e, t);
          return s === (null == (n = a.offset) ? void 0 : n.placement) &&
            null != (i = a.arrow) &&
            i.alignmentOffset
            ? {}
            : { x: r + c.x, y: o + c.y, data: { ...c, placement: s } };
        },
      }
    );
  },
  lt = function (t) {
    return (
      void 0 === t && (t = {}),
      {
        name: "shift",
        options: t,
        async fn(e) {
          const { x: n, y: i, placement: r } = e,
            {
              mainAxis: o = !0,
              crossAxis: s = !1,
              limiter: a = {
                fn: (t) => {
                  let { x: e, y: n } = t;
                  return { x: e, y: n };
                },
              },
              ...c
            } = f(t, e),
            l = { x: n, y: i },
            d = await S(e, c),
            u = w(p(r)),
            m = g(u);
          let y = l[m],
            v = l[u];
          if (o) {
            const t = "y" === m ? "bottom" : "right";
            y = h(y + d["y" === m ? "top" : "left"], y, y - d[t]);
          }
          if (s) {
            const t = "y" === u ? "bottom" : "right";
            v = h(v + d["y" === u ? "top" : "left"], v, v - d[t]);
          }
          const b = a.fn({ ...e, [m]: y, [u]: v });
          return {
            ...b,
            data: { x: b.x - n, y: b.y - i, enabled: { [m]: o, [u]: s } },
          };
        },
      }
    );
  },
  dt = function (t) {
    return (
      void 0 === t && (t = {}),
      {
        name: "flip",
        options: t,
        async fn(e) {
          var n, i;
          const {
              placement: r,
              middlewareData: o,
              rects: s,
              initialPlacement: a,
              platform: c,
              elements: l,
            } = e,
            {
              mainAxis: d = !0,
              crossAxis: u = !0,
              fallbackPlacements: h,
              fallbackStrategy: g = "bestFit",
              fallbackAxisSideDirection: y = "none",
              flipAlignment: v = !0,
              ...E
            } = f(t, e);
          if (null != (n = o.arrow) && n.alignmentOffset) return {};
          const C = p(r),
            q = w(a),
            k = p(a) === a,
            A = await (null == c.isRTL ? void 0 : c.isRTL(l.floating)),
            T =
              h ||
              (k || !v
                ? [L(a)]
                : (function (t) {
                    const e = L(t);
                    return [x(t), e, x(e)];
                  })(a)),
            R = "none" !== y;
          !h &&
            R &&
            T.push(
              ...(function (t, e, n, i) {
                const r = m(t);
                let o = (function (t, e, n) {
                  const i = ["left", "right"],
                    r = ["right", "left"],
                    o = ["top", "bottom"],
                    s = ["bottom", "top"];
                  switch (t) {
                    case "top":
                    case "bottom":
                      return n ? (e ? r : i) : e ? i : r;
                    case "left":
                    case "right":
                      return e ? o : s;
                    default:
                      return [];
                  }
                })(p(t), "start" === n, i);
                return (
                  r &&
                    ((o = o.map((t) => t + "-" + r)),
                    e && (o = o.concat(o.map(x)))),
                  o
                );
              })(a, v, y, A)
            );
          const O = [a, ...T],
            D = await S(e, E),
            M = [];
          let P = (null == (i = o.flip) ? void 0 : i.overflows) || [];
          if ((d && M.push(D[C]), u)) {
            const t = b(r, s, A);
            M.push(D[t[0]], D[t[1]]);
          }
          if (
            ((P = [...P, { placement: r, overflows: M }]),
            !M.every((t) => t <= 0))
          ) {
            var I, H;
            const t = ((null == (I = o.flip) ? void 0 : I.index) || 0) + 1,
              e = O[t];
            if (e)
              return {
                data: { index: t, overflows: P },
                reset: { placement: e },
              };
            let n =
              null ==
              (H = P.filter((t) => t.overflows[0] <= 0).sort(
                (t, e) => t.overflows[1] - e.overflows[1]
              )[0])
                ? void 0
                : H.placement;
            if (!n)
              switch (g) {
                case "bestFit": {
                  var F;
                  const t =
                    null ==
                    (F = P.filter((t) => {
                      if (R) {
                        const e = w(t.placement);
                        return e === q || "y" === e;
                      }
                      return !0;
                    })
                      .map((t) => [
                        t.placement,
                        t.overflows
                          .filter((t) => t > 0)
                          .reduce((t, e) => t + e, 0),
                      ])
                      .sort((t, e) => t[1] - e[1])[0])
                      ? void 0
                      : F[0];
                  t && (n = t);
                  break;
                }
                case "initialPlacement":
                  n = a;
              }
            if (r !== n) return { reset: { placement: n } };
          }
          return {};
        },
      }
    );
  },
  ut = (t) => ({
    name: "arrow",
    options: t,
    async fn(e) {
      const {
          x: n,
          y: i,
          placement: r,
          rects: s,
          platform: a,
          elements: c,
          middlewareData: l,
        } = e,
        { element: d, padding: u = 0 } = f(t, e) || {};
      if (null == d) return {};
      const p = E(u),
        g = { x: n, y: i },
        w = v(r),
        b = y(w),
        x = await a.getDimensions(d),
        L = "y" === w,
        C = L ? "top" : "left",
        q = L ? "bottom" : "right",
        S = L ? "clientHeight" : "clientWidth",
        k = s.reference[b] + s.reference[w] - g[w] - s.floating[b],
        A = g[w] - s.reference[w],
        T = await (null == a.getOffsetParent ? void 0 : a.getOffsetParent(d));
      let R = T ? T[S] : 0;
      (R && (await (null == a.isElement ? void 0 : a.isElement(T)))) ||
        (R = c.floating[S] || s.floating[b]);
      const O = k / 2 - A / 2,
        D = R / 2 - x[b] / 2 - 1,
        M = o(p[C], D),
        P = o(p[q], D),
        I = M,
        H = R - x[b] - P,
        F = R / 2 - x[b] / 2 + O,
        B = h(I, F, H),
        N =
          !l.arrow &&
          null != m(r) &&
          F !== B &&
          s.reference[b] / 2 - (F < I ? M : P) - x[b] / 2 < 0,
        j = N ? (F < I ? F - I : F - H) : 0;
      return {
        [w]: g[w] + j,
        data: {
          [w]: B,
          centerOffset: F - B - j,
          ...(N && { alignmentOffset: j }),
        },
        reset: N,
      };
    },
  }),
  ht = (t, e, n) => {
    const i = new Map(),
      r = { platform: st, ...n },
      o = { ...r.platform, _c: i };
    return (async (t, e, n) => {
      const {
          placement: i = "bottom",
          strategy: r = "absolute",
          middleware: o = [],
          platform: s,
        } = n,
        a = o.filter(Boolean),
        c = await (null == s.isRTL ? void 0 : s.isRTL(e));
      let l = await s.getElementRects({
          reference: t,
          floating: e,
          strategy: r,
        }),
        { x: d, y: u } = q(l, i, c),
        h = i,
        f = {},
        p = 0;
      for (let n = 0; n < a.length; n++) {
        const { name: o, fn: m } = a[n],
          {
            x: g,
            y: y,
            data: w,
            reset: v,
          } = await m({
            x: d,
            y: u,
            initialPlacement: i,
            placement: h,
            strategy: r,
            middlewareData: f,
            rects: l,
            platform: s,
            elements: { reference: t, floating: e },
          });
        (d = null != g ? g : d),
          (u = null != y ? y : u),
          (f = { ...f, [o]: { ...f[o], ...w } }),
          v &&
            p <= 50 &&
            (p++,
            "object" == typeof v &&
              (v.placement && (h = v.placement),
              v.rects &&
                (l =
                  !0 === v.rects
                    ? await s.getElementRects({
                        reference: t,
                        floating: e,
                        strategy: r,
                      })
                    : v.rects),
              ({ x: d, y: u } = q(l, h, c))),
            (n = -1));
      }
      return { x: d, y: u, placement: h, strategy: r, middlewareData: f };
    })(t, e, { ...r, platform: o });
  };

class ft extends HTMLElement {
  constructor() {
    super(),
      (this.backdropOverlay = document.querySelector("backdrop-root")),
      (this.searchInput = this.querySelector('input[type="search"]')),
      (this.triggers = document.querySelectorAll("search-trigger")),
      (this.body = document.body),
      (this.header = document.querySelector("header")),
      (this.announcementBar = document.querySelector("announcement-root")),
      this.init();
  }

  init() {
    this.triggers.forEach((t) => {
      t.addEventListener("click", () => {
        JSON.parse(this.getAttribute("aria-hidden"))
          ? this.open()
          : this.close();
      });
    }),
      this.getAttribute("aria-hidden") &&
        document.addEventListener("keydown", (t) => {
          "Escape" === t.key && this.close();
        }),
      document.addEventListener("click", (t) => {
        this.contains(t.target) ||
          Array.from(this.triggers).some((e) => e.contains(t.target)) ||
          this.close();
      });
  }

  open() {
    if (JSON.parse(this.getAttribute("aria-hidden"))) {
      this.setAttribute("aria-hidden", "false");
      this.backdropOverlay?.classList.remove("translate-x-full");
      this.classList.remove("opacity-0", "pointer-events-none");
      this.computePosition();
      this.searchInput?.focus();
    }
  }

  close() {
    if (!JSON.parse(this.getAttribute("aria-hidden"))) {
      this.setAttribute("aria-hidden", "true");
      this.backdropOverlay?.classList.add("translate-x-full");
      this.classList.add("opacity-0", "pointer-events-none");
    }
  }

  computePosition() {
    // Default top position
    let topOffset = 0;

    // If the announcement bar exists, use its height
    if (this.announcementBar) {
      const announcementHeight = this.announcementBar.offsetHeight || 0;
      topOffset = announcementHeight;
    }

    // Apply the computed top position
    Object.assign(this.style, { top: `${topOffset}px` });
  }
}

class pt extends HTMLElement {
  constructor() {
    super(),
      (this.megaMenu = document.querySelectorAll("mega-menu")),
      (this.trigger = document.querySelectorAll("mega-menu-trigger")),
      this.init();
  }
  init() {
    this.trigger.forEach((t, e) => {
      this.megaMenu &&
        this.trigger &&
        (t.addEventListener("mouseenter", () => {
          this.hideAllMegaMenus(); // Ensure all menus are hidden
          this.megaMenu[e].classList.remove("hidden"); // Show the current menu
        }),
        t.addEventListener("mouseleave", (event) => {
          this.isMouseLeavingAtBottom(event, t) &&
            this.megaMenu[e].classList.add("hidden");
        }),
        this.megaMenu[e].addEventListener("mouseenter", () => {
          this.megaMenu[e].classList.remove("hidden");
        }),
        this.megaMenu[e].addEventListener("mouseleave", (event) => {
          this.isMouseLeavingAtBottom(event, this.megaMenu[e]) &&
            this.megaMenu[e].classList.add("hidden");
        }));
    });
  }

  /**
   * Hide all mega menus.
   */
  hideAllMegaMenus() {
    this.megaMenu.forEach((menu) => menu.classList.add("hidden"));
  }

  /**
   * Check if the mouse is leaving at the bottom of the element.
   * @param {MouseEvent} event
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  isMouseLeavingAtBottom(event, element) {
    const rect = element.getBoundingClientRect();
    return event.clientY >= rect.bottom;
  }

  open() {}
  close() {}
}

class mt extends HTMLElement {
  constructor() {
    super();

    this.triggers = this.querySelectorAll("variant-radio-trigger");
    this.inputs = this.querySelectorAll('input[type="radio"]');
    this.cartDrawerButton = document.querySelector("cart-drawer-button");
    this.colorScheme = document.body.dataset.colorScheme || "scheme-1";

    this.init();
  }

  init() {
    this.triggers.forEach((t) => {
      t.addEventListener("click", (e) => {
        const n = e.currentTarget.getAttribute("aria-labelledby"),
          i = document.getElementById(n);

        if (i && !i.disabled) {
          this.inputs.forEach((t) => {
            t.checked = false;
            t.removeAttribute("checked");
          });

          i.checked = true;
          i.setAttribute("checked", "checked");

          this.updateSelectedVariant(i);
        }

        if (this.cartDrawerButton) {
          const e = t.getAttribute("data-variant-id");
          this.cartDrawerButton.setAttribute("data-variant-id", e);
        }
      });
    });
  }

  updateSelectedVariant(t) {
    this.triggers.forEach((e) => {
      const n = e.getAttribute("aria-labelledby"),
        i = document.getElementById(n);

      if (i && !i.disabled) {
        if (i === t && i.checked) {
          e.classList.add(`btn-primary-${this.colorScheme}`);
          e.classList.remove(
            `btn-secondary-${this.colorScheme}`,
            `hover:btn-primary-${this.colorScheme}`,
            `hover:btn-secondary-${this.colorScheme}`,
            `hover:text-white`
          );
        } else {
          e.classList.remove(
            `btn-primary-${this.colorScheme}`,
            "selected-variant"
          );
          e.classList.add(
            `btn-secondary-${this.colorScheme}`,
            `hover:btn-primary-${this.colorScheme}`,
            `hover:text-white`
          );
        }
      }
    });
  }
}

class gt extends HTMLElement {
  constructor() {
    super(),
      (this.root = this.querySelectorAll("popover-root")),
      (this.trigger = this.querySelectorAll("popover-trigger")),
      (this.content = this.querySelectorAll("popover-content")),
      (this.arrowEl = this.querySelectorAll("popover-arrow")),
      (this.cleanupFns = []),
      (this.hidePopover = () => {}),
      (this.clickOutsideListener = this.handleClickOutside.bind(this)),
      (this.ids = 0),
      this.init();
  }
  init() {
    this.trigger.forEach((t, e) => {
      if (!this.root || !this.trigger) return;
      const n = "popover-" + this.ids++;
      t.setAttribute("aria-describedby", n);
      const i = this.content[e],
        r = this.arrowEl[e];
      if (!i || !r) return;
      i.setAttribute("id", n);
      (this.hidePopover = () => {
        (i.style.display = ""),
          i.remove(),
          this.cleanupFns[e] &&
            (this.cleanupFns[e](), (this.cleanupFns[e] = null)),
          document.removeEventListener("click", this.clickOutsideListener);
      }),
        [
          [
            "click",
            () => {
              document.body.append(i), (i.style.display = "block");
              const n = at(t, i, () => {
                this.updatePosition(t, i, r);
              });
              (this.cleanupFns[e] = n),
                document.addEventListener("click", this.clickOutsideListener);
            },
          ],
        ].forEach(([e, n]) => {
          t.addEventListener(e, n);
        });
    });
  }
  handleClickOutside(t) {
    ![...this.trigger, ...this.content].some((e) => e.contains(t.target)) &&
      this.hidePopover &&
      this.hidePopover();
  }
  updatePosition(t, e, n) {
    ht(t, e, {
      placement: "bottom",
      middleware: [dt(), ct(4), lt({ padding: 48 }), ut({ element: n })],
    }).then(({ x: t, y: i, placement: r, middlewareData: o }) => {
      Object.assign(e.style, { left: `${t}px`, top: `${i}px` });
      const { x: s, y: a } = o.arrow || {},
        c = { top: "bottom", right: "left", bottom: "top", left: "right" }[
          r.split("-")[0]
        ];
      Object.assign(n.style, {
        left: null != s ? `${s}px` : "",
        top: null != a ? `${a}px` : "",
        right: "",
        bottom: "",
        [c]: "-4px",
      });
    });
  }
}
class yt extends HTMLElement {
  constructor() {
    super(),
      (this.triggers = document.querySelectorAll("copy-to-clipboard")),
      this.init();
  }
  init() {
    this.triggers.forEach((t) => {
      t.addEventListener("click", (e) => {
        const n = t.getAttribute("data-copy-content");
        n &&
          navigator.clipboard
            .writeText(n)
            .then(() => {
              console.log("Content copied to clipboard:", n);
            })
            .catch((t) => {
              console.error("Failed to copy content:", t);
            });
      });
    });
  }
}

class wt extends HTMLElement {
  constructor() {
    super(),
      (this.quantity = this.querySelector("input")),
      (this.increment = this.querySelector("quantity-selector-increment")),
      (this.decrement = this.querySelector("quantity-selector-decrement")),
      (this.remove = this.querySelector("quantity-selector-remove")),
      (this.cartContext = this.getAttribute("data-context") === "cart"),
      this.init();
  }

  init() {
    this.increment &&
      this.increment.addEventListener("click", this.handleIncrement.bind(this));
    this.decrement &&
      this.decrement.addEventListener("click", this.handleDecrement.bind(this));

    this.quantity &&
      this.quantity.addEventListener(
        "change",
        this.handleInputChange.bind(this)
      );

    // Bind event for remove button (if exists)
    this.remove &&
      this.remove.addEventListener("click", this.handleRemove.bind(this));
  }

  handleIncrement() {
    if (this.quantity) {
      const step = parseInt(this.quantity.step) || 1;
      const max = parseInt(this.quantity.max) || Infinity;

      let newQuantity = Math.min(parseInt(this.quantity.value) + step, max);
      this.updateQuantity(newQuantity);

      // Fire event only in the cart context
      if (this.cartContext) {
        this.dispatchChangeEvent();
      }
    }
  }

  handleDecrement() {
    if (this.quantity) {
      const step = parseInt(this.quantity.step) || 1;
      const min = parseInt(this.quantity.min) || 0;

      let newQuantity = Math.max(parseInt(this.quantity.value) - step, min);
      this.updateQuantity(newQuantity);

      // Fire event only in the cart context
      if (this.cartContext) {
        this.dispatchChangeEvent();
      }
    }
  }

  handleInputChange() {
    if (this.quantity) {
      const currentQuantity = parseInt(this.quantity.value);
      const min = parseInt(this.quantity.min) || 0;
      const max = parseInt(this.quantity.max) || Infinity;

      let newQuantity = Math.min(Math.max(currentQuantity, min), max);
      this.updateQuantity(newQuantity);

      // Fire event only in the cart context
      if (this.cartContext) {
        this.dispatchChangeEvent();
      }
    }
  }

  handleRemove() {
    if (this.quantity) {
      this.updateQuantity(0); // Set quantity to 0 when removing

      // Fire event only in the cart context
      if (this.cartContext) {
        this.dispatchChangeEvent();
      }
    }
  }

  updateQuantity(newQuantity) {
    this.quantity.value = newQuantity.toString();
    this.quantity.setAttribute("value", newQuantity);
  }

  dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("quantity-change", {
        detail: {
          variantId: this.quantity.getAttribute("data-variant-id"),
          quantity: parseInt(this.quantity.value),
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

// Function E for updating sort filters
// function E(t) {
//   const e = document.querySelector("#filter-form-bar"),
//     i = document.querySelector("#filter-form-stack"),
//     s = document.querySelector("#sort-form"),
//     n = [];
//   let o = {};
//   ["filter-form-bar" === t.target.id ? e : i, s].forEach((t) => {
//     const e = new FormData(t),
//       i = (function (t, e) {
//         const i = new URLSearchParams();
//         return (
//           t.forEach((t, s) => {
//             t && !e.includes(`${s}=${t}`) && i.append(s, t);
//           }),
//           i.toString()
//         );
//       })(e, n);
//     i && n.push(i), (o = { ...o, ...b(e) });
//   });
//   const r = new URL(window.location);
//   (r.search = n.join("&")),
//     window.history.replaceState({}, "", r),
//     (t.detail.parameters = o);
// }

// Main function v for initializing event listeners
function v() {
  // Assign E to window.updateSortFilters for global access
  window.updateSortFilters = E;

  // Filter drawer toggle functionality
  (function () {
    const t = document.querySelectorAll('[data-trigger="filter-drawer"]'),
      e = document.querySelector('[data-target="filter-drawer"]');
    fc = document.querySelector(".overlay-filter");

    // Return early if the filter drawer does not exist
    if (!e) {
      console.warn(
        "Filter drawer not found. Skipping related event listeners."
      );
      return;
    }

    t.forEach((t) => {
      t.addEventListener("click", function (t) {
        const i = "true" === e.getAttribute("aria-expanded");
        e.setAttribute("aria-expanded", !i), e.classList.toggle("hidden");

        // Lock or unlock scroll based on drawer state
        if (!i) {
          document.body.style.overflow = "hidden"; // Lock scroll
        } else {
          document.body.style.overflow = "auto"; // Unlock scroll
        }
      });
    });

    // Close drawer when clicking outside
    document.addEventListener("click", (t) => {
      if (!e) return console.error("Drawer element is not defined");

      const isOpen = e.getAttribute("aria-expanded") === "true";
      const isOutsideClick =
        !e.contains(t.target) &&
        !t.target.closest('[data-target="filter-menu"]') &&
        !t.target.closest('[data-trigger="filter-drawer"]');
      const isOverlayClick = t.target.classList.contains("overlay-filter");

      if (isOpen && (isOutsideClick || isOverlayClick)) {
        e.setAttribute("aria-expanded", "false");
        e.classList.add("hidden");

        // Unlock scroll
        document.body.style.overflow = "auto";
      }
    });
  })();

  // Filter menu toggle functionality
  (function () {
    const t = document.querySelectorAll('[data-trigger="filter-menu"]');
    const menus = document.querySelectorAll('[data-target="filter-menu"]');

    if (!t.length || !menus.length) return;

    function closeAllMenus(event) {
      menus.forEach((menu) => {
        const isClickInsideMenu = menu.contains(event.target);
        const isClickOnTrigger = event.target.closest(
          '[data-trigger="filter-menu"]'
        );

        if (!isClickInsideMenu && !isClickOnTrigger) {
          menu.classList.add("hidden");
          document
            .querySelectorAll('[data-trigger="filter-menu"]')
            .forEach((trigger) => {
              trigger.setAttribute("aria-expanded", "false");
            });
        }
      });
    }

    t.forEach((trigger) => {
      trigger.addEventListener("click", function (event) {
        event.stopPropagation();
        const menu = trigger.nextElementSibling;
        const isOpen = trigger.getAttribute("aria-expanded") === "true";

        // Close all other menus before opening the clicked one
        menus.forEach((m) => m.classList.add("hidden"));
        t.forEach((tr) => tr.setAttribute("aria-expanded", "false"));

        // Toggle the current menu
        trigger.setAttribute("aria-expanded", !isOpen);
        menu.classList.toggle("hidden");
      });
    });

    // Close filter menu when clicking outside
    document.addEventListener("click", closeAllMenus);
  })();
}

// Address Manager Class
class AddressManager {
  constructor() {
    this.toggleButton = document.getElementById("add-address-button");
    this.cancelButtons = document.querySelectorAll(
      'button[name="cancel-button"]'
    );
    this.newAddressForm = document.getElementById("new-address-form");
    this.savedAddresses = document.getElementById("saved-addresses");
    this.editButtons = document.querySelectorAll(".edit-address-button");
    this.removeButtons = document.querySelectorAll(".remove-address-button");

    this.init();
  }

  init() {
    if (this.toggleButton && this.newAddressForm) {
      this.toggleButton.addEventListener("click", () =>
        this.toggleAddressForm()
      );
    }

    this.cancelButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.handleCancel(e));
    });

    this.editButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.openEditForm(e));
    });

    this.removeButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.handleDeleteButtonClick(e));
    });

    // Add country dropdown change handlers
    document
      .querySelectorAll('[name="address[country]"]')
      .forEach((dropdown) => {
        dropdown.addEventListener("change", (event) =>
          this.handleCountryChange(event)
        );
      });
  }

  toggleAddressForm() {
    this.toggleButton.classList.toggle("hidden");
    this.newAddressForm.classList.toggle("hidden");
    this.savedAddresses.classList.toggle("hidden");
  }

  handleCancel(event) {
    const cancelButton = event.target;
    const parentForm = cancelButton.closest(
      '[id^="edit-address-form-"], #new-address-form'
    );
    if (parentForm) {
      parentForm.classList.add("hidden");
    }
    this.savedAddresses.classList.remove("hidden");
    this.toggleButton.classList.remove("hidden");
  }

  openEditForm(event) {
    const button = event.target;
    const addressId = button.getAttribute("data-address-id");
    const editAddressForm = document.getElementById(
      `edit-address-form-${addressId}`
    );
    const addressData = JSON.parse(
      document.getElementById(`address-data-${addressId}`).textContent
    );

    if (editAddressForm) {
      this.populateEditForm(editAddressForm, addressData);
      this.showEditForm(editAddressForm);
    }
  }

  populateEditForm(form, data) {
    const fields = [
      "first_name",
      "last_name",
      "company",
      "address1",
      "address2",
      "city",
      "zip",
      "phone",
    ];

    fields.forEach((field) => {
      const input = form.querySelector(`[name="address[${field}]"]`);
      if (input) input.value = data[field] || "";
    });

    const countryDropdown = form.querySelector('[name="address[country]"]');
    const provinceDropdown = form.querySelector('[name="address[province]"]');
    const provinceContainer = provinceDropdown?.parentElement;

    if (countryDropdown) {
      countryDropdown.value = data.country || "";
      this.handleCountryChange({ target: countryDropdown });

      if (provinceDropdown) {
        if (data.province) {
          provinceDropdown.value = data.province || "";
          provinceContainer.classList.remove("hidden");
        } else {
          provinceContainer.classList.add("hidden");
        }
      }
    }
  }

  showEditForm(form) {
    document.querySelectorAll('[id^="edit-address-form-"]').forEach((form) => {
      form.classList.add("hidden");
    });
    form.classList.remove("hidden");
    this.savedAddresses.classList.add("hidden");
    this.toggleButton.classList.add("hidden");
  }

  handleCountryChange(event) {
    const countryDropdown = event.target;
    const form = countryDropdown.closest("form");
    const provinceDropdown = form.querySelector('[name="address[province]"]');
    const provinceContainer = provinceDropdown?.parentElement;

    const selectedCountry = countryDropdown.value;
    const selectedOption = Array.from(countryDropdown.options).find(
      (option) => option.value === selectedCountry
    );

    if (selectedOption) {
      const provincesRaw = selectedOption.getAttribute("data-provinces");
      const provinces = provincesRaw
        ? JSON.parse(provincesRaw.replace(/&quot;/g, '"'))
        : [];

      provinceDropdown.innerHTML = "";
      if (provinces.length > 0) {
        provinceContainer.classList.remove("hidden");
        provinces.forEach((province) => {
          const option = document.createElement("option");
          option.value = province[1];
          option.textContent = province[0];
          provinceDropdown.appendChild(option);
        });
      } else {
        provinceContainer.classList.add("hidden");
      }
    } else {
      provinceContainer.classList.add("hidden");
    }
  }

  handleDeleteButtonClick(event) {
    const { currentTarget } = event;
    const confirmMessage = currentTarget.getAttribute("data-confirm-message");

    // eslint-disable-next-line no-alert
    if (confirm(confirmMessage)) {
      Shopify.postLink(currentTarget.dataset.target, {
        parameters: { _method: "delete" },
      });
    }
  }
}

class PasswordRecoveryManager {
  constructor(toggleSelector, loginFormSelector, recoverFormSelector) {
    this.toggleRecoverLink = document.querySelector(toggleSelector);
    this.loginForm = document.querySelector(loginFormSelector);
    this.recoverPasswordForm = document.querySelector(recoverFormSelector);

    this.init();
  }

  init() {
    if (this.toggleRecoverLink && this.loginForm && this.recoverPasswordForm) {
      this.toggleRecoverLink.addEventListener("click", (event) =>
        this.handleToggle(event)
      );
    }
  }

  handleToggle(event) {
    event.preventDefault();
    this.loginForm.classList.toggle("hidden");
    this.recoverPasswordForm.classList.toggle("hidden");
  }
}

class FooterManager {
  constructor() {
    this.initCountryFilter();
    this.initLanguageModal();
    this.initModalHandlers();
  }

  initCountryFilter() {
    const searchInput = document.getElementById("country-filter-input");
    const countryResults = document.getElementById("country-results");
    const liveRegion = document.getElementById("sr-country-search-results");
    const form = document.getElementById("FooterCountryForm");
    const hiddenInput = form?.querySelector('input[name="country_code"]');

    if (searchInput && countryResults && form && hiddenInput) {
      searchInput.addEventListener("input", () =>
        this.filterCountries(searchInput, countryResults, liveRegion)
      );

      const countryLinks = countryResults.querySelectorAll("a");
      countryLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const countryCode = link.getAttribute("data-value");
          hiddenInput.value = countryCode;
          form.submit();
        });
      });
    }
  }

  // Filter countries based on user input
  filterCountries(searchInput, countryResults, liveRegion) {
    const normalizeString = (str) =>
      str
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();

    const searchValue = normalizeString(searchInput.value);
    const countryItems = countryResults.querySelectorAll("a");
    let visibleCount = 0;

    countryItems.forEach((item) => {
      const countryName = normalizeString(
        item.querySelector(".country").textContent
      );
      if (countryName.includes(searchValue)) {
        item.parentElement.classList.remove("hidden");
        visibleCount++;
      } else {
        item.parentElement.classList.add("hidden");
      }
    });

    if (liveRegion) {
      liveRegion.textContent = `${visibleCount} results found`;
    }
  }

  // Initialize language modal functionality
  initLanguageModal() {
    const languageResults = document.getElementById("language-results");
    const form = document.getElementById("FooterLanguageForm");
    const hiddenInput = form?.querySelector('input[name="locale_code"]');

    if (languageResults && form && hiddenInput) {
      const languageLinks = languageResults.querySelectorAll("a");
      languageLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const languageCode = link.getAttribute("data-value");
          hiddenInput.value = languageCode;
          form.submit();
        });
      });
    }
  }

  // Initialize modal open/close functionality
  initModalHandlers() {
    const openModal = (modal) => modal.classList.remove("hidden");
    const closeModal = (modal) => modal.classList.add("hidden");

    document.querySelectorAll("[data-target]").forEach((button) => {
      button.addEventListener("click", () => {
        const targetModal = document.querySelector(button.dataset.target);
        if (targetModal) openModal(targetModal);
      });
    });

    document.querySelectorAll("[data-modal]").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.closest(".closeButton")) {
          closeModal(modal);
        }
      });
    });
  }
}

class HeaderManager {
  constructor() {
    this.mobileTray = document.getElementById("mobileTray");
    this.mainMenu = document.getElementById("mainMenu");
    this.submenuTray = document.getElementById("submenuTray");
    this.trayTitle = document.getElementById("trayTitle");
    this.sublinkTrayContent = document.getElementById("sublinkTrayContent");

    this.init();
  }

  init() {
    const toggleButton = document.querySelector(
      'button[onclick="toggleMobileTray()"]'
    );
    if (toggleButton) {
      toggleButton.addEventListener("click", () => this.toggleMobileTray());
    }

    window.openSubMenu = (submenuId, title) =>
      this.openSubMenu(submenuId, title);
    window.closeSubLinkTray = () => this.closeSubLinkTray();
  }

  toggleMobileTray() {
    if (this.mobileTray) {
      this.mobileTray.classList.toggle("hidden");
      const isTrayOpen = !this.mobileTray.classList.contains("hidden");

      const toggleButton = document.querySelector(
        'button[onclick="toggleMobileTray()"]'
      );
      if (toggleButton) {
        toggleButton.innerHTML = isTrayOpen
          ? `
            <!-- Cross Icon -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          `
          : `
            <!-- Hamburger Icon -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          `;
      }
    }
  }

  openSubMenu(submenuId, title) {
    const sublinks = document.querySelector(`#${submenuId}`);

    if (sublinks) {
      this.sublinkTrayContent.innerHTML = "";
      this.renderSublinks(sublinks, this.sublinkTrayContent);

      this.trayTitle.textContent = title;

      this.mainMenu.classList.add("hidden");
      this.submenuTray.classList.remove("hidden");
    } else {
      console.error(`No sublinks found for submenuId: ${submenuId}`);
    }
  }

  closeSubLinkTray() {
    // Show main menu and hide submenu tray
    this.mainMenu.classList.remove("hidden");
    this.submenuTray.classList.add("hidden");
  }

  renderSublinks(sublinks, container) {
    sublinks.querySelectorAll(":scope > li").forEach((item) => {
      const link = item.querySelector("a") || item.querySelector("button");
      const nestedMenu = item.querySelector(":scope > ul");
      const listItem = document.createElement("li");
      listItem.classList.add(
        "h-[48px]",
        "flex",
        "items-center",
        "justify-between",
        "cursor-pointer"
      );

      if (link) {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add(
          "flex",
          "items-center",
          "justify-between",
          "w-full"
        );

        const button = document.createElement("button");
        button.textContent = link.textContent.trim() || "Unnamed";
        button.classList.add("submenu-button", "flex-grow", "text-left");

        if (nestedMenu) {
          const submenuId = nestedMenu.id;
          listItem.setAttribute("data-submenu-id", submenuId);
          listItem.addEventListener("click", () =>
            this.openSubMenu(
              submenuId,
              link.textContent.trim() || "Unnamed Submenu"
            )
          );
        } else if (link.tagName.toLowerCase() === "a") {
          listItem.addEventListener("click", () => {
            window.location.href = link.href;
          });
        }

        const arrowSpan = document.createElement("span");
        arrowSpan.classList.add("flex-shrink-0", "ml-2");
        arrowSpan.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20L20 12L12 4" stroke="#222222" stroke-width="2"></path>
            <path d="M3 11H19V13H3V11Z" fill="#222222"></path>
          </svg>`;

        buttonContainer.appendChild(button);
        buttonContainer.appendChild(arrowSpan);

        listItem.appendChild(buttonContainer);
      } else {
        console.warn("No link or button found for item:", item);
      }

      container.appendChild(listItem);
    });
  }
}

class PriceRangeManager {
  constructor(wrapperSelector, filterData) {
    this.wrapperSelector = wrapperSelector;
    this.filterData = filterData;

    this.init();
    // this.listenForFilterReset();
  }

  init() {
    const priceRangeWrappers = document.querySelectorAll(this.wrapperSelector);

    priceRangeWrappers.forEach((wrapper) => {
      this.initializeWrapper(wrapper);
    });
  }

  initializeWrapper(wrapper) {
    const fromSlider = wrapper.querySelector(".fromSlider");
    const toSlider = wrapper.querySelector(".toSlider");
    const fromInput = wrapper.querySelector(".fromInput");
    const toInput = wrapper.querySelector(".toInput");
    const fromCurrencyLabel = wrapper.querySelector(".currency-label-from");
    const toCurrencyLabel = wrapper.querySelector(".currency-label-to");

    const filterMin = this.filterData.min_value || 0;
    const filterMax = this.filterData.max_value || 100;

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: this.filterData.currency,
      }).format(value);
    };

    const updateCurrencyLabels = () => {
      fromCurrencyLabel.textContent = formatCurrency(fromInput.value);
      toCurrencyLabel.textContent = formatCurrency(toInput.value);
    };

    const syncFromInputToSlider = () => {
      const value = Math.min(fromInput.value, toSlider.value - 1);
      fromSlider.value = value;
      fromInput.value = value;
      updateCurrencyLabels();
    };

    const syncToInputToSlider = () => {
      const value = Math.max(toInput.value, fromSlider.value + 1);
      toSlider.value = value;
      toInput.value = value;
      updateCurrencyLabels();
    };

    const syncFromSliderToInput = () => {
      fromInput.value = fromSlider.value;
      updateCurrencyLabels();
    };

    const syncToSliderToInput = () => {
      toInput.value = toSlider.value;
      updateCurrencyLabels();
    };

    fromInput.addEventListener("input", syncFromInputToSlider);
    toInput.addEventListener("input", syncToInputToSlider);
    fromSlider.addEventListener("input", syncFromSliderToInput);
    toSlider.addEventListener("input", syncToSliderToInput);

    fromSlider.min = toSlider.min = filterMin;
    fromSlider.max = toSlider.max = filterMax;
    fromInput.min = toInput.min = filterMin;
    fromInput.max = toInput.max = filterMax;

    fromInput.value = fromSlider.value = filterMin;
    toInput.value = toSlider.value = filterMax;

    updateCurrencyLabels();
  }

  listenForFilterReset() {
    document.addEventListener("htmx:afterSwap", () => {
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const fromSlider = document.querySelector(".fromSlider");
        const toSlider = document.querySelector(".toSlider");

        // Get URL values
        const urlMin = params.get("price_min");
        const urlMax = params.get("price_max");

        // Only reset if filters were completely removed
        if (!urlMin && !urlMax) {
          const sliderMin = fromSlider.min;
          const sliderMax = toSlider.max;

          // Reset only if sliders are not already at min/max
          if (fromSlider.value !== sliderMin || toSlider.value !== sliderMax) {
            this.resetPriceRange();
          }
        }
      }, 300);
    });
  }

  resetPriceRange() {
    document.querySelectorAll(this.wrapperSelector).forEach((wrapper) => {
      const fromSlider = wrapper.querySelector(".fromSlider");
      const toSlider = wrapper.querySelector(".toSlider");
      const fromInput = wrapper.querySelector(".fromInput");
      const toInput = wrapper.querySelector(".toInput");

      if (fromSlider && toSlider && fromInput && toInput) {
        fromSlider.value = fromSlider.min;
        toSlider.value = toSlider.max;
        fromInput.value = fromSlider.min;
        toInput.value = toSlider.max;

        // Dispatch input event to update UI
        fromSlider.dispatchEvent(new Event("input"));
        toSlider.dispatchEvent(new Event("input"));
      }
    });
  }
}

class Announcement extends HTMLElement {
  constructor() {
    super();
    this.root = this;
    this.trigger = this.querySelector("announcement-trigger");
    this.init();
  }

  init() {
    if (!this.root || !this.trigger) {
      console.error("Root or Trigger not found");
      return;
    }

    this.trigger.addEventListener("click", () => {
      this.dismissAnnouncement();
    });
  }

  dismissAnnouncement() {
    this.root.style.display = "none";
  }
}

class ProductManager {
  constructor() {
    this.thumbnails = document.querySelectorAll(".thumbnail-wrapper");
    this.mainImage = document.getElementById("main-image");
    this.prevArrow = document.getElementById("prev-arrow");
    this.nextArrow = document.getElementById("next-arrow");

    this.variantButtons = document.querySelectorAll("[data-variant-id]");
    this.skuElement = document.querySelector(".sku-span");
    this.variantContainers = document.querySelectorAll("variant-radio");
    this.selectElements = document.querySelectorAll("select[data-index]");
    this.hiddenVariantInput = document.querySelector('input[name="id"]');
    this.quantityInput = document.querySelector(
      'quantity-selector-root[data-context="pdp"]'
    );
    this.addToCartButton = document.querySelector(".add-to-cart-button");
    this.addToCartPrice = this.addToCartButton?.querySelector("span");
    this.priceDisplay = document.querySelector(".product-price");
    this.productVariants = JSON.parse(
      document.querySelector("[data-variants-json]").textContent
    );

    this.currentIndex = 0;
    this.init();
  }

  init() {
    if (this.thumbnails.length <= 1) {
      this.hideArrows();
    }

    this.setInitialMainImage();
    this.bindEvents();
    this.selectFirstAvailableVariant();
  }

  hideArrows() {
    if (this.prevArrow) this.prevArrow.style.display = "none";
    if (this.nextArrow) this.nextArrow.style.display = "none";
  }

  setInitialMainImage() {
    if (this.thumbnails.length > 0) {
      const firstThumbnail = this.thumbnails[0];
      this.updateMainImage(firstThumbnail);
      this.setActiveThumbnail(firstThumbnail);
    }
  }

  bindEvents() {
    if (this.prevArrow) {
      this.prevArrow.addEventListener("click", () => {
        const newIndex =
          (this.currentIndex - 1 + this.thumbnails.length) %
          this.thumbnails.length;
        this.updateMainImageByIndex(newIndex);
      });
    }

    if (this.nextArrow) {
      this.nextArrow.addEventListener("click", () => {
        const newIndex = (this.currentIndex + 1) % this.thumbnails.length;
        this.updateMainImageByIndex(newIndex);
      });
    }

    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () =>
        this.updateMainImageByIndex(index)
      );
    });

    this.variantContainers.forEach((container) => {
      container.addEventListener("click", (event) =>
        this.handleVariantSelection(event)
      );
    });

    this.selectElements.forEach((select) => {
      select.addEventListener("change", () => this.updateVariantSelection());
    });
  }

  updateMainImageByIndex(index) {
    if (index >= 0 && index < this.thumbnails.length) {
      this.currentIndex = index;
      const thumbnail = this.thumbnails[index];
      this.updateMainImage(thumbnail);
      this.setActiveThumbnail(thumbnail);
      thumbnail.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  updateMainImageByVariant(variantId) {
    const matchingThumbnail = Array.from(this.thumbnails).find((thumbnail) => {
      return (thumbnail.getAttribute("data-variant-id") || "")
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "")
        .includes(variantId.toString());
    });

    if (matchingThumbnail) {
      this.updateMainImage(matchingThumbnail);
      this.setActiveThumbnail(matchingThumbnail);
      this.currentIndex = Array.from(this.thumbnails).indexOf(
        matchingThumbnail
      );
      matchingThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    } else {
      console.log("No matching thumbnail");
    }
  }

  updateMainImage(thumbnail) {
    const src = thumbnail.getAttribute("data-large-src");
    const alt = thumbnail.getAttribute("data-large-alt");
    if (this.mainImage) {
      this.mainImage.setAttribute("src", src);
      this.mainImage.setAttribute("alt", alt);
    }
  }

  setActiveThumbnail(thumbnail) {
    this.thumbnails.forEach((thumb) =>
      thumb.classList.remove("active-thumbnail")
    );
    thumbnail.classList.add("active-thumbnail");
  }

  updateSku(variantId) {
    const selectedVariant = this.productVariants.find(
      (variant) => variant.id.toString() === variantId
    );

    if (selectedVariant?.sku && this.skuElement) {
      this.skuElement.textContent = selectedVariant.sku;
    }
  }

  selectFirstAvailableVariant() {
    const firstAvailableVariant = this.productVariants.find(
      (variant) => variant.available
    );

    if (!firstAvailableVariant) {
      console.warn("No available variant found");
      return;
    }

    document.querySelectorAll("fieldset").forEach((fieldset, index) => {
      const optionValue = firstAvailableVariant[`option${index + 1}`];

      const radioInput = [
        ...fieldset.querySelectorAll('input[type="radio"]'),
      ].find(
        (input) => input.nextElementSibling.textContent.trim() === optionValue
      );

      this.selectElements.forEach((select, index) => {
        select.value = firstAvailableVariant[`option${index + 1}`];
      });

      if (radioInput) {
        radioInput.checked = true;
      }
    });

    this.updateVariantSelection();
  }

  handleVariantSelection(event) {
    const trigger = event.target.closest("variant-radio-trigger");

    if (trigger) {
      const associatedInputId = trigger.getAttribute("aria-labelledby");
      const associatedInput = document.getElementById(associatedInputId);

      if (associatedInput) {
        associatedInput.checked = true;
        this.updateVariantSelection();
      }
    }
  }

  updateVariantSelection() {
    let selectedOptions = [];

    document.querySelectorAll("fieldset").forEach((fieldset, index) => {
      const selectedInput = fieldset.querySelector(
        'input[type="radio"]:checked'
      );
      if (selectedInput) {
        selectedOptions[index] =
          selectedInput.nextElementSibling.textContent.trim();
      }
    });

    const matchedVariant = this.productVariants.find((variant) =>
      selectedOptions.every(
        (option, index) => variant[`option${index + 1}`] === option
      )
    );

    if (matchedVariant) {
      this.updateMainImageByVariant(matchedVariant.id);

      if (this.skuElement) {
        this.skuElement.textContent = matchedVariant.sku || "No SKU set";
      }

      if (this.priceDisplay) {
        this.priceDisplay.textContent = Shopify.formatMoney(
          matchedVariant.price,
          window.moneyFormat
        );
      }

      if (this.hiddenVariantInput) {
        this.hiddenVariantInput.value = matchedVariant.id;
      }

      if (this.addToCartButton) {
        this.addToCartButton.setAttribute("data-variant-id", matchedVariant.id);
      }
      // if (this.addToCartPrice) {
      //   const price = matchedVariant?.price || 0;

      //   this.addToCartPrice.textContent = `Add to cart - ${Shopify.formatMoney(price, window.moneyFormat)}`;
      // } else {
      //   console.warn("`addToCartPrice` is not found in the DOM.");
      // }
    } else {
      console.warn("No matching variant found for:", selectedOptions);
    }
  }
}

// Call v to initialize the listeners
v();

customElements.define("cart-root", n),
  customElements.define("cart-drawer-root", r),
  customElements.define("search-dialog-root", ft),
  customElements.define("mega-menu", pt),
  customElements.define("variant-radio", mt),
  customElements.define("popover-root", gt),
  customElements.define("copy-to-clipboard", yt),
  customElements.define("quantity-selector-root", wt),
  (function () {
    if (window.theme) {
      function t(t) {
        var e = document.createElement("script");
        (e.src = t), (e.defer = !0), document.body.appendChild(e);
      }
      window.theme.slideshow_rendered && t(window.theme.slideshow_asset_url),
        window.theme.slideshow_navigation &&
          t(window.theme.slideshow_navigation_asset_url),
        window.theme.accordion_rendered && t(window.theme.accordion_asset_url);
    }
  })();

document.addEventListener("DOMContentLoaded", () => {
  new AddressManager();
  new PasswordRecoveryManager(
    "#toggle-recover",
    "#login-form",
    "#recover-password-form"
  );
  new FooterManager();
  new HeaderManager();
  new PriceRangeManager(".price-range-wrapper", window.filterData);
  customElements.define("announcement-root", Announcement);
  new ProductManager();
});
