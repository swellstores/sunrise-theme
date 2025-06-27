import eventBus from "./event-bus";

const routes = {
  addToCart: "/cart/add",
  updateCart: "/cart/update",
  getCart: "/cart",
  clearCart: "/cart/clear",
};

export const CartAPI = {
  /**
   * @param {string} productId
   * @param {Array} options
   * @param {Object} purchaseOption
   * @param {number} [quantity=1]
   * @return {*}
   */
  async addToCart(productId, options, purchaseOption, quantity = 1) {
    try {
      const response = await fetch(routes.addToCart, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity,
          options,
          purchase_option: purchaseOption,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const item = await response.json();

      eventBus.emit("cart-item-add", item);

      const cart = await this.getCart();

      eventBus.emit("cart-item-count-update", cart.item_count);

      return item;
    } catch (error) {
      console.error("Error adding product to cart:", error);

      throw error;
    }
  },

  /**
   * @return {*}
   */
  async getCart() {
    try {
      const response = await fetch(routes.getCart, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Cart:", data);
      return data;
    } catch (error) {
      console.error("Error getting cart:", error);
      throw error;
    }
  },
  /**
   *
   *
   * @return {*}
   */
  async clearCart() {
    try {
      const response = await fetch(routes.clearCart, {
        method: "POST",
        headers: {
          Accept: "application/json",
          // 'Content-Type': 'application/json',
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Cart cleared:", data);
      return data;
    } catch (error) {}
  },

  /**
   * @param {object} updates
   * @return {*}
   */
  async updateCart(updates) {
    eventBus.emit("cart-update-before", updates);

    try {
      const response = await fetch(routes.updateCart, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      eventBus.emit("cart-update-after", updates);

      const data = await response.json();

      console.log("Cart updated:", data);

      return data;
    } catch (error) {
      console.error("Error updating cart:", error);

      throw error;
    }
  },
};
