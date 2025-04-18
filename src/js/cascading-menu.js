/**
 * CascadingMenu module that handles cascading menu toggling
 */
class CascadingMenuManager {
  constructor() {
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.currentHoveredItem = null;
    this.activeSubmenu = null;
    this.hoverIntentInstances = new Map();
    this.menuItems = new Map();
    this.initializedItems = new Set();
    this.menuCheckStartTime = Date.now();
    this.isInitialized = false;

    window.cascadingMenuManager = this;

    this.checkForMenuItems();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        if (!this.isInitialized) {
          this.checkForMenuItems();
        }
      });
    }
  }

  checkForMenuItems() {
    const menuItems = document.querySelectorAll(
      ".cascading-menu-item.has-children",
    );
    if (menuItems.length > 0) {
      this.setupEventListeners();
      this.setupClickOutsideHandler();
      this.isInitialized = true;
    } else if (Date.now() - this.menuCheckStartTime < 10000) {
      setTimeout(() => this.checkForMenuItems(), 100);
    }
  }

  setupEventListeners() {
    const menuItems = document.querySelectorAll(
      ".cascading-menu-item.has-children",
    );

    // Check if hoverintent is available
    if (typeof window.hoverintent !== "function") {
      setTimeout(() => this.setupEventListeners(), 100);
      return;
    }

    // Setup new items that haven't been initialized yet
    menuItems.forEach((item) => {
      if (this.initializedItems.has(item)) {
        return;
      }

      const submenu = item.querySelector(".cascading-submenu");
      if (!submenu) {
        return;
      }

      this.menuItems.set(item, submenu);
      submenu.classList.remove("show");

      const instance = window
        .hoverintent(
          item,
          function (e) {
            // Only hide active submenu if it's not the parent of the current item
            if (this.activeSubmenu && this.activeSubmenu !== submenu) {
              this.hideMenu(this.activeSubmenu);
            }

            this.showMenu(submenu);
            this.activeSubmenu = submenu;
            this.currentHoveredItem = item;
          }.bind(this),
          function (e) {
            // Only hide if we're not moving to the submenu or its parent
            if (
              this.activeSubmenu === submenu &&
              (!e.relatedTarget ||
                (!e.relatedTarget.closest(".cascading-submenu") &&
                  !e.relatedTarget.closest(
                    ".cascading-menu-item.has-children",
                  )))
            ) {
              this.hideMenu(submenu);
              this.activeSubmenu = null;
              this.currentHoveredItem = null;
            }
          }.bind(this),
        )
        .options({
          sensitivity: 4,
          interval: 50,
          timeout: 200,
        });

      this.hoverIntentInstances.set(item, instance);
      this.initializedItems.add(item);
    });
  }

  setupClickOutsideHandler() {
    document.addEventListener("click", this.handleClickOutside);
  }

  handleClickOutside(event) {
    const menus = document.querySelectorAll(".cascading-submenu");
    menus.forEach((menu) => {
      if (!menu.contains(event.target)) {
        this.hideMenu(menu);
        this.activeSubmenu = null;
        this.currentHoveredItem = null;
      }
    });
  }

  showMenu(menu) {
    if (menu) {
      menu.classList.add("show");
    }
  }

  hideMenu(menu) {
    if (menu) {
      menu.classList.remove("show");
    }
  }

  hideAllSubmenus() {
    // Hide all submenus and reset state
    this.menuItems.forEach((submenu) => {
      this.hideMenu(submenu);
    });
    this.activeSubmenu = null;
    this.currentHoveredItem = null;
  }

  destroy() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  isMovingToSubmenu(element) {
    const submenu = element.closest(".cascading-submenu");
    const parentMenuItem = element.closest(".cascading-menu-item.has-children");

    if (submenu) {
      return this.activeSubmenu === submenu;
    }

    if (parentMenuItem) {
      return (
        this.currentHoveredItem === parentMenuItem ||
        (this.activeSubmenu &&
          this.menuItems.get(parentMenuItem) === this.activeSubmenu)
      );
    }

    return false;
  }
}

const cascadingMenuManager = new CascadingMenuManager();
export { cascadingMenuManager };

export class CascadingMenu extends HTMLElement {
  connectedCallback() {
    if (window.cascadingMenuManager) {
      window.cascadingMenuManager.checkForMenuItems();
    }
  }

  disconnectedCallback() {
    if (window.cascadingMenuManager) {
      window.cascadingMenuManager.destroy();
    }
  }
}
