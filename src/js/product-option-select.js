import { ProductOptionChangeEvent } from "./utils/events";

export class ProductOptionSelect extends HTMLElement {
  constructor() {
    super();

    this.optionId = null;
    this.value = "";
    this.valueId = null;
    this.error = null;

    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    this.optionId = this.dataset.optionId;
    this.error = this.querySelector("option-error");
    const selected = this.querySelector("[selected]");

    if (selected) {
      this.value = selected.getAttribute("value");
      this.valueId = selected.dataset.valueId;
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
    return Boolean(this.value) && Boolean(this.valueId);
  }

  validate() {
    if (this.valid()) {
      this.hideError();

      return true;
    }

    this.showError();

    return false;
  }

  showError() {
    if (this.error) {
      this.error.classList.remove("hidden");
    }
  }

  hideError() {
    if (this.error) {
      this.error.classList.add("hidden");
    }
  }

  onChange(event) {
    event.stopPropagation();

    const {
      value,
      dataset: { valueId },
    } = event.detail;

    this.value = value;
    this.valueId = valueId;

    this.dispatchOptionChangeEvent();
  }

  dispatchOptionChangeEvent() {
    const data = this.get();
    const event = new ProductOptionChangeEvent(data);

    this.dispatchEvent(event);
  }
}
