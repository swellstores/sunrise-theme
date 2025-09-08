import { SearchInputChangeEvent } from "./utils/events";

const SEARCH_INPUT_DEBOUNCE_DELAY = 300;

export class SearchInput extends HTMLInputElement {
  constructor() {
    super();

    this.formElement = null;
    this.debounceTimeout = null;

    this.onKeydownBound = this.onKeydown.bind(this);
    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    this.formElement = this.closest("#search-form");

    this.addEventListener("keydown", this.onKeydownBound);
    this.addEventListener("input", this.onChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener("keydown", this.onKeydownBound);
    this.removeEventListener("input", this.onChangeBound);
  }

  clear() {
    if (!this.value) {
      return;
    }

    this.value = "";
    this.dispatchEvent(new Event("input", { bubbles: true }));
  }

  onKeydown(event) {
    // Block form submit on Enter
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  onChange(event) {
    event.stopPropagation();

    htmx.trigger(this.formElement, "htmx:abort");
    clearTimeout(this.debounceTimeout);

    this.debounceTimeout = setTimeout(
      () => this.dispatchSearchInputChangeEvent(),
      SEARCH_INPUT_DEBOUNCE_DELAY
    );
  }

  dispatchSearchInputChangeEvent() {
    this.dispatchEvent(new SearchInputChangeEvent());
  }
}

export class SearchDialog extends HTMLElement {
  constructor() {
    super();

    this.searchInput = null;
    this.backdropOverlay = null;
  }

  connectedCallback() {
    this.searchInput = this.querySelector('input[is="search-input"]');
    this.backdropOverlay = document.querySelector("backdrop-root");
  }

  toggle() {
    return this.getAttribute("aria-hidden") === "true"
      ? this.open()
      : this.close();
  }

  open() {
    this.classList.remove("hidden");
    this.setAttribute("aria-hidden", "false");

    if (this.backdropOverlay) {
      this.backdropOverlay.show("search-dialog");
    }
  }

  close() {
    this.classList.add("hidden");
    this.setAttribute("aria-hidden", "true");

    if (this.searchInput) {
      this.searchInput.clear();
    }

    if (this.backdropOverlay) {
      this.backdropOverlay.hide("search-dialog");
    }
  }
}

export class SearchDialogTrigger extends HTMLElement {
  constructor() {
    super();

    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.addEventListener("click", this.onClickBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClickBound);
  }

  onClick(event) {
    event.stopPropagation();

    const searchDialog = document.querySelector("search-dialog");

    if (searchDialog) {
      searchDialog.toggle();
    }
  }
}
