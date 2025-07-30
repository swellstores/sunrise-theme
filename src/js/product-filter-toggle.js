import { ProductFilterToggleEvent } from "./utils/events";

export class ProductFilterToggle extends HTMLElement {
  constructor() {
    super();

    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.addEventListener("click", this.onClickBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClickBound);
  }

  onClick(event) {
    event.stopPropagation();

    this.dispatchProductFilterToggleEvent();
  }

  dispatchProductFilterToggleEvent() {
    const event = new ProductFilterToggleEvent();

    this.dispatchEvent(event);
  }
}
