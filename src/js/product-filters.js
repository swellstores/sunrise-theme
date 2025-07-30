import {
  FilterInputChangeEvent,
  ProductFiltersChangeEvent,
} from "./utils/events";
import { debounce } from "./utils/general";

const PRODUCT_FILTER_CHANGE_DEBOUNCE_WAIT = 2000;

export class ProductFilters extends HTMLElement {
  constructor() {
    super();

    this.onFilterInputChangeBound = this.onFilterInputChange.bind(this);
    this.dispatchProductFiltersChangeEventDebounced = debounce(
      this.dispatchProductFiltersChangeEvent.bind(this),
      PRODUCT_FILTER_CHANGE_DEBOUNCE_WAIT
    );
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

  onFilterInputChange(event) {
    event.stopPropagation();

    this.dispatchProductFiltersChangeEventDebounced();
  }

  dispatchProductFiltersChangeEvent() {
    const event = new ProductFiltersChangeEvent();

    this.dispatchEvent(event);
  }
}
