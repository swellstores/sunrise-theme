// @ts-nocheck

/** @type {*} */
const routes = {
  addToCart: "cart/add.js",
  updateCart: "cart/update.js",
  getCart: "cart.js",
  clearCart: "cart/clear.js",
};

export const CartAPI = {
  /**
   *
   *
   * @param {string} variantId
   * @param {number} [quantity=1]
   * @return {*}
   */
  async addToCart(variantId, quantity = 1) {
    try {
      const response = await fetch(routes.addToCart, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          items: [
            {
              id: variantId,
              quantity: quantity,
            },
          ],
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Product added to cart:', data);
      return data;
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw error;
    }
  },
  /**
   *
   *
   * @return {*}
   */
  async getCart() {
    try {
      const response = await fetch(routes.getCart, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Cart:', data);
      return data;
    } catch (error) {
      console.error('Error getting cart:', error);
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Cart cleared:', data);
      return data;
    } catch (error) {}
  },

  /**
   *
   *
   * @param {object} updates
   * @return {*}
   */
  async updateCart(updates) {
    try {
      const response = await fetch(routes.updateCart, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ updates }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Cart updated:', data);
      return data;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  },
};
