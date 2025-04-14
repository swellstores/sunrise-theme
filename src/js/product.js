import eventBus from './utils/event-bus';

/**
 * Product component
 *
 * @export
 * @class Product
 * @extends {HTMLElement}
 */
export class Product extends HTMLElement {
  constructor() {
    super();
    this.subscriptions = [];
  }

  connectedCallback() {
    this.subscriptions.push(
      eventBus.on("product-quantity-change", this.handleUpdateProductQuantity.bind(this)),
      eventBus.on("product-variant-id-change", this.handleUpdateProductVariantId.bind(this)),
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions.length = 0;
  }

  /**
   * Handle updating product quantity
   */
  async handleUpdateProductQuantity(event) {
    const { quantity } = event;
    const inputWithQuantity = document.querySelector("product-section #product-section-buy-buttons > form > input[name='quantity']");
    if (inputWithQuantity) {
      inputWithQuantity.value = quantity;
    }
    const drawerButton = document.querySelector("product-section cart-drawer-button");
    if (drawerButton) {
      drawerButton.setAttribute("data-variant-quantity", quantity);
    }
  }

  /**
   * Handle updating product variant id
   */
  async handleUpdateProductVariantId(event) {
    const { variantId } = event;
    const inputWithVariantId = document.querySelector("product-section #product-section-buy-buttons > form > input[name='id']");
    if (inputWithVariantId) {
      inputWithVariantId.value = variantId;
    }
    const drawerButton = document.querySelector("product-section cart-drawer-button");
    if (drawerButton) {
      drawerButton.setAttribute("data-variant-id", variantId);
    }
  }
}
