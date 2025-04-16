import hoverintent from "./hoverintent";

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

    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.setupEventListeners();
    this.setupClickOutsideHandler();

    // Make this instance globally available
    window.cascadingMenuManager = this;
  }

  setupEventListeners() {
    const menuItems = document.querySelectorAll(
      ".cascading-menu-item.has-children",
    );

    // Add mouseleave handler to the main menu container
    const mainMenu = document.querySelector(".cascading-menu");
    if (mainMenu) {
      mainMenu.addEventListener("mouseleave", (e) => {
        // Only close if we're not moving to a submenu
        if (
          !e.relatedTarget ||
          !e.relatedTarget.closest(".cascading-submenu")
        ) {
          this.hideAllSubmenus();
        }
      });
    }

    menuItems.forEach((item) => {
      const submenu = item.querySelector(".cascading-submenu");
      if (!submenu) {
        return;
      }

      // Store the menu item and submenu relationship
      this.menuItems.set(item, submenu);

      // Make sure submenu doesn't have show class initially
      submenu.classList.remove("show");

      const instance = hoverintent(
        item,
        function (e) {
          if (this.activeSubmenu) {
            this.hideMenu(this.activeSubmenu);
            this.activeSubmenu = null;
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
                !e.relatedTarget.closest(".cascading-menu-item.has-children")))
          ) {
            this.hideMenu(submenu);
            this.activeSubmenu = null;
            this.currentHoveredItem = null;
          }
        }.bind(this),
      ).options({
        sensitivity: 1,
        interval: 10,
        timeout: 500,
      });

      this.hoverIntentInstances.set(item, instance);
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
    this.hoverIntentInstances.forEach((instance) => instance.remove());
    this.hoverIntentInstances.clear();

    document.removeEventListener("click", this.handleClickOutside);
  }

  isMovingToSubmenu(element) {
    // Check if we're moving to/from a submenu or its parent menu item
    const submenu = element.closest(".cascading-submenu");
    const parentMenuItem = element.closest(".cascading-menu-item.has-children");

    // If we're in a submenu, check if it belongs to the current active menu item
    if (submenu) {
      return this.activeSubmenu === submenu;
    }

    // If we're in a menu item, check if it's the current active item or if it's the parent of the active submenu
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

// Create and export an instance of the CascadingMenu manager
const cascadingMenuManager = new CascadingMenuManager();
export { cascadingMenuManager };

export class CascadingMenu extends HTMLElement {
  connectedCallback() {
    if (window.cascadingMenuManager) {
      // Re-initialize to catch newly connected elements
      window.cascadingMenuManager.init();
    }
  }

  disconnectedCallback() {
    if (window.cascadingMenuManager) {
      window.cascadingMenuManager.destroy();
    }
  }
}
