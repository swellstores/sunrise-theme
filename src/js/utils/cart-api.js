import eventBus from './event-bus';

const routes = {
  addToCart: "/cart/add",
  updateCart: "/cart/update",
  getCart: "/cart",
  clearCart: "/cart/clear",
};

export const CartAPI = {
  /**
   * @param {string} productId
   * @param {string} variantId
   * @param {number} [quantity=1]
   * @return {*}
   */
  async addToCart(productId, variantId, optionValues, allProductOptions, quantity = 1, purchaseOptionType = 'standard', purchaseOptionPlan = '') {
    const requestBody = {
      product_id: productId,
      quantity: quantity,
    };

    if (variantId) {
       // in shopify_compatibility we use id as variantId
       requestBody.id = variantId ;
    }

    if (optionValues && allProductOptions) {
      console.log("ADD", optionValues, allProductOptions)
      try {
        const productOptions = JSON.parse(decodeURIComponent(allProductOptions));
        const optionValueArray = optionValues.split(',');
        const options = [];
        console.log(productOptions);
        for (const productOption of productOptions) {
          for (const productOptionValue of productOption.values) {
            if (optionValueArray.includes(productOptionValue.id)) {
              console.log('push', options)
              options.push({
                id: productOption.id,
                name: productOption.name,
                value: productOptionValue.name,
                value_id: productOptionValue.id,
                variant: productOption.variant_option,
              })
            }
          }
        }
        
        console.log('all opts', options);
        if (options.length > 0 && options.length === optionValueArray.length) {
          requestBody.options = options;
        }
      } catch {
        // none 
      }
    }

    if (purchaseOptionType === 'subscription') {
      requestBody.purchase_option = {
        type: 'subscription',
        plan: purchaseOptionPlan,
      }
    }
    try {
      const response = await fetch(routes.addToCart, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(requestBody),
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
          'Accept': 'application/json',
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
          'Accept': 'application/json',
          // 'Content-Type': 'application/json',
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
    eventBus.emit('cart-update-before', updates);

    try {
      const response = await fetch(routes.updateCart, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      eventBus.emit('cart-update-after', updates);
      const data = await response.json();
      console.log('Cart updated:', data);
      return data;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  },
};

/**
 * @param {string} html
 * @returns {string}
 */
function decodeHtmlEntities(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

/**
 * @param {string} encoded
 * @returns {object}
 */
export function parseEncodedJson(encoded) {
  let str = encoded.trim();

  if (str.startsWith('<!')) {
    const pos = str.indexOf('>');

    if (pos !== -1) {
      str = str.slice(pos + 1);
    }

    str = decodeHtmlEntities(str);
  }

  return JSON.parse(str);
}
