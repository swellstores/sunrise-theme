import {
  CartItemRemoveEvent,
  CartItemQuantityChangeEvent,
} from "./utils/events";
import { CartAPI } from "./utils/cart-api";
import eventBus from "./utils/event-bus";

const PAGE_ID = "cart";

/**
 * @export
 * @class Cart
 * @extends {HTMLElement}
 */
export class Cart extends HTMLElement {
  constructor() {
    super();

    this.subscriptions = [];

    this.onChangeItemQuantityBound = this.onChangeItemQuantity.bind(this);
    this.onRemoveItemBound = this.onRemoveItem.bind(this);
    this.onBeforeUpdateCartBound = this.onBeforeUpdateCart.bind(this);
    this.onAfterUpdateCartBound = this.onAfterUpdateCart.bind(this);
  }

  connectedCallback() {
    this.addEventListener(
      CartItemQuantityChangeEvent.type,
      this.onChangeItemQuantityBound
    );
    this.addEventListener(CartItemRemoveEvent.type, this.onRemoveItemBound);

    this.subscriptions.push(
      eventBus.on("cart-update-before", this.onBeforeUpdateCartBound),
      eventBus.on("cart-update-after", this.onAfterUpdateCartBound)
    );
  }

  disconnectedCallback() {
    this.removeEventListener(
      CartItemQuantityChangeEvent.type,
      this.onChangeItemQuantityBound
    );
    this.removeEventListener(CartItemRemoveEvent.type, this.onRemoveItemBound);

    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions = [];
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

  onAfterUpdateCart(updates) {
    this.updateCartContent();
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
   * Update the cart content and subtotal from the fetched HTML.
   *
   * @memberof CartDrawer
   */
  async updateCartContent() {
    const sectionId = `cart__${PAGE_ID}`;
    const response = await fetch(`/${PAGE_ID}?sections=${sectionId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    const json = await response.json();
    const parser = new DOMParser();
    const html = parser.parseFromString(json[sectionId], "text/html");
    const newCartEl = html.querySelector("cart-root");

    if (newCartEl) {
      this.innerHTML = newCartEl.innerHTML;
    } else {
      throw new Error("No cart content found to update");
    }
  }
}
