/**
 * FilterDrawer component that handles the filter drawer interactions.
 *
 * @export
 * @class FilterDrawer
 * @extends {HTMLElement}
 */
export class FilterDrawer extends HTMLElement {
  constructor() {
    super();

    this.drawer = null;
    this.body = null;
    this.backdropOverlay = null;

    this.onClickFilterDrawerBound = this.onClickFilterDrawer.bind(this);
    this.onDocumentKeyDownBound = this.onDocumentKeyDown.bind(this);
    this.onClickBackgroundOverlayBound =
      this.onClickBackgroundOverlay.bind(this);
  }

  connectedCallback() {
    this.drawer = this.querySelector('[data-target="filter-drawer"]');
    this.triggers = this.querySelectorAll('[data-trigger="filter-drawer"]');
    this.backdropOverlay = document.querySelector("backdrop-root");

    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", this.onClickFilterDrawerBound);
    });

    document.addEventListener("keydown", this.onDocumentKeyDownBound);

    if (this.backdropOverlay) {
      this.backdropOverlay.addEventListener(
        "click",
        this.onClickBackgroundOverlayBound,
      );
    }
  }

  disconnectedCallback() {
    if (this.triggers) {
      this.triggers.forEach((trigger) => {
        trigger.removeEventListener("click", this.onClickFilterDrawerBound);
      });
    }

    document.removeEventListener("keydown", this.onDocumentKeyDownBound);

    if (this.backdropOverlay) {
      this.backdropOverlay.removeEventListener(
        "click",
        this.onClickBackgroundOverlayBound,
      );
    }

    this.triggers = null;
    this.drawer = null;
    this.backdropOverlay = null;
  }

  /** @param {KeyboardEvent} event */
  onDocumentKeyDown(event) {
    if (
      event.key === "Escape" &&
      this.drawer &&
      this.drawer.getAttribute("aria-expanded") === "true"
    ) {
      this.close();
    }
  }

  /** @param {MouseEvent} event */
  onClickBackgroundOverlay(event) {
    if (
      this.drawer &&
      this.drawer.getAttribute("aria-expanded") === "true" &&
      !this.drawer.contains(event.target)
    ) {
      this.close();
    }
  }

  onClickFilterDrawer() {
    const isExpanded = this.drawer.getAttribute("aria-expanded") === "true";

    if (!isExpanded) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    if (!this.backdropOverlay) {
      return;
    }

    this.backdropOverlay.classList.remove("translate-x-full");
    this.drawer.classList.remove("-translate-x-full");
    this.drawer.setAttribute("aria-expanded", "true");
  }

  close() {
    if (!this.backdropOverlay) {
      return;
    }

    this.backdropOverlay.classList.add("translate-x-full");
    this.drawer.classList.add("-translate-x-full");
    this.drawer.setAttribute("aria-expanded", "false");
  }
}
