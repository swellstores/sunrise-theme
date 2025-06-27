import {
  CartItemRemoveEvent,
  CartItemQuantityChangeEvent,
} from "./utils/events";
import { CartAPI } from "./utils/cart-api";

/**
 * @export
 * @class Cart
 * @extends {HTMLElement}
 */
export class Cart extends HTMLElement {
  constructor() {
    super();

    this.onChangeItemQuantityBound = this.onChangeItemQuantity.bind(this);
    this.onRemoveItemBound = this.onRemoveItem.bind(this);
  }

  connectedCallback() {
    this.addEventListener(
      CartItemQuantityChangeEvent.type,
      this.onChangeItemQuantityBound
    );
    this.addEventListener(CartItemRemoveEvent.type, this.onRemoveItemBound);
  }

  disconnectedCallback() {
    this.removeEventListener(
      CartItemQuantityChangeEvent.type,
      this.onChangeItemQuantityBound
    );
    this.removeEventListener(CartItemRemoveEvent.type, this.onRemoveItemBound);
  }

  async onChangeItemQuantity(event) {
    event.stopPropagation();

    const { line, quantity } = event.detail;
    const item = this.querySelector(`tr[data-line="${line}"]`);

    item.classList.add("disabled");
    await this.updateCart({ line, quantity });
    item.classList.remove("disabled");
  }

  async onRemoveItem(event) {
    event.stopPropagation();

    const { line } = event.detail;
    const item = this.querySelector(`tr[data-line="${line}"]`);

    item.classList.add("disabled");
    await this.updateCart({ line, quantity: 0 });
  }

  /**
   * Handle updating the cart.
   *
   * @param {object} data
   * @memberof CartDrawer
   */
  async updateCart(data) {
    try {
      await CartAPI.updateCart(data);
      await this.updateCartContent();
    } catch (error) {
      console.error("Error handling update cart:", error);
    }
  }

  /**
   * Update the cart content and subtotal from the fetched HTML.
   *
   * @memberof CartDrawer
   */
  async updateCartContent() {
    const response = await fetch("/?sections=cart");

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    const json = await response.json();
    const parser = new DOMParser();
    const html = parser.parseFromString(json["cart"], "text/html");
    const newCartEl = html.querySelector("cart-root");

    if (newCartEl) {
      this.innerHTML = newCartEl.innerHTML;
    } else {
      throw new Error("No cart content found to update");
    }
  }
}
