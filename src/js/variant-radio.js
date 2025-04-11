// @ts-nocheck

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
    this.cartDrawerButton = document.querySelector("cart-drawer-button");
    this.init();
  }

  init() {
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

          const productSlug = trigger.getAttribute("data-product-slug");
          const variantId = trigger.getAttribute("data-variant-id");
          const sectionId = trigger.getAttribute("data-section-id");
          await this.selectVariant(productSlug, variantId, sectionId);
        }
      });
    });
  }


  updateProductElement(html, selector) {
    const currentItem = document.querySelector(selector);
    const newItem = html.querySelector(selector);
    if (currentItem && newItem) {
      currentItem.innerHTML = newItem.innerHTML;
    }
  }

  async selectVariant(productSlug, variantId, sectionId) {
    const requestUrl = `/products/${productSlug}?section=${"page__products_product__product"}&variant=${variantId}`;
    this.abortController?.abort();
    this.abortController = new AbortController();

    try {
      const response = await fetch(requestUrl, { signal: this.abortController.signal });
      const responseText = await response.text();
      const html = new DOMParser().parseFromString(responseText, 'text/html');

      // update elements individually to keep scroll position, selected image and opened accordion items
      this.updateProductElement(html, "product-section #product-price");
      this.updateProductElement(html, "product-section quantity-selector-root > div > input");
      this.updateProductElement(html, "product-section product-variant-options");

      if (this.cartDrawerButton) {
        const variantId = trigger.getAttribute("data-variant-id");
        this.cartDrawerButton.setAttribute("data-variant-id", variantId);
      }
    } catch(error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted by user');
      } else {
        console.error(error);
      }
    }
  }
}
