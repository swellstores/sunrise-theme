import { CartAPI, parseEncodedJson } from "./utils/cart-api";
import eventBus from './utils/event-bus';

/**
 * Product component
 *
 * @export
 * @class Product
 * @extends {HTMLElement}
 */
export class AddProductForm extends HTMLElement {
  constructor() {
    super();
    this.productIdInput = null;
    this.optionValuesInput = null;
    this.purchaseOptionTypeInput = null;
    this.purchaseOptionPlanInput = null;
    this.quantityInput = null;
    this.addButton = null;
    this.subscriptions = [];
    this.handleAddToCartBound = this.handleAddToCart.bind(this);
  }

  connectedCallback() {
    this.productIdInput = this.querySelector("input[name='product_id']");
    this.optionValuesInput = this.querySelector("input[name='option_values']");
    this.purchaseOptionTypeInput = this.querySelector("input[name='purchase-option-type']");
    this.purchaseOptionPlanInput = this.querySelector("input[name='purchase-option-plan']");
    this.quantityInput = this.querySelector("input[name='quantity']");
    this.addButton = this.querySelector("button");
    if (this.addButton) {
      this.addButton.addEventListener(
        "click",
        this.handleAddToCartBound,
      );
    }
  
    this.subscriptions.push(
      eventBus.on("product-quantity-change", this.handleUpdateProductQuantity.bind(this)),
      eventBus.on("product-options-change", this.handleUpdateProductOptions.bind(this)),
      eventBus.on("product-purchase-option-change", this.handleUpdateProductPurchaseOption.bind(this)),
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions.length = 0;
    this.productIdInput = null;
    this.optionValuesInput = null;
    this.purchaseOptionTypeInput = null;
    this.purchaseOptionPlanInput = null;
    this.quantityInput = null;

    if (this.addButton) {
      this.addButton.removeEventListener(
        "click",
        this.handleAddToCartBound
      );
    }
    this.addButton = null;
  }

  /**
   * Handle updating product quantity
   */
  handleUpdateProductQuantity(event) {
    const { quantity } = event;
    this.quantityInput.value = quantity;
  }

  /**
   * Handle updating product options
   */
  handleUpdateProductOptions(event) {
    const { optionValues } = event;
    this.optionValuesInput.value = optionValues;
  }

  /**
   * Handle updating product purchase options
   */
  handleUpdateProductPurchaseOption(event) {
    const { type, planId } = event;
    this.purchaseOptionTypeInput.value = type;
    this.purchaseOptionPlanInput.value = planId;
  }

  /**
   * Lock button
   */
  toggleLoader(loading) {
    if (this.addButton) {
      this.addButton.disabled = loading ? 'disabled' : '';
    }
  }

  /**
   * Handle adding an item to the cart.
   *
   */
  async handleAddToCart(event) {
    event.preventDefault();

    const productId = this.productIdInput.value;
    const optionValues = this.optionValuesInput.value;
    const allProductOptions = this.optionValuesInput.getAttribute("data-product-options");
    const purchaseOptionType = this.purchaseOptionTypeInput.value;
    const purchaseOptionPlan = this.purchaseOptionPlanInput.value;
    const quantity = Number(this.quantityInput.value);

    this.toggleLoader(true);

    try {
      await CartAPI.addToCart(productId, '', optionValues, allProductOptions, quantity, purchaseOptionType, purchaseOptionPlan);
      await this.updateCartCount()
    } catch (error) {
      console.error('Error handling add to cart:', error);
    } finally {
      this.toggleLoader(false);
    }
  }

  /**
   * Update items count in the header
   *
   */
  async updateCartCount() {
    const response = await fetch("/?sections=cart-drawer");
    
    if (!response.ok) {
      throw new Error("Failed to fetch cart-drawer");
    }
    
    const json = parseEncodedJson(await response.text());
    const parser = new DOMParser();
    const html = parser.parseFromString(json["cart-drawer"], "text/html");

    const newCartDrawerRoot = html.querySelector("cart-drawer-root");
    const newItemCount = newCartDrawerRoot?.dataset.itemCount;
    const cartCount = document.querySelector("cart-count");
  
    if (newItemCount !== undefined && cartCount) {
      // Update header cart count
      cartCount.textContent = newItemCount;
    }
  }
}
