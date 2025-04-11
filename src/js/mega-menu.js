/**
 * MegaMenu module that handles mega menu toggling
 */
class MegaMenuManager {
  constructor() {
    this.showMegaMenu = this.showMegaMenu.bind(this);
    this.hideMegaMenu = this.hideMegaMenu.bind(this);
    this.keepMenuVisible = this.keepMenuVisible.bind(this);

    this.init();
  }

  init() {
    this.setupEventListeners();

    // Make this instance globally available
    window.megaMenuManager = this;
  }

  setupEventListeners() {
    const navItems = document.querySelectorAll("a[data-mega-menu]");

    navItems.forEach((item) => {
      const megaMenuId = item.getAttribute("data-mega-menu");
      const megaMenu = document.getElementById(megaMenuId);

      // Skip if we don't have both the nav item and mega menu
      if (!megaMenu) return;

      item.addEventListener("mouseenter", () => {
        megaMenu.classList.add("active");
      });

      item.addEventListener("mouseleave", () => {
        setTimeout(() => {
          if (!megaMenu.matches(":hover") && !item.matches(":hover")) {
            megaMenu.classList.remove("active");
          }
        }, 50);
      });

      megaMenu.addEventListener("mouseenter", () => {
        megaMenu.classList.add("active");
      });

      megaMenu.addEventListener("mouseleave", () => {
        setTimeout(() => {
          if (!megaMenu.matches(":hover") && !item.matches(":hover")) {
            megaMenu.classList.remove("active");
          }
        }, 50);
      });
    });
  }

  /**
   * Shows the mega menu with the given ID
   *
   * @param {string} id - The ID of the mega menu to show
   */
  showMegaMenu(id) {
    const megaMenu = document.getElementById(id);
    if (megaMenu) {
      megaMenu.classList.add("active");
    }
  }

  /**
   * Keeps the mega menu visible when hovering over it
   *
   * @param {string} id - The ID of the mega menu to keep visible
   */
  keepMenuVisible(id) {
    const megaMenu = document.getElementById(id);
    if (megaMenu) {
      megaMenu.classList.add("active");
    }
  }

  /**
   * Hides the mega menu with the given ID after a short delay
   *
   * @param {string} id - The ID of the mega menu to hide
   */
  hideMegaMenu(id) {
    const megaMenu = document.getElementById(id);
    if (megaMenu) {
      setTimeout(() => {
        const navItem = document.querySelector(`a[data-mega-menu="${id}"]`);
        if (
          !megaMenu.matches(":hover") &&
          (!navItem || !navItem.matches(":hover"))
        ) {
          megaMenu.classList.remove("active");
        }
      }, 50);
    }
  }
}

// Create and export an instance of the MegaMenu manager
const megaMenuManager = new MegaMenuManager();
export { megaMenuManager };

export class MegaMenu extends HTMLElement {
  connectedCallback() {
    if (window.megaMenuManager) {
      window.megaMenuManager.init();
    }
  }
}
