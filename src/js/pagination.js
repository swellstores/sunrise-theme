import {
  PaginationChangeEvent,
  PaginationLinkClickEvent,
} from "./utils/events";

export class PaginationNav extends HTMLElement {
  constructor() {
    super();
    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    const { currentPage } = this.dataset;

    this.currentPage = currentPage;
    this.addEventListener(PaginationLinkClickEvent.type, this.onChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener(PaginationLinkClickEvent.type, this.onChangeBound);
  }

  get() {
    return { page: this.currentPage || 1 };
  }

  onChange(event) {
    event.stopPropagation();

    const { page } = event.detail;

    this.currentPage = page;

    this.dispatchPaginationChangeEvent();
  }

  dispatchPaginationChangeEvent(page) {
    const event = new PaginationChangeEvent({ page });

    this.dispatchEvent(event);
  }
}

export class PaginationLink extends HTMLElement {
  constructor() {
    super();
    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.addEventListener("click", this.onClickBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClickBound);
  }

  onClick(event) {
    event.stopPropagation();

    const href = this.getAttribute("href") || "";
    let page = null;

    try {
      const url = new URL(href, window.location.origin);
      page = url.searchParams.get("page");
    } catch {
      const paramsString = href.split("?")[1] || "";
      const params = new URLSearchParams(paramsString);
      page = params.get("page");
    }

    this.dispatchPaginationLinkClickEvent(page);
  }

  dispatchPaginationLinkClickEvent(page) {
    const event = new PaginationLinkClickEvent({ page });

    this.dispatchEvent(event);
  }
}
