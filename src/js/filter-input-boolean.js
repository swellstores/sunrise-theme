import { FilterInputChangeEvent } from "./utils/events";

export class FilterInputBoolean extends HTMLElement {
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
    const toggleButton = this.querySelector("toggle-button");

    if (!toggleButton) {
      return {};
    }

    const { name } = this.dataset;
    const { value } = toggleButton.get();

    return value ? { [name]: value } : {};
  }

  onChange(event) {
    event.stopPropagation();

    const filterInputChangeEvent = new FilterInputChangeEvent();

    this.dispatchEvent(filterInputChangeEvent);
  }
}
