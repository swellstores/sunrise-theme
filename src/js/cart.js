import { CartAPI, parseEncodedJson } from './utils/cart-api';
import eventBus from './utils/event-bus';

/**
 * @export
 * @class Cart
 * @extends {HTMLElement}
 */
export class Cart extends HTMLElement {
  constructor() {
    super();

    this.subscriptions = [];
    this.handleUpdateCartBound = this.handleUpdateCart.bind(this);
  }

  connectedCallback() {
    document.addEventListener('quantity-change', this.handleUpdateCartBound);

    this.subscriptions.push(
      eventBus.on('cart-update-before', this.beforeUpdateCart.bind(this)),
      eventBus.on('cart-update-after', this.afterUpdateCart.bind(this)),
    );
  }

  disconnectedCallback() {
    document.removeEventListener('quantity-change', this.handleUpdateCartBound);

    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions.length = 0;
  }

  /**
   * @returns {Promise<Document>}
   * @memberof Cart
   */
  async fetchCartContent() {
    const response = await fetch('/?sections=cart');

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    const json = parseEncodedJson(await response.text());
    const parser = new DOMParser();
    return parser.parseFromString(json['cart'], 'text/html');
  }

  /**
   * Handle updating the cart.
   *
   * @param {CustomEvent} event - The custom event containing the updated quantity details.
   * @memberof CartDrawer
   */
  async handleUpdateCart(event) {
    const { line, quantity } = event.detail;

    try {
      await CartAPI.updateCart({ line, quantity });
    } catch (error) {
      console.error('Error handling update cart:', error);
    }
  }

  beforeUpdateCart({ line, quantity }) {
    if (quantity === 0) {
      const cartItem = this.querySelector(`tr[data-line="${line}"]`);

      if (cartItem !== null) {
        cartItem.classList.add('opacity-20');
      }
    }
  }

  afterUpdateCart() {
    this.fetchCartContent().then((html) => {
      this.updateCartContent(html);
    });
  }

  /**
   * Update the cart content and subtotal from the fetched HTML.
   *
   * @param {Document} html - The fetched HTML document with updated cart content.
   * @memberof CartDrawer
   */
  async updateCartContent(html) {
    const newCartEl = html.querySelector('cart-root');

    if (newCartEl) {
      this.innerHTML = newCartEl.innerHTML;
    } else {
      throw new Error('No cart content found to update');
    }
  }
}
