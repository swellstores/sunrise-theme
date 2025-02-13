// @ts-nocheck

/**
 *
 *
 * @export
 * @class QuantitySelector
 * @extends {HTMLElement}
 */
export class QuantitySelector extends HTMLElement {
  constructor() {
    super();
    this.quantity = this.querySelector('input');
    this.increment = this.querySelector('quantity-selector-increment');
    this.decrement = this.querySelector('quantity-selector-decrement');
    this.remove = this.querySelector('quantity-selector-remove');
    this.init();
  }

  init() {
    if (this.increment && this.decrement) {
      this.increment.addEventListener('click', this.handleIncrement.bind(this));
      this.decrement.addEventListener('click', this.handleDecrement.bind(this));
    }

    if (this.quantity) {
      this.quantity.addEventListener('change', this.handleInputChange.bind(this));
    }

    if (this.remove) {
      this.remove.addEventListener('click', this.handleRemove.bind(this));
    }
  }

  handleIncrement() {
    if (this.quantity) {
      const step = parseInt(this.quantity.step) || 1;
      const max = parseInt(this.quantity.max) || Infinity;
      let newValue = Math.min(parseInt(this.quantity.value) + step, max);
      this.quantity.value = newValue.toString();
      this.quantity.setAttribute('value', newValue);
      this.dispatchChangeEvent();
    }
  }

  handleDecrement() {
    if (this.quantity) {
      const step = parseInt(this.quantity.step) || 1;
      const min = parseInt(this.quantity.min) || 0;
      let newValue = Math.max(parseInt(this.quantity.value) - step, min);
      this.quantity.value = newValue.toString();
      this.quantity.setAttribute('value', newValue);
      this.dispatchChangeEvent();
    }
  }

  handleInputChange(event) {
    const newValue = parseInt(this.quantity.value);
    const min = parseInt(this.quantity.min) || 0;
    const max = parseInt(this.quantity.max) || Infinity;

    if (newValue < min) {
      this.quantity.value = min.toString();
      this.quantity.setAttribute('value', min);
    } else if (newValue > max) {
      this.quantity.value = max.toString();
      this.quantity.setAttribute('value', max);
    }

    this.dispatchChangeEvent();
  }

  handleRemove() {
    if (this.quantity) {
      this.quantity.value = '0';
      this.quantity.setAttribute('value', '0');
      this.dispatchChangeEvent();
    }
  }

  dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('quantity-change', {
        detail: {
          variantId: this.quantity.getAttribute('data-variant-id'),
          quantity: parseInt(this.quantity.value),
        },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
