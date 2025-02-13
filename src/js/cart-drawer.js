// @ts-nocheck

import { CartAPI } from "./utils/cart-api.js";
import { uiManager } from "./utils/ui-manager";

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

    this.init();
  }

  init() {
    if (this.trigger) {
      this.trigger.addEventListener("click", () => uiManager.open(this)); // Use UIManager to open
    }

    if (this.drawerTriggers.length > 0) {
      this.drawerTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => uiManager.close(this)); // Use UIManager to close
      });
    }

    if (this.cartDrawerButton) {
      this.cartDrawerButton.addEventListener(
        "click",
        this.handleAddToCart.bind(this)
      );
    }

    // Close cart drawer on escape key press
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        this.target &&
        this.target.getAttribute("aria-hidden") === "false"
      ) {
        uiManager.close(this); // Use UIManager to close
      }
    });

    if (this.backdropOverlay) {
      this.backdropOverlay.addEventListener("click", (event) => {
        if (
          this.target &&
          this.target.getAttribute("aria-hidden") === "false" &&
          !this?.target.contains(event.target)
        ) {
          uiManager.close(this);
        }
      });
    }

    // Handle quantity change events
    document.addEventListener(
      "quantity-change",
      this.handleUpdateCart.bind(this)
    );
  }

  /**
   * Fetch the updated cart drawer content from the server.
   *
   * @returns {Promise<Document>} The parsed HTML content of the cart drawer.
   * @memberof CartDrawer
   */
  async fetchCartDrawerContent() {
    const response = await fetch("/?sections=cart-drawer");
    if (!response.ok) throw new Error("Failed to fetch cart-drawer");

    const parsedResponse = await response.json();
    const parser = new DOMParser();
    return parser.parseFromString(parsedResponse["cart-drawer"], "text/html");
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
   * @param {Event} event - The event triggered by the button click.
   * @memberof CartDrawer
   */
  async handleAddToCart(event) {
    event.preventDefault();
    const variantId = this.cartDrawerButton.getAttribute("data-variant-id");
    const quantity = Number(
      this.cartDrawerButton.getAttribute("data-variant-quantity")
    );

    this.toggleLoader(true);

    try {
      await CartAPI.addToCart(variantId, quantity);
      const html = await this.fetchCartDrawerContent();

      this.updateCartDrawerContent(html);

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
    const { variantId, quantity } = event.detail;

    const quantityInputs = document.querySelectorAll("input[data-variant-id]");
    const cartItem = this.querySelector(
      `cart-drawer-item[data-variant-id="${variantId}"]`
    );

    const updates = {};
    quantityInputs.forEach((input) => {
      const variantId = input.getAttribute("data-variant-id");
      const quantity = parseInt(input.value, 10);
      updates[variantId] = quantity;
    });

    const existingSubtotalEl = this.cartSubtotal;
    const existingSubtotalText = existingSubtotalEl.querySelector("span");
    const loader = existingSubtotalEl.querySelector('div[role="status"]');

    try {
      if (quantity === 0 && cartItem) {
        cartItem.classList.add("opacity-20");
      }

      if (existingSubtotalText) existingSubtotalText.classList.add("hidden");
      if (loader) {
        loader.classList.remove("hidden");
        loader.classList.add("flex");
      }

      await CartAPI.updateCart(updates);
      const html = await this.fetchCartDrawerContent();

      const data = await CartAPI.getCart();
      this.cartCount.textContent = data.item_count;

      this.updateCartDrawerContent(html);
    } catch (error) {
      console.error("Error handling update cart:", error);
    } finally {
      if (loader) {
        loader.classList.add("hidden");
        loader.classList.remove("flex");
      }
      if (existingSubtotalText) existingSubtotalText.classList.remove("hidden");
    }
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
    )?.innerHTML;

    if (newCartDrawerContent && existingContent) {
      existingContent.innerHTML = newCartDrawerContent;
    } else {
      throw new Error("No cart drawer content found to update");
    }

    const subtotal = html.querySelector("cart-drawer-subtotal")?.innerHTML;
    if (subtotal && this.cartSubtotal) {
      this.cartSubtotal.innerHTML = subtotal;
    } else {
      throw new Error(
        "No existing subtotal element found or no new subtotal found"
      );
    }
  }

  open() {
    if (
      !this.header ||
      !this.backdropOverlay ||
      !this.target ||
      !this.searchDialog
    )
      return;
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
