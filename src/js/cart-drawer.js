import { DrawerPanel } from "./drawer-panel";
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
 * @extends {DrawerPanel}
 */
export class CartDrawer extends DrawerPanel {
  constructor() {
    super();

    this.trigger = null;
    this.drawerTriggers = [];

    this.subscriptions = [];

    this.openBound = this.open.bind(this);
    this.closeBound = this.close.bind(this);

    this.onAddItemBound = this.onAddItem.bind(this);
    this.onChangeItemQuantityBound = this.onChangeItemQuantity.bind(this);
    this.onRemoveItemBound = this.onRemoveItem.bind(this);
    this.onBeforeUpdateCartBound = this.onBeforeUpdateCart.bind(this);
    this.onAfterUpdateCartBound = this.onAfterUpdateCart.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.trigger = document.querySelector("cart-trigger");

    if (this.trigger) {
      this.trigger.addEventListener("click", this.openBound);
    }

    this.connectDrawerTriggers();

    this.addEventListener(
      CartItemQuantityChangeEvent.type,
      this.onChangeItemQuantityBound
    );
    this.addEventListener(CartItemRemoveEvent.type, this.onRemoveItemBound);

    this.subscriptions.push(
      eventBus.on("cart-item-add", this.onAddItemBound),
      eventBus.on("cart-update-before", this.onBeforeUpdateCartBound),
      eventBus.on("cart-update-after", this.onAfterUpdateCartBound)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.trigger) {
      this.trigger.removeEventListener("click", this.openBound);
    }

    this.disconnectDrawerTriggers();

    this.removeEventListener(
      CartItemQuantityChangeEvent.type,
      this.onChangeItemQuantityBound
    );
    this.removeEventListener(CartItemRemoveEvent.type, this.onRemoveItemBound);

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
    super.open();
  }

  close() {
    super.close();
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
}
