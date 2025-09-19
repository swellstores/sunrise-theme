import {
  FilterInputChangeEvent,
  ProductFiltersChangeEvent,
} from "./utils/events";

export class ProductFilters extends HTMLElement {
  constructor() {
    super();

    this.onFilterInputChangeBound = this.onFilterInputChange.bind(this);
  }

  connectedCallback() {
    this.addEventListener(
      FilterInputChangeEvent.type,
      this.onFilterInputChangeBound
    );
  }

  disconnectedCallback() {
    this.removeEventListener(
      FilterInputChangeEvent.type,
      this.onFilterInputChangeBound
    );
  }

  isMobile() {
    return window.matchMedia("(max-width: 639px)").matches;
  }

  getFiltersContainer() {
    return this.isMobile()
      ? this.querySelector("product-filter-drawer")
      : this.querySelector("product-filter-sidebar");
  }

  get() {
    const filtersContainer = this.getFiltersContainer();

    if (!filtersContainer) {
      return {};
    }

    const booleanFilters = filtersContainer.querySelectorAll(
      "filter-input-boolean"
    );
    const listFilters = filtersContainer.querySelectorAll("filter-input-list");
    const priceFilters = filtersContainer.querySelectorAll(
      "filter-input-price-range"
    );

    return [
      ...Array.from(booleanFilters),
      ...Array.from(listFilters),
      ...Array.from(priceFilters),
    ].reduce((acc, filter) => {
      const values = filter.get();

      if (values) {
        Object.assign(acc, values);
      }

      return acc;
    }, {});
  }

  toggle() {
    const filtersContainer = this.getFiltersContainer();

    if (filtersContainer) {
      filtersContainer.toggle();
    }
  }

  abortHtmxRequest() {
    const { htmxForm } = this.dataset;

    if (htmxForm) {
      htmx.trigger(`#${htmxForm}`, "htmx:abort");
    }
  }

  onFilterInputChange(event) {
    event.stopPropagation();

    // Cancel previous request and trigger update
    this.abortHtmxRequest();
    this.dispatchProductFiltersChangeEvent();
  }

  dispatchProductFiltersChangeEvent() {
    const event = new ProductFiltersChangeEvent();

    this.dispatchEvent(event);
  }
}
