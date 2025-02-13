// @ts-nocheck

import { CartAPI } from './utils/cart-api.js';

/**
 *
 *
 * @export
 * @class Cart
 * @extends {HTMLElement}
 */
export class Cart extends HTMLElement {
  constructor() {
    super();

    this.init();
  }

  init() {
    if (!this) return;
    document.addEventListener('quantity-change', this.handleUpdateCart.bind(this));
  }

  /**
   *
   *
   * @return {*}
   * @memberof Cart
   */
  async fetchCartContent() {
    const response = await fetch('/?sections=cart');
    if (!response.ok) throw new Error('Failed to fetch cart');

    const parsedResponse = await response.json();
    const parser = new DOMParser();
    return parser.parseFromString(parsedResponse['cart'], 'text/html');
  }

  /**
   * Handle updating the cart.
   *
   * @param {CustomEvent} event - The custom event containing the updated quantity details.
   * @memberof CartDrawer
   */
  async handleUpdateCart(event) {
    const { variantId, quantity } = event.detail;

    const quantityInputs = document.querySelectorAll('input[data-variant-id]');
    const cartItem = this.querySelector(`tr[data-variant-id="${variantId}"]`);

    const updates = {};
    quantityInputs.forEach((input) => {
      const variantId = input.getAttribute('data-variant-id');
      const quantity = parseInt(input.value, 10);
      updates[variantId] = quantity;
    });

    try {
      if (quantity === 0 && cartItem) {
        cartItem.classList.add('opacity-20');
      }

      await CartAPI.updateCart(updates);
      const html = await this.fetchCartContent();

      this.updateCartContent(html);
    } catch (error) {
      console.error('Error handling update cart:', error);
    }
  }

  /**
   * Update the cart content and subtotal from the fetched HTML.
   *
   * @param {Document} html - The fetched HTML document with updated cart content.
   * @memberof CartDrawer
   */
  async updateCartContent(html) {
    const existingCartEl = this;
    const newCartEl = html.querySelector('cart-root').innerHTML;

    if (existingCartEl && newCartEl) {
      existingCartEl.innerHTML = newCartEl;
    } else {
      throw new Error('No cart content found to update');
    }
  }
}
