import { ProductSortChangeEvent } from "./utils/events";

export class ProductSort extends HTMLElement {
  constructor() {
    super();

    this.value = "";
    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    const { value } = this.dataset;

    this.value = value;

    this.addEventListener("change", this.onChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.onChangeBound);
  }

  get() {
    return {
      sort_by: this.value,
    };
  }

  onChange(event) {
    event.stopPropagation();

    const {
      detail: { value },
    } = event;

    this.value = value;

    this.dispatchProductSortChangeEvent();
  }

  dispatchProductSortChangeEvent() {
    const data = this.get();
    const event = new ProductSortChangeEvent(data);

    this.dispatchEvent(event);
  }
}
