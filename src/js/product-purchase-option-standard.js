import { ProductPurchaseOptionChangeEvent } from "./utils/events";

export class ProductPurchaseOptionStandard extends HTMLElement {
  constructor() {
    super();

    this.type = "standard";

    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.addEventListener("click", this.onClickBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClickBound);
  }

  get() {
    return {
      type: this.type,
    };
  }

  onClick(event) {
    event.stopPropagation();

    if (this.hasAttribute("selected")) {
      return;
    }

    this.dispatchPurchaseOptionChangeEvent();
  }

  dispatchPurchaseOptionChangeEvent() {
    const data = this.get();
    const event = new ProductPurchaseOptionChangeEvent(data);

    this.dispatchEvent(event);
  }
}
