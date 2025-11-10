import {
  ProductFilterToggleEvent,
  FiltersClearEvent,
  PaginationChangeEvent,
} from "./utils/events";
import { serializeFormData, applySerializedData } from "./utils/form";
import { updateUrlParams } from "./utils/url";

export class ProductListSection extends HTMLElement {
  constructor() {
    super();

    this.onChangeBound = this.onChange.bind(this);
    this.onToggleFiltersBound = this.onToggleFilters.bind(this);
  }

  connectedCallback() {
    this.addEventListener("htmx:configRequest", this.onChangeBound);
    this.addEventListener(
      ProductFilterToggleEvent.type,
      this.onToggleFiltersBound
    );
  }

  disconnectedCallback() {
    this.removeEventListener("htmx:configRequest", this.onChangeBound);
    this.removeEventListener(
      ProductFilterToggleEvent.type,
      this.onToggleFiltersBound
    );
  }

  getFilterData(event) {
    const { triggeringEvent } = event.detail;

    if (triggeringEvent instanceof FiltersClearEvent) {
      return {};
    }

    const productFilters = this.querySelector("product-filters");

    return productFilters ? productFilters.get() : {};
  }

  getSortData() {
    const productSort = this.querySelector("product-sort");

    return productSort ? productSort.get() : {};
  }

  getPaginationData(event) {
    const { triggeringEvent } = event.detail;

    if (!(triggeringEvent instanceof PaginationChangeEvent)) {
      return {};
    }

    const paginationNav = this.querySelector("pagination-nav");

    return paginationNav ? paginationNav.get() : {};
  }

  getCategoryData() {
    const categoryIdDiv = this.querySelector("#category-id");
    if (!categoryIdDiv) {
      return {};
    }

    const categoryId = categoryIdDiv.getAttribute("data-category-id");
    if (!categoryId || categoryId === 'all') {
      return {};
    }

    return {
      category: categoryId,
    };
  }

  getData(event) {
    return {
      ...this.getFilterData(event),
      ...this.getPaginationData(event),
      ...this.getSortData(),
      ...this.getCategoryData(),
    };
  }

  onChange(event) {
    const data = this.getData(event);
    const serializedData = serializeFormData(data);

    applySerializedData(event, serializedData);
    updateUrlParams(serializedData);
  }

  onToggleFilters() {
    const productFilters = this.querySelector("product-filters");

    if (productFilters) {
      productFilters.toggle();
    }
  }
}
