class HeaderManager {
  constructor() {
    this.init();
  }

  init() {
    // Initialize any remaining header functionality
  }
}

// Create and export an instance of the Header manager
const headerManager = new HeaderManager();
export { headerManager };

export class Header extends HTMLElement {
  connectedCallback() {
    if (window.headerManager) {
      window.headerManager.init();
    }
  }
}