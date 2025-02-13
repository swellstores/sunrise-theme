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
      trigger.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const inputId = target.getAttribute("aria-labelledby");
        // const input = this.querySelector(`#${inputId}`);
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
}
