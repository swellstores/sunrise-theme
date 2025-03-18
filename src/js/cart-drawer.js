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

    this.body = null;
    this.trigger = null;
    this.target = null;
    this.content = null;
    this.drawerTriggers = [];
    this.backdropOverlay = null;
    this.announcement = null;
    this.header = null;
    this.searchDialog = null;
    this.cartDrawerButton = null;
    this.cartCount = null;
    this.cartSubtotal = null;
    this.cartItemPrices = null;

    this.subscriptions = [];

    this.openUiManagerBound = openUiManager.bind(this);
    this.closeUiManagerBound = closeUiManager.bind(this);
    this.handleAddToCartBound =  this.handleAddToCart.bind(this);
    this.handleUpdateCartBound = this.handleUpdateCart.bind(this);
    this.onDocumentKeyDownBound = this.onDocumentKeyDown.bind(this);
    this.onClickBackgroundOverlayBound = this.onClickBackgroundOverlay.bind(this);
  }

  connectedCallback() {
    this.body = document.body;
    this.trigger = document.querySelector("cart-trigger");
    this.target = this;
    this.content = document.querySelector("cart-drawer-content");
    this.drawerTriggers = document.querySelectorAll("cart-drawer-trigger");
    this.backdropOverlay = document.querySelector("backdrop-root");
    this.announcement = document.querySelector("announcement-root");
    this.header = document.querySelector("header");
    this.searchDialog = document.querySelector("search-dialog-root");
    this.cartDrawerButton = document.querySelector("cart-drawer-button");
    this.cartCount = document.querySelector("cart-count");
    this.cartSubtotal = document.querySelector("cart-drawer-subtotal");
    this.cartItemPrices = document.querySelectorAll("cart-drawer-item-price");

    if (this.trigger) {
      this.trigger.addEventListener("click", this.openUiManagerBound);
    }

    this.drawerTriggers.forEach((trigger) => {
      trigger.addEventListener("click", this.closeUiManagerBound);
    });

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
        this.onClickBackgroundOverlayBound,
      );
    }

    // Handle quantity change events
    this.addEventListener(
      "quantity-change",
      this.handleUpdateCartBound,
    );

    this.subscriptions.push(
      eventBus.on('cart-update-before', this.beforeUpdateCart.bind(this)),
      eventBus.on('cart-update-after', this.afterUpdateCart.bind(this)),
    );
  }

  disconnectedCallback() {
    if (this.trigger) {
      this.trigger.removeEventListener("click", this.openUiManagerBound);
    }

    this.drawerTriggers.forEach((trigger) => {
      trigger.removeEventListener("click", this.closeUiManagerBound);
    });

    if (this.cartDrawerButton) {
      this.cartDrawerButton.removeEventListener(
        "click",
        this.handleAddToCartBound,
      );
    }

    document.removeEventListener("keydown", this.onDocumentKeyDownBound);

    if (this.backdropOverlay) {
      this.backdropOverlay.removeEventListener(
        "click",
        this.onClickBackgroundOverlayBound,
      );
    }

    this.removeEventListener(
      "quantity-change",
      this.handleUpdateCartBound,
    );

    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions.length = 0;

    this.body = null;
    this.trigger = null;
    this.target = null;
    this.content = null;
    this.drawerTriggers = [];
    this.backdropOverlay = null;
    this.announcement = null;
    this.header = null;
    this.searchDialog = null;
    this.cartDrawerButton = null;
    this.cartCount = null;
    this.cartSubtotal = null;
    this.cartItemPrices = null;
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

    if (buttonText) buttonText.classList.toggle("hidden", loading);
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
    const variantId = this.cartDrawerButton.getAttribute("data-variant-id");

    const quantity = Number(
      this.cartDrawerButton.getAttribute("data-variant-quantity")
    );

    this.toggleLoader(true);

    try {
      await CartAPI.addToCart(productId, variantId, quantity);

      await this.fetchCartDrawerContent().then((html) => {
        this.updateCartDrawerContent(html);
      });

      const data = await CartAPI.getCart();
      this.cartCount.textContent = data.item_count;

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

    const existingSubtotalEl = this.cartSubtotal;
    const existingSubtotalText = existingSubtotalEl.querySelector("span");
    const loader = existingSubtotalEl.querySelector('div[role="status"]');

    try {
      if (existingSubtotalText) {
        existingSubtotalText.classList.add("hidden");
      }

      if (loader) {
        loader.classList.remove("hidden");
        loader.classList.add("flex");
      }

      await CartAPI.updateCart({ line, quantity });

      const data = await CartAPI.getCart();
      this.cartCount.textContent = data.item_count;
    } catch (error) {
      console.error("Error handling update cart:", error);
    } finally {
      if (loader) {
        loader.classList.add("hidden");
        loader.classList.remove("flex");
      }

      if (existingSubtotalText) {
        existingSubtotalText.classList.remove("hidden");
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
    this.fetchCartDrawerContent().then((html) => {
      this.updateCartDrawerContent(html);
    });
  }

  /**
   * Update the cart drawer content and subtotal from the fetched HTML.
   *
   * @param {Document} html - The fetched HTML document with updated cart content.
   * @memberof CartDrawer
   */
  async updateCartDrawerContent(html) {
    const existingContent = this.content;
    const newCartDrawerContent = html.querySelector(
      "cart-drawer-content"
    );

    if (newCartDrawerContent && existingContent) {
      existingContent.innerHTML = newCartDrawerContent.innerHTML;
    } else {
      throw new Error("No cart drawer content found to update");
    }

    const subtotal = html.querySelector("cart-drawer-subtotal");
    if (subtotal && this.cartSubtotal) {
      this.cartSubtotal.innerHTML = subtotal.innerHTML;
    } else {
      throw new Error(
        "No existing subtotal element found or no new subtotal found"
      );
    }

    const existingSubmit = this.querySelector('button[name="checkout"]');
    const incomingSubmit = html.querySelector('button[name="checkout"]');

    if (existingSubmit && incomingSubmit) {
      existingSubmit.toggleAttribute(
        'disabled',
        incomingSubmit.getAttribute('disabled') !== null,
      );
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
}

function openUiManager() {
  uiManager.open(this); // Use UIManager to open
}

function closeUiManager() {
  uiManager.close(this); // Use UIManager to close
};
