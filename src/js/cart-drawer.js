import {
  CartItemRemoveEvent,
  CartItemQuantityChangeEvent,
} from "./utils/events";
import { CartAPI } from "./utils/cart-api";
import eventBus from "./utils/event-bus";

/**
 * CartDrawer component that handles the cart drawer interactions.
 *
 * @export
 * @class CartDrawer
 * @extends {HTMLElement}
 */
export class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.trigger = null;
    this.drawerTriggers = [];
    this.backdropOverlay = null;

    this.touchStartX = 0;
    this.touchEndX = 0;
    this.swipeThreshold = 50; // Minimum distance for a swipe

    this.subscriptions = [];

    this.openBound = this.open.bind(this);
    this.closeBound = this.close.bind(this);
    this.onDocumentKeyDownBound = this.onDocumentKeyDown.bind(this);

    this.onAddItemBound = this.onAddItem.bind(this);
    this.onChangeItemQuantityBound = this.onChangeItemQuantity.bind(this);
    this.onRemoveItemBound = this.onRemoveItem.bind(this);
    this.onBeforeUpdateCartBound = this.onBeforeUpdateCart.bind(this);
    this.onAfterUpdateCartBound = this.onAfterUpdateCart.bind(this);

    this.handleTouchStartBound = this.handleTouchStart.bind(this);
    this.handleTouchMoveBound = this.handleTouchMove.bind(this);
    this.handleTouchEndBound = this.handleTouchEnd.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "dialog");

    this.trigger = document.querySelector("cart-trigger");
    this.backdropOverlay = document.querySelector("backdrop-root");

    if (this.trigger) {
      this.trigger.addEventListener("click", this.openBound);
    }

    if (this.backdropOverlay) {
      this.backdropOverlay.addEventListener("click", this.closeBound);
    }

    this.connectDrawerTriggers();

    this.addEventListener(
      CartItemQuantityChangeEvent.type,
      this.onChangeItemQuantityBound
    );
    this.addEventListener(CartItemRemoveEvent.type, this.onRemoveItemBound);

    // Close cart drawer on escape key press
    document.addEventListener("keydown", this.onDocumentKeyDownBound);

    // Add touch event listeners
    this.addEventListener("touchstart", this.handleTouchStartBound);
    this.addEventListener("touchmove", this.handleTouchMoveBound);
    this.addEventListener("touchend", this.handleTouchEndBound);

    this.subscriptions.push(
      eventBus.on("cart-item-add", this.onAddItemBound),
      eventBus.on("cart-update-before", this.onBeforeUpdateCartBound),
      eventBus.on("cart-update-after", this.onAfterUpdateCartBound)
    );
  }

  disconnectedCallback() {
    if (this.trigger) {
      this.trigger.removeEventListener("click", this.openBound);
    }

    if (this.backdropOverlay) {
      this.backdropOverlay.removeEventListener("click", this.closeBound);
    }

    this.disconnectDrawerTriggers();

    this.removeEventListener(
      CartItemQuantityChangeEvent.type,
      this.onChangeItemQuantityBound
    );
    this.removeEventListener(CartItemRemoveEvent.type, this.onRemoveItemBound);

    document.removeEventListener("keydown", this.onDocumentKeyDownBound);

    // Remove touch event listeners
    this.removeEventListener("touchstart", this.handleTouchStartBound);
    this.removeEventListener("touchmove", this.handleTouchMoveBound);
    this.removeEventListener("touchend", this.handleTouchEndBound);

    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions = [];
  }

  connectDrawerTriggers() {
    this.drawerTriggers = document.querySelectorAll("cart-drawer-trigger");

    this.drawerTriggers.forEach((trigger) => {
      trigger.addEventListener("click", this.closeBound);
    });
  }

  disconnectDrawerTriggers() {
    this.drawerTriggers.forEach((trigger) => {
      trigger.removeEventListener("click", this.closeBound);
    });
  }

  open() {
    if (!this.backdropOverlay) {
      return;
    }

    this.backdropOverlay.classList.remove("translate-x-full");
    this.classList.remove("translate-x-full");
    this.setAttribute("aria-hidden", "false");
  }

  close() {
    if (!this.backdropOverlay) {
      return;
    }

    this.backdropOverlay.classList.add("translate-x-full");
    this.classList.add("translate-x-full");
    this.setAttribute("aria-hidden", "true");
  }

  /** @param {KeyboardEvent} event */
  onDocumentKeyDown(event) {
    if (
      event.key === "Escape" &&
      this.getAttribute("aria-hidden") === "false"
    ) {
      this.closeBound();
    }
  }

  disableItem(line) {
    const item = this.querySelector(`cart-item[data-index="${line}"]`);

    if (item) {
      item.classList.add("disabled");
    }
  }

  onBeforeUpdateCart(updates) {
    const { line } = updates;

    if (line !== undefined) {
      this.disableItem(line);
    }
  }

  onAfterUpdateCart() {
    this.updateCartDrawerContent();
  }

  async onAddItem() {
    await this.updateCartDrawerContent();
    this.open();
  }

  async onChangeItemQuantity(event) {
    event.stopPropagation();

    const { line, quantity } = event.detail;

    await CartAPI.updateCart({ line, quantity });
  }

  async onRemoveItem(event) {
    event.stopPropagation();

    const { line } = event.detail;

    await CartAPI.updateCart({ line, quantity: 0 });
  }

  /**
   * Update the cart drawer content and subtotal from the fetched HTML.
   *
   * @memberof CartDrawer
   */
  async updateCartDrawerContent() {
    const response = await fetch("/?sections=cart-drawer");

    if (!response.ok) {
      throw new Error("Failed to fetch cart-drawer");
    }
    const json = await response.json();
    const parser = new DOMParser();
    const html = parser.parseFromString(json["cart-drawer"], "text/html");
    const cartDrawerRoot = html.querySelector("cart-drawer-root");

    if (!cartDrawerRoot) {
      throw new Error("Unable to update cart drawer content");
    }

    // Update cart drawer contents
    this.innerHTML = cartDrawerRoot.innerHTML;

    // Reset drawer trigger events
    this.disconnectDrawerTriggers();
    this.connectDrawerTriggers();
  }

  /**
   * Handle touch start, move, and end events
   */
  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchMove(event) {
    if (this.getAttribute("aria-hidden") === "true") {
      return;
    }

    const touchX = event.touches[0].clientX;
    const diff = this.touchStartX - touchX;

    // Only allow right swipes
    if (diff < 0) {
      event.preventDefault();
      this.style.transform = `translateX(${Math.abs(diff)}px)`;
    }
  }

  handleTouchEnd(event) {
    if (this.getAttribute("aria-hidden") === "true") {
      return;
    }

    this.touchEndX = event.changedTouches[0].clientX;
    const diff = this.touchStartX - this.touchEndX;
    const absDiff = Math.abs(diff);

    this.style.transform = "";

    if (absDiff > this.swipeThreshold) {
      if (diff < 0) {
        // Swipe right - close menu
        this.closeBound();
      }
    }
  }
}
