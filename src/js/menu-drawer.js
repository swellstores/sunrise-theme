import { DrawerPanel } from "./drawer-panel";

/**
 * MenuDrawer component that handles the drawer menu interactions.
 *
 * @export
 * @class MenuDrawer
 * @extends {DrawerPanel}
 */
export class MenuDrawer extends DrawerPanel {
  constructor() {
    super();

    this.trigger = null;
    this.menuStack = [];

    this.openBound = this.open.bind(this);
    this.closeBound = this.close.bind(this);
    this.handleSubmenuTriggerBound = this.handleSubmenuTrigger.bind(this);
    this.handleBackButtonBound = this.handleBackButton.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.trigger = document.querySelector("[data-drawer-menu-trigger]");
    this.closeButton = this.querySelector("[data-drawer-close]");
    this.menuContent = this.querySelector("[data-menu-content]");
    this.menuTitle = this.querySelector("[data-header] h2");
    this.backButton = this.querySelector("[data-back-button]");

    if (this.trigger) {
      this.trigger.addEventListener("click", this.openBound);
    }

    if (this.closeButton) {
      this.closeButton.addEventListener("click", this.closeBound);
    }

    if (this.backButton) {
      this.backButton.addEventListener("click", this.handleBackButtonBound);
    }

    this.setupSubmenuListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.trigger) {
      this.trigger.removeEventListener("click", this.openBound);
    }

    if (this.closeButton) {
      this.closeButton.removeEventListener("click", this.closeBound);
    }

    if (this.backButton) {
      this.backButton.removeEventListener("click", this.handleBackButtonBound);
    }

    this.removeSubmenuListeners();
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
    const submenuTemplate = trigger
      .closest("li")
      .querySelector("[data-submenu-content]");

    if (!submenuTemplate || !this.menuContent) {
      return;
    }

    // Store current menu state
    const currentMenu = this.menuContent.innerHTML;

    this.menuStack.push({
      content: currentMenu,
      title: this.menuTitle.textContent,
    });

    // Show back button and hide menu title
    const headerLeft = this.querySelector("[data-header-left]");
    const menuTitle = headerLeft.querySelector("h2");
    const backButton = headerLeft.querySelector("[data-back-button]");

    if (headerLeft && menuTitle && backButton) {
      menuTitle.classList.add("hidden");
      backButton.classList.remove("hidden");
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
    const headerLeft = this.querySelector("[data-header-left]");
    const menuTitle = headerLeft.querySelector("h2");
    const backButton = headerLeft.querySelector("[data-back-button]");

    if (headerLeft && menuTitle && backButton) {
      if (this.menuStack.length === 0) {
        // If we're going back to the main menu, show "Menu" and hide back button
        menuTitle.classList.remove("hidden");
        backButton.classList.add("hidden");
      } else {
        // If we're going back to a submenu, keep the back button visible
        menuTitle.classList.add("hidden");
        backButton.classList.remove("hidden");
      }
    }

    // Restore previous menu content
    this.menuContent.innerHTML = previousMenu.content;

    // Setup listeners for restored content
    this.setupSubmenuListeners();
  }

  open() {
    super.open();
  }

  close() {
    super.close();
  }
}
