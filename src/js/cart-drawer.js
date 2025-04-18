import { CartAPI, parseEncodedJson } from "./utils/cart-api";
import { uiManager } from "./utils/ui-manager";
import eventBus from './utils/event-bus';

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

    this.target = null;
    this.body = null;
    this.trigger = null;
    this.drawerTriggers = [];
    this.backdropOverlay = null;
    this.announcement = null;
    this.header = null;
    this.searchDialog = null;
    this.cartDrawerButton = null;
    this.cartCount = null;

    this.subscriptions = [];

    this.openUiManagerBound = openUiManager.bind(this);
    this.closeUiManagerBound = closeUiManager.bind(this);
    this.handleAddToCartBound = this.handleAddToCart.bind(this);
    this.handleUpdateCartBound = this.handleUpdateCart.bind(this);
    this.onDocumentKeyDownBound = this.onDocumentKeyDown.bind(this);
    this.onClickBackgroundOverlayBound =
      this.onClickBackgroundOverlay.bind(this);
  }

  connectedCallback() {
    this.target = this;
    this.body = document.body;
    this.trigger = document.querySelector("cart-trigger");
    this.root = document.querySelector("cart-drawer-root");
    this.backdropOverlay = document.querySelector("backdrop-root");
    this.announcement = document.querySelector("announcement-root");
    this.header = document.querySelector("header");
    this.searchDialog = document.querySelector("search-dialog-root");
    this.cartDrawerButton = document.querySelector("cart-drawer-button");
    this.cartCount = document.querySelector("cart-count");

    if (this.trigger) {
      this.trigger.addEventListener("click", this.openUiManagerBound);
    }

    this.connectDrawerTriggers();

    if (this.cartDrawerButton) {
      this.cartDrawerButton.addEventListener(
        "click",
        this.handleAddToCartBound
      );
    }

    // Close cart drawer on escape key press
    document.addEventListener("keydown", this.onDocumentKeyDownBound);

    if (this.backdropOverlay) {
      this.backdropOverlay.addEventListener(
        "click",
        this.onClickBackgroundOverlayBound
      );
    }

    // Handle quantity change events
    this.addEventListener("quantity-change", this.handleUpdateCartBound);

    this.subscriptions.push(
      eventBus.on("cart-update-before", this.beforeUpdateCart.bind(this)),
      eventBus.on("cart-update-after", this.afterUpdateCart.bind(this)),
      eventBus.on("product-quantity-change", this.handleUpdateProductQuantity.bind(this)),
      eventBus.on("product-options-change", this.handleUpdateProductOptions.bind(this)),
      eventBus.on("product-purchase-option-change", this.handleUpdateProductPurchaseOption.bind(this)),
    );
  }

  disconnectedCallback() {
    if (this.trigger) {
      this.trigger.removeEventListener("click", this.openUiManagerBound);
    }

    this.disconnectDrawerTriggers();

    if (this.cartDrawerButton) {
      this.cartDrawerButton.removeEventListener(
        "click",
        this.handleAddToCartBound
      );
    }

    document.removeEventListener("keydown", this.onDocumentKeyDownBound);

    if (this.backdropOverlay) {
      this.backdropOverlay.removeEventListener(
        "click",
        this.onClickBackgroundOverlayBound
      );
    }

    this.removeEventListener("quantity-change", this.handleUpdateCartBound);

    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions.length = 0;

    this.body = null;
    this.trigger = null;
    this.target = null;
    this.drawerTriggers = [];
    this.backdropOverlay = null;
    this.announcement = null;
    this.header = null;
    this.searchDialog = null;
    this.cartDrawerButton = null;
    this.cartCount = null;
  }

  connectDrawerTriggers() {
    this.drawerTriggers = document.querySelectorAll("cart-drawer-trigger");

    this.drawerTriggers.forEach((trigger) => {
      trigger.addEventListener("click", this.closeUiManagerBound);
    });
  }

  disconnectDrawerTriggers() {
    this.drawerTriggers.forEach((trigger) => {
      trigger.removeEventListener("click", this.closeUiManagerBound);
    });
  }

  /** @param {KeyboardEvent} event */
  onDocumentKeyDown(event) {
    if (
      event.key === "Escape" &&
      this.target &&
      this.target.getAttribute("aria-hidden") === "false"
    ) {
      uiManager.close(this); // Use UIManager to close
    }
  }

  /** @param {MouseEvent} event */
  onClickBackgroundOverlay(event) {
    if (
      this.target &&
      this.target.getAttribute("aria-hidden") === "false" &&
      !this.target.contains(event.target)
    ) {
      uiManager.close(this);
    }
  }

  /**
   * Fetch the updated cart drawer content from the server.
   *
   * @returns {Promise<Document>} The parsed HTML content of the cart drawer.
   * @memberof CartDrawer
   */
  async fetchCartDrawerContent() {
    const response = await fetch("/?sections=cart-drawer");

    if (!response.ok) {
      throw new Error("Failed to fetch cart-drawer");
    }

    const json = parseEncodedJson(await response.text());
    const parser = new DOMParser();
    return parser.parseFromString(json["cart-drawer"], "text/html");
  }

  /**
   * Toggle the loader visibility and button text during cart updates.
   *
   * @param {boolean} loading - Indicates whether to show the loader or button text.
   * @memberof CartDrawer
   */
  toggleLoader(loading) {
    const buttonText = this.cartDrawerButton.querySelector("span");
    const loader = this.cartDrawerButton.querySelector('div[role="status"]');

    if (buttonText) {
      buttonText.classList.toggle("hidden", loading);
    }

    if (loader) {
      loader.classList.toggle("hidden", !loading);
      loader.classList.toggle("flex", loading);
    }
  }

  /**
   * Handle adding an item to the cart.
   *
   * @param {MouseEvent} event - The event triggered by the button click.
   * @memberof CartDrawer
   */
  async handleAddToCart(event) {
    event.preventDefault();

    const productId = this.cartDrawerButton.getAttribute("data-product-id");
    const optionValues = this.cartDrawerButton.getAttribute("data-option-values");
    const allProductOptions = this.cartDrawerButton.getAttribute("data-product-options");
    const purchaseOptionType = this.cartDrawerButton.getAttribute("data-purchase-option-type");
    const purchaseOptionPlan = this.cartDrawerButton.getAttribute("data-purchase-option-plan");

    const quantity = Number(
      this.cartDrawerButton.getAttribute("data-variant-quantity")
    );

    this.toggleLoader(true);

    try {
      await CartAPI.addToCart(productId, '', optionValues, allProductOptions, quantity, purchaseOptionType, purchaseOptionPlan);

      await this.fetchCartDrawerContent().then((html) =>
        this.updateCartDrawerContent(html)
      );

      uiManager.open(this);
    } catch (error) {
      console.error("Error handling add to cart:", error);
    } finally {
      this.toggleLoader(false);
    }
  }

  /**
   * Handle updating the cart.
   *
   * @param {CustomEvent} event - The custom event containing the updated quantity details.
   * @memberof CartDrawer
   */
  async handleUpdateCart(event) {
    event.stopPropagation();

    const { line, quantity } = event.detail;

    const subtotalEl = this.root.querySelector("cart-drawer-subtotal");
    const loaderEl = subtotalEl.querySelector("div[role='status']");

    try {
      if (subtotalEl) {
        subtotalEl.classList.add("hidden");
      }

      if (loaderEl) {
        loaderEl.classList.remove("hidden");
        loaderEl.classList.add("flex");
      }

      await CartAPI.updateCart({ line, quantity });
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      if (subtotalEl) {
        subtotalEl.classList.remove("hidden");
      }

      if (loaderEl) {
        loaderEl.classList.add("hidden");
        loaderEl.classList.remove("flex");
      }
    }
  }

  beforeUpdateCart({ line, quantity }) {
    if (quantity === 0) {
      const cartItem = this.querySelector(
        `cart-drawer-item[data-line="${line}"]`
      );

      if (cartItem !== null) {
        cartItem.classList.add("opacity-20");
      }
    }
  }

  afterUpdateCart() {
    this.fetchCartDrawerContent().then((html) =>
      this.updateCartDrawerContent(html)
    );
  }

  /**
   * Update the cart drawer content and subtotal from the fetched HTML.
   *
   * @param {Document} html - The fetched HTML document with updated cart content.
   * @memberof CartDrawer
   */
  async updateCartDrawerContent(html) {
    const newCartDrawerRoot = html.querySelector("cart-drawer-root");

    const newItemCount = newCartDrawerRoot?.dataset.itemCount;

    if (newItemCount !== undefined) {
      // Update header cart count
      this.cartCount.textContent = newItemCount;

      // Update cart drawer contents
      this.root.innerHTML = newCartDrawerRoot.innerHTML;

      // Reset drawer trigger events
      this.disconnectDrawerTriggers();
      this.connectDrawerTriggers();
    } else {
      throw new Error("Unable to update cart drawer content");
    }
  }

  open() {
    if (
      !this.header ||
      !this.backdropOverlay ||
      !this.target ||
      !this.searchDialog
    ) {
      return;
    }

    this.body.classList.add("overflow-hidden");

    // Ensure stacking context is correct
    this.header.classList.remove("z-60");
    this.header.classList.add("z-10");

    if (this.announcement) {
      this.announcement.classList.remove("z-60");
      this.announcement.classList.add("z-10");
    }

    this.searchDialog.classList.remove("z-50");
    this.backdropOverlay.classList.remove("translate-x-full");
    this.target.classList.remove("translate-x-full");
    this.target.setAttribute("aria-hidden", "false");
  }

  close() {
    if (!this.header || !this.backdropOverlay || !this.target) return;

    this.body.classList.remove("overflow-hidden");

    // Restore stacking context
    this.header.classList.add("z-60");
    this.header.classList.remove("z-10");

    if (this.announcement) {
      this.announcement.classList.add("z-60");
      this.announcement.classList.remove("z-10");
    }

    this.searchDialog.classList.add("z-50");
    this.backdropOverlay.classList.add("translate-x-full");
    this.target.classList.add("translate-x-full");
    this.target.setAttribute("aria-hidden", "true");
  }

  /**
   * Handle updating product quantity
   */
  handleUpdateProductQuantity(event) {
    const { quantity } = event;
    this.cartDrawerButton.setAttribute("data-variant-quantity", quantity);
  }

  /**
   * Handle updating product purchase options
   */
  handleUpdateProductPurchaseOption(event) {
    const { type, planId } = event;
    this.cartDrawerButton.setAttribute("data-purchase-option-type", type);
    this.cartDrawerButton.setAttribute("data-purchase-option-plan", planId);
  }
  
  /**
   * Handle updating product options
   */
  handleUpdateProductOptions(event) {
    const { optionValues } = event;
    this.cartDrawerButton.setAttribute("data-option-values", optionValues);
  }
}

function openUiManager() {
  uiManager.open(this);
}

function closeUiManager() {
  uiManager.close(this);
};
