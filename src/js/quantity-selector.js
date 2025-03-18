/**
 * @export
 * @class QuantitySelector
 * @extends {HTMLElement}
 */
export class QuantitySelector extends HTMLElement {
  constructor() {
    super();

    this.handleIncrementBound = this.handleIncrement.bind(this);
    this.handleDecrementBound = this.handleDecrement.bind(this);
    this.handleInputChangeBound = this.handleInputChange.bind(this);
    this.handleRemoveBound = this.handleRemove.bind(this);
  }

  connectedCallback() {
    this.quantity = this.querySelector('input');
    this.increment = this.querySelector('quantity-selector-increment');
    this.decrement = this.querySelector('quantity-selector-decrement');
    this.removeItem = this.querySelector('quantity-selector-remove');

    if (this.increment && this.decrement) {
      this.increment.addEventListener('click', this.handleIncrementBound);
      this.decrement.addEventListener('click', this.handleDecrementBound);
    }

    if (this.quantity) {
      this.quantity.addEventListener('change', this.handleInputChangeBound);
    }

    if (this.removeItem) {
      this.removeItem.addEventListener('click', this.handleRemoveBound);
    }
  }

  disconnectedCallback() {
    if (this.increment && this.decrement) {
      this.increment.removeEventListener('click', this.handleIncrementBound);
      this.decrement.removeEventListener('click', this.handleDecrementBound);
    }

    if (this.quantity) {
      this.quantity.removeEventListener('change', this.handleInputChangeBound);
    }

    if (this.removeItem) {
      this.removeItem.removeEventListener('click', this.handleRemoveBound);
    }

    this.quantity = null;
    this.increment = null;
    this.decrement = null;
    this.removeItem = null;
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
          line: Number(this.quantity.getAttribute('data-line')),
          quantity: Number(this.quantity.value),
        },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }
}
