/**
 * CascadingMenu module that handles cascading menu toggling
 */
class CascadingMenuManager {
  constructor() {
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupClickOutsideHandler();

    // Make this instance globally available
    window.cascadingMenuManager = this;
  }

  setupEventListeners() {
    const menuItems = document.querySelectorAll('.cascading-menu-item.has-children');
    
    menuItems.forEach(item => {
      const submenu = item.querySelector('.submenu-container');
      if (!submenu) return;

      item.addEventListener('mouseenter', () => {
        this.showMenu(submenu);
      });

      item.addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (!submenu.matches(':hover') && !item.matches(':hover')) {
            this.hideMenu(submenu);
          }
        }, 50);
      });

      submenu.addEventListener('mouseenter', () => {
        this.showMenu(submenu);
      });

      submenu.addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (!submenu.matches(':hover') && !item.matches(':hover')) {
            this.hideMenu(submenu);
          }
        }, 50);
      });
    });
  }

  setupClickOutsideHandler() {
    document.addEventListener('click', this.handleClickOutside);
  }

  handleClickOutside(event) {
    const menus = document.querySelectorAll('.submenu-container');
    menus.forEach(menu => {
      if (!menu.contains(event.target)) {
        this.hideMenu(menu);
      }
    });
  }

  showMenu(menu) {
    if (menu) {
      menu.classList.add('mdc-menu-surface--open');
      menu.style.display = 'block';
      menu.style.opacity = '1';
      menu.style.transform = 'scale(1)';
      menu.style.visibility = 'visible';
    }
  }

  hideMenu(menu) {
    if (menu) {
      menu.classList.remove('mdc-menu-surface--open');
      menu.style.display = 'none';
      menu.style.opacity = '0';
      menu.style.transform = 'scale(0.9)';
      menu.style.visibility = 'hidden';
    }
  }
}

// Create and export an instance of the CascadingMenu manager
const cascadingMenuManager = new CascadingMenuManager();
export { cascadingMenuManager };

export class CascadingMenu extends HTMLElement {
  connectedCallback() {
    if (window.cascadingMenuManager) {
      window.cascadingMenuManager.init();
    }
  }
}