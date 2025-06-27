import { ProductPurchaseOptionChangeEvent } from "./utils/events";

export class ProductPurchaseOptionSubscription extends HTMLElement {
  constructor() {
    super();

    this.type = "subscription";
    this.planId = null;

    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    const selected = this.querySelector("[selected]");

    if (selected) {
      this.planId = selected.getAttribute("value");
    }

    this.addEventListener("change", this.onChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.onChangeBound);
  }

  get() {
    return {
      type: this.type,
      plan_id: this.planId,
    };
  }

  onChange(event) {
    event.stopPropagation();

    const { value } = event.detail;

    this.planId = value;

    this.dispatchPurchaseOptionChangeEvent();
  }

  dispatchPurchaseOptionChangeEvent() {
    const data = this.get();
    const event = new ProductPurchaseOptionChangeEvent(data);

    this.dispatchEvent(event);
  }
}
