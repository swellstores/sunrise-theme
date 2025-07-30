import { FilterInputChangeEvent } from "./utils/events";

export class FilterInputList extends HTMLElement {
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
    const { name } = this.dataset;
    const toggleButtons = this.querySelectorAll("toggle-button");

    return Array.from(toggleButtons).reduce((acc, toggleButton) => {
      const { value } = toggleButton.get();

      if (value) {
        acc[name] ||= new Set();
        acc[name].add(value);
      }

      return acc;
    }, {});
  }

  onChange(event) {
    event.stopPropagation();

    const filterInputChangeEvent = new FilterInputChangeEvent();

    this.dispatchEvent(filterInputChangeEvent);
  }
}
