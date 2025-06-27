import { CartItemRemoveEvent } from "./utils/events";

export class CartItemRemove extends HTMLElement {
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
    this.dispatchClickEvent();
  }

  dispatchClickEvent() {
    const event = new CartItemRemoveEvent({
      line: this.dataset.index,
    });

    this.dispatchEvent(event);
  }
}
