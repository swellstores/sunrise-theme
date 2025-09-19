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
  }

  connectedCallback() {
    this.quantity = this.querySelector("input");
    this.increment = this.querySelector("quantity-selector-increment");
    this.decrement = this.querySelector("quantity-selector-decrement");

    if (this.quantity) {
      this.min = parseInt(this.quantity.min);
      this.max = parseInt(this.quantity.max);
      this.step = parseInt(this.quantity.step);

      this.quantity.addEventListener("change", this.handleInputChangeBound);
    }

    if (this.increment && this.decrement) {
      this.increment.addEventListener("click", this.handleIncrementBound);
      this.decrement.addEventListener("click", this.handleDecrementBound);
    }
  }

  disconnectedCallback() {
    if (this.quantity) {
      this.quantity.removeEventListener("change", this.handleInputChangeBound);
    }

    if (this.increment && this.decrement) {
      this.increment.removeEventListener("click", this.handleIncrementBound);
      this.decrement.removeEventListener("click", this.handleDecrementBound);
    }
  }

  get() {
    return Number(this.quantity.value);
  }

  handleIncrement() {
    if (!this.quantity) {
      return;
    }

    const value = parseInt(this.quantity.value);
    const newValue = Math.min(value + this.step, this.max);

    this.setQuantityValue(newValue);
  }

  handleDecrement() {
    if (!this.quantity) {
      return;
    }

    const value = parseInt(this.quantity.value);
    const newValue = Math.max(value - this.step, this.min);

    this.setQuantityValue(newValue);
  }

  handleInputChange() {
    const newValue = parseInt(this.quantity.value);
    const min = parseInt(this.quantity.min) || 0;
    const max = parseInt(this.quantity.max) || Infinity;

    if (!Number.isFinite(newValue) || newValue < min) {
      this.setQuantityValue(min);
    } else if (newValue > max) {
      this.setQuantityValue(max);
    }
  }

  setQuantityValue(value) {
    if (value === this.get()) {
      return;
    }

    this.quantity.value = value.toString();
    this.quantity.setAttribute("value", value);

    this.dispatchChangeEvent();
  }

  dispatchChangeEvent() {
    const event = new CustomEvent("change", {
      detail: {
        value: this.get(),
      },
      bubbles: true,
    });

    this.dispatchEvent(event);
  }
}
