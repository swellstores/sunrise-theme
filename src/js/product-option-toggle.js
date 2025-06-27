import { ProductOptionChangeEvent } from "./utils/events";

export class ProductOptionToggle extends HTMLElement {
  constructor() {
    super();

    this.optionId = null;
    this.value = "";
    this.valueId = null;

    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    this.optionId = this.dataset.optionId;
    const checked = this.querySelector("[checked]");

    if (checked) {
      this.value = checked.getAttribute("value");
      this.valueId = checked.dataset.valueId;
    }

    this.addEventListener("change", this.onChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.onChangeBound);
  }

  get() {
    return {
      id: this.optionId,
      value: this.value,
      value_id: this.valueId,
    };
  }

  valid() {
    return true;
  }

  validate() {
    return true;
  }

  onChange(event) {
    event.stopPropagation();

    const {
      value,
      dataset: { valueId },
    } = event.detail;

    this.value = value || "";
    this.valueId = value ? valueId : null;

    this.dispatchOptionChangeEvent();
  }

  dispatchOptionChangeEvent() {
    const data = this.get();
    const event = new ProductOptionChangeEvent(data);

    this.dispatchEvent(event);
  }
}
