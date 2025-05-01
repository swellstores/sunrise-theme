// @ts-nocheck
import eventBus from './utils/event-bus';

/**
 *
 *
 * @export
 * @class VariantRadio
 * @extends {HTMLElement}
 */
export class VariantRadio extends HTMLElement {
  constructor() {
    super();
    this.triggers = this.querySelectorAll("variant-radio-trigger");
    this.inputs = this.querySelectorAll('input[type="radio"]');
    this.select = this.querySelector("select");
    this.init();
  }

  init() {
    // Pills mode
    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", async (event) => {
        const target = event.currentTarget;
        const inputId = target.getAttribute("aria-labelledby");
        const input = document.getElementById(inputId);

        if (input && !input.disabled) {
          // Uncheck all radios first
          this.inputs.forEach((el) => {
            el.checked = false;
            // Directly update the DOM to remove the checked attribute
            el.removeAttribute("checked");
          });

          // Check the current radio and update DOM manually
          input.checked = true;
          input.setAttribute("checked", "checked");

          const product = trigger.getAttribute("data-product-slug");
          const optionValues = trigger.getAttribute("data-option-values");
          await this.selectVariant(product, optionValues);
        }
      });
    });

    // Dropdown mode
    if (this.select) {
      this.select.addEventListener("change", async (event) => {
        const product = this.select.getAttribute("data-product-slug");
        const optionValues = event.target.value;
        await this.selectVariant(product, optionValues);
      })
    }
  }

  updateProductElement(html, selector) {
    const currentItem = document.querySelector(selector);
    const newItem = html.querySelector(selector);
    if (currentItem && newItem) {
      currentItem.innerHTML = newItem.innerHTML;
    }
  }

  setLoading(loading) {
    const rootDiv = document.querySelector("product-section #variant-radio-root");
    if (rootDiv) {
      rootDiv.style.opacity = loading ? 0.6 : 1.0;
    }

    const cartDrawerButton = document.querySelector("product-section cart-drawer-button");
    if (cartDrawerButton) {
      const buttonText = cartDrawerButton.querySelector("span");
      const loader = cartDrawerButton.querySelector('div[role="status"]');

      if (buttonText) {
        buttonText.classList.toggle("hidden", loading);
      }
      if (loader) {
        loader.classList.toggle("hidden", !loading);
        loader.classList.toggle("flex", loading);
      }
    }
  }

  async selectVariant(product, optionValues) {
    const requestUrl = `/products/${product}?option_values=${optionValues}`;
    this.abortController?.abort();
    this.abortController = new AbortController();
    this.setLoading(true);

    try {
      const response = await fetch(requestUrl, { signal: this.abortController.signal });
      const responseText = await response.text();
      const html = new DOMParser().parseFromString(responseText, 'text/html');

      // update elements individually to keep scroll position, selected image and opened accordion items
      this.updateProductElement(html, "product-section #quantity-selector-variant");
      this.updateProductElement(html, "product-section product-variant-options");

      // use selected options
      eventBus.emit('product-options-change', {
        optionValues,
      });

      // update price for standard purchase option
      const priceInput = html.querySelector("product-section #product-price");
      if (priceInput) {
        eventBus.emit('product-price-change', {
          price: priceInput.innerHTML,
        });
      }

      // use actual quantity that can be decreased to the stock level
      const quantityInput = document.querySelector("product-section #quantity-selector-variant input");
      if (quantityInput) {
        const newQuantity = Number(quantityInput.value);
        eventBus.emit('product-quantity-change', {
          quantity: newQuantity,
        });
      }

      this.setLoading(false);
    } catch(error) {
      this.setLoading(false);
      if (error.name === 'AbortError') {
        console.log('Fetch aborted by user');
      } else {
        console.error(error);
      }
    }
  }
}
