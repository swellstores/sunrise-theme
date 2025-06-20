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
    this.triggers = null;
    this.backdropOverlay = null;
    this.announcement = null;
    this.header = null;
    this.searchDialog = null;

    this.onClickFilterDrawerBound = this.onClickFilterDrawer.bind(this);
    this.onDocumentKeyDownBound = this.onDocumentKeyDown.bind(this);
    this.onClickBackgroundOverlayBound =
      this.onClickBackgroundOverlay.bind(this);
  }

  connectedCallback() {
    this.drawer = this.querySelector('[data-target="filter-drawer"]');
    this.body = document.body;
    this.triggers = this.querySelectorAll('[data-trigger="filter-drawer"]');
    this.backdropOverlay = document.querySelector("backdrop-root");
    this.announcement = document.querySelector("announcement-root");
    this.header = document.querySelector("header");
    this.searchDialog = document.querySelector("search-dialog-root");

    this.triggers.forEach(trigger => {
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
      this.triggers.forEach(trigger => {
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

    this.body = null;
    this.triggers = null;
    this.drawer = null;
    this.backdropOverlay = null;
    this.announcement = null;
    this.header = null;
    this.searchDialog = null;
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
    if (
      !this.header ||
      !this.backdropOverlay ||
      !this.drawer ||
      !this.searchDialog
    ) {
      return;
    }

    this.body.classList.add("overflow-hidden");

    this.header.classList.remove("z-60");
    this.header.classList.add("z-10");

    if (this.announcement) {
      this.announcement.classList.remove("z-60");
      this.announcement.classList.add("z-10");
    }

    this.searchDialog.classList.remove("z-50");
    this.backdropOverlay.classList.remove("translate-x-full");
    this.drawer.classList.remove("hidden");
    this.drawer.setAttribute("aria-expanded", "true");
  }

  close() {
    if (!this.header || !this.backdropOverlay || !this.drawer) return;

    this.body.classList.remove("overflow-hidden");

    this.header.classList.add("z-60");
    this.header.classList.remove("z-10");

    if (this.announcement) {
      this.announcement.classList.add("z-60");
      this.announcement.classList.remove("z-10");
    }

    this.searchDialog.classList.add("z-50");
    this.backdropOverlay.classList.add("translate-x-full");
    this.drawer.classList.add("hidden");
    this.drawer.setAttribute("aria-expanded", "false");
  }
}
