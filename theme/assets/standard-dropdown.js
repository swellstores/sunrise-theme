class StandardDropdown extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
    this.init();
  }

  init() {
    if (this.initialized) return;
    
    this.toggleButtons = this.querySelectorAll('.standard-dropdown-toggle');
    this.toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown(button);
      });
    });

    // Initialize all dropdowns as closed
    this.toggleButtons.forEach(button => {
      const targetId = button.getAttribute('aria-controls');
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.add('hidden');
      }
    });

    this.initialized = true;
  }

  toggleDropdown(button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const targetId = button.getAttribute('aria-controls');
    const target = document.getElementById(targetId);
    
    if (!target) return;

    // Close any other open dropdowns
    this.toggleButtons.forEach(otherButton => {
      if (otherButton !== button && otherButton.getAttribute('aria-expanded') === 'true') {
        const otherId = otherButton.getAttribute('aria-controls');
        const otherTarget = document.getElementById(otherId);
        if (otherTarget) {
          otherButton.setAttribute('aria-expanded', 'false');
          otherTarget.classList.remove('expanded');
          otherTarget.classList.add('hidden');
        }
      }
    });

    // Toggle current dropdown
    button.setAttribute('aria-expanded', !isExpanded);
    
    if (isExpanded) {
      target.classList.remove('expanded');
      target.classList.add('hidden');
    } else {
      target.classList.remove('hidden');
      // Force a reflow to ensure the transition works
      target.offsetHeight;
      target.classList.add('expanded');
    }
  }

  // Reinitialize when the element is connected to the DOM
  connectedCallback() {
    this.init();
  }
}

// Define the custom element
if (!customElements.get('standard-dropdown')) {
  customElements.define('standard-dropdown', StandardDropdown);
}

// Initialize any existing dropdowns
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('standard-dropdown').forEach(dropdown => {
    if (!dropdown.initialized) {
      dropdown.init();
    }
  });
}); 