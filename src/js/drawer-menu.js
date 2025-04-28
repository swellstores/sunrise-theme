import { uiManager } from "./utils/ui-manager";

/**
 * DrawerMenu component that handles the drawer menu interactions.
 *
 * @export
 * @class DrawerMenu
 * @extends {HTMLElement}
 */
export class DrawerMenu extends HTMLElement {
  constructor() {
    super();

    this.drawer = null;
    this.body = null;
    this.trigger = null;
    this.backdropOverlay = null;
    this.announcement = null;
    this.header = null;
    this.searchDialog = null;

    this.openUiManagerBound = openUiManager.bind(this);
    this.closeUiManagerBound = closeUiManager.bind(this);
    this.onDocumentKeyDownBound = this.onDocumentKeyDown.bind(this);
    this.onClickBackgroundOverlayBound = this.onClickBackgroundOverlay.bind(this);
  }

  connectedCallback() {
    this.drawer = this.querySelector('div');  // Get the drawer div inside the component
    this.body = document.body;
    this.trigger = document.querySelector("[data-drawer-menu-trigger]");
    this.backdropOverlay = document.querySelector("backdrop-root");
    this.announcement = document.querySelector("announcement-root");
    this.header = document.querySelector("header");
    this.searchDialog = document.querySelector("search-dialog-root");
    this.closeButton = this.querySelector("[data-drawer-close]");

    if (this.trigger) {
      this.trigger.addEventListener("click", this.openUiManagerBound);
      console.log("Drawer trigger found and click event added");
    } else {
      console.warn("Drawer trigger not found");
    }

    if (this.closeButton) {
      this.closeButton.addEventListener("click", this.closeUiManagerBound);
    }

    // Close drawer menu on escape key press
    document.addEventListener("keydown", this.onDocumentKeyDownBound);

    if (this.backdropOverlay) {
      this.backdropOverlay.addEventListener(
        "click",
        this.onClickBackgroundOverlayBound
      );
    }
  }

  disconnectedCallback() {
    if (this.trigger) {
      this.trigger.removeEventListener("click", this.openUiManagerBound);
    }

    if (this.closeButton) {
      this.closeButton.removeEventListener("click", this.closeUiManagerBound);
    }

    document.removeEventListener("keydown", this.onDocumentKeyDownBound);

    if (this.backdropOverlay) {
      this.backdropOverlay.removeEventListener(
        "click",
        this.onClickBackgroundOverlayBound
      );
    }

    this.drawer = null;
    this.body = null;
    this.trigger = null;
    this.backdropOverlay = null;
    this.announcement = null;
    this.header = null;
    this.searchDialog = null;
    this.closeButton = null;
  }

  /** @param {KeyboardEvent} event */
  onDocumentKeyDown(event) {
    if (
      event.key === "Escape" &&
      this.drawer &&
      this.drawer.getAttribute("aria-hidden") === "false"
    ) {
      closeUiManager.call(this);
    }
  }

  /** @param {MouseEvent} event */
  onClickBackgroundOverlay(event) {
    if (
      this.drawer &&
      this.drawer.getAttribute("aria-hidden") === "false" &&
      !this.drawer.contains(event.target)
    ) {
      closeUiManager.call(this);
    }
  }

  open() {
    console.log("Opening drawer menu");
    if (
      !this.header ||
      !this.backdropOverlay ||
      !this.drawer ||
      !this.searchDialog
    ) {
      console.warn("Missing required elements for opening drawer");
      return;
    }

    this.body.classList.add("overflow-hidden");

    // Ensure stacking context is correct
    this.header.classList.remove("z-60");
    this.header.classList.add("z-10");

    if (this.announcement) {
      this.announcement.classList.remove("z-60");
      this.announcement.classList.add("z-10");
    }

    this.searchDialog.classList.remove("z-50");
    this.backdropOverlay.classList.remove("-translate-x-full");
    this.drawer.classList.remove("-translate-x-full");
    this.drawer.setAttribute("aria-hidden", "false");
  }

  close() {
    console.log("Closing drawer menu");
    if (!this.header || !this.backdropOverlay || !this.drawer) {
      console.warn("Missing required elements for closing drawer");
      return;
    }

    this.body.classList.remove("overflow-hidden");

    // Restore stacking context
    this.header.classList.add("z-60");
    this.header.classList.remove("z-10");

    if (this.announcement) {
      this.announcement.classList.add("z-60");
      this.announcement.classList.remove("z-10");
    }

    this.searchDialog.classList.add("z-50");
    this.backdropOverlay.classList.add("-translate-x-full");
    this.drawer.classList.add("-translate-x-full");
    this.drawer.setAttribute("aria-hidden", "true");
  }
}

function openUiManager() {
  console.log("openUiManager called");
  uiManager.open(this);
}

function closeUiManager() {
  console.log("closeUiManager called");
  uiManager.close(this);
}
