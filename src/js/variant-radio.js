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
          await this.updateProductSelectedVariant(productSlug, variantId, sectionId);
          this.updateSelectedVariant(input);
        }

        if (this.cartDrawerButton) {
          const variantId = trigger.getAttribute("data-variant-id");
          this.cartDrawerButton.setAttribute("data-variant-id", variantId);
        }
      });
    });
  }

  updateSelectedVariant(selectedInput) {
    // Update the state of the radio inputs and triggers
    this.triggers.forEach((trigger) => {
      const inputId = trigger.getAttribute("aria-labelledby");
      // const input = this.querySelector(`#${inputId}`);
      const input = document.getElementById(inputId);

      if (input && !input.disabled) {
        if (input === selectedInput && input.checked) {
          trigger.classList.add("bg-[#3B0B93]", "text-white");
          trigger.classList.remove(
            "border-black",
            "hover:bg-black",
            "hover:text-white"
          );
        } else {
          trigger.classList.remove("bg-[#3B0B93]", "text-white");
          trigger.classList.add(
            "border-black",
            "hover:bg-black",
            "hover:text-white"
          );
        }
      }
    });
  }

  updateProductItem(html, selector) {
    const currentItem = document.querySelector(selector);
    const newItem = html.querySelector(selector);
    if (currentItem && newItem) {
      currentItem.innerHTML = newItem.innerHTML;
    }
  }

  async updateProductSelectedVariant(productSlug, variantId, sectionId) {
    const requestUrl = `/products/${productSlug}?section=${"page__products_product__product"}&variant=${variantId}`;
    this.abortController = new AbortController();

    await fetch(requestUrl, { signal: this.abortController.signal })
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        return html;
      })
      .then((html) => {
        // update items individually to keep scroll position and opened accordion items
        this.updateProductItem(html, "product-section #product-price");
        this.updateProductItem(html, "product-section quantity-selector-root");
        this.updateProductItem(html, "product-section product-variant-options");
      })
      .then(() => {
        // set focus to last clicked option value
       //  document.querySelector(`#${targetId}`)?.focus();
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted by user');
        } else {
          console.error(error);
        }
      });
  }
}
