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
    this.menuStack = [];

    this.openUiManagerBound = openUiManager.bind(this);
    this.closeUiManagerBound = closeUiManager.bind(this);
    this.onDocumentKeyDownBound = this.onDocumentKeyDown.bind(this);
    this.onClickBackgroundOverlayBound =
      this.onClickBackgroundOverlay.bind(this);
    this.handleSubmenuTriggerBound = this.handleSubmenuTrigger.bind(this);
    this.handleBackButtonBound = this.handleBackButton.bind(this);
  }

  connectedCallback() {
    this.drawer = this.querySelector("div");
    this.body = document.body;
    this.trigger = document.querySelector("[data-drawer-menu-trigger]");
    this.backdropOverlay = document.querySelector("backdrop-root");
    this.announcement = document.querySelector("announcement-root");
    this.header = document.querySelector("header");
    this.searchDialog = document.querySelector("search-dialog-root");
    this.closeButton = this.querySelector("[data-drawer-close]");
    this.menuContent = this.querySelector("[data-menu-content]");
    this.menuTitle = this.querySelector("[data-header] h2");

    if (this.trigger) {
      this.trigger.addEventListener("click", this.openUiManagerBound);
    }

    if (this.closeButton) {
      this.closeButton.addEventListener("click", this.closeUiManagerBound);
    }

    this.setupSubmenuListeners();

    document.addEventListener("keydown", this.onDocumentKeyDownBound);

    if (this.backdropOverlay) {
      this.backdropOverlay.addEventListener(
        "click",
        this.onClickBackgroundOverlayBound,
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

    this.removeSubmenuListeners();

    document.removeEventListener("keydown", this.onDocumentKeyDownBound);

    if (this.backdropOverlay) {
      this.backdropOverlay.removeEventListener(
        "click",
        this.onClickBackgroundOverlayBound,
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
    this.menuContent = null;
    this.menuTitle = null;
    this.menuStack = [];
  }

  setupSubmenuListeners() {
    const submenuTriggers = this.querySelectorAll("[data-submenu-trigger]");
    submenuTriggers.forEach((trigger) => {
      trigger.addEventListener("click", this.handleSubmenuTriggerBound);
    });
  }

  removeSubmenuListeners() {
    const submenuTriggers = this.querySelectorAll("[data-submenu-trigger]");
    submenuTriggers.forEach((trigger) => {
      trigger.removeEventListener("click", this.handleSubmenuTriggerBound);
    });
  }

  handleSubmenuTrigger(event) {
    const trigger = event.currentTarget;
    const parentTitle = trigger.getAttribute("data-parent-title");
    const parentUrl = trigger.getAttribute("data-parent-url");
    const submenuTemplate = trigger
      .closest("li")
      .querySelector("[data-submenu-content]");
    
    if (!submenuTemplate || !this.menuContent) return;

    // Store current menu state
    const currentMenu = this.menuContent.innerHTML;
    this.menuStack.push({
      content: currentMenu,
      title: this.menuTitle.textContent,
    });

    // Update header to show back button
    const headerLeft = this.querySelector('[data-header-left]');
    if (headerLeft) {
      headerLeft.innerHTML = `
        <button class="flex items-center gap-2" data-back-button>
          <ion-icon name="chevron-back-outline" class="w-5 h-5 -ml-1"></ion-icon>
          <span>Back</span>
        </button>
      `;
      const backButton = headerLeft.querySelector('[data-back-button]');
      if (backButton) {
        backButton.addEventListener("click", this.handleBackButtonBound);
      }
    }

    // Update menu content with submenu
    const submenuContent = submenuTemplate.content.cloneNode(true);
    this.menuContent.innerHTML = "";
    this.menuContent.appendChild(submenuContent);

    // Setup listeners for new content
    this.setupSubmenuListeners();
  }

  handleBackButton() {
    if (!this.menuStack.length) return;

    const previousMenu = this.menuStack.pop();
    
    // Update header based on whether we're returning to the main menu
    const headerLeft = this.querySelector('[data-header-left]');
    if (headerLeft) {
      if (this.menuStack.length === 0) {
        // If we're going back to the main menu, show "Menu"
        headerLeft.innerHTML = `<h2 class="font-normal">Menu</h2>`;
      } else {
        // If we're going back to a submenu, keep the back button
        headerLeft.innerHTML = `
          <button class="flex items-center gap-2" data-back-button>
            <ion-icon name="chevron-back-outline" class="w-5 h-5 -ml-1"></ion-icon>
            <span>Back</span>
          </button>
        `;
        const backButton = headerLeft.querySelector('[data-back-button]');
        if (backButton) {
          backButton.addEventListener("click", this.handleBackButtonBound);
        }
      }
    }

    // Restore previous menu content
    this.menuContent.innerHTML = previousMenu.content;

    // Setup listeners for restored content
    this.setupSubmenuListeners();
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
