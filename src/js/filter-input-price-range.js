import { FilterInputChangeEvent } from "./utils/events";

export class FilterInputPriceRange extends HTMLElement {
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
    const rangeSlider = this.querySelector("range-slider");

    if (!rangeSlider) {
      return {};
    }

    const { name } = this.dataset;
    const { from, to, min, max } = rangeSlider.get();
    const changed = from !== min || to !== max;

    return changed
      ? {
          [`${name}[gte]`]: from,
          [`${name}[lte]`]: to,
        }
      : {};
  }

  onChange(event) {
    event.stopPropagation();

    const filterInputChangeEvent = new FilterInputChangeEvent();

    this.dispatchEvent(filterInputChangeEvent);
  }
}
