import { CartItemQuantityChangeEvent } from "./utils/events";

export class CartItemQuantity extends HTMLElement {
  constructor() {
    super();

    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    this.addEventListener("change", this.onChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.onChangeBound);
  }

  get() {
    const quantitySelector = this.querySelector("quantity-selector");

    return quantitySelector?.get() || 1;
  }

  onChange(event) {
    event.stopPropagation();
    this.dispatchChangeEvent();
  }

  dispatchChangeEvent() {
    const event = new CartItemQuantityChangeEvent({
      line: this.dataset.index,
      quantity: this.get(),
    });

    this.dispatchEvent(event);
  }
}
