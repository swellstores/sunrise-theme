/**
 * FilterDrawer component that handles the filter drawer interactions.
 *
 * @export
 * @class FilterDrawer
 * @extends {HTMLElement}
 */
function initFilterPanel() {
  if (window.initPriceSliders) window.initPriceSliders();
  if (window.updatePriceSliders) window.updatePriceSliders();
  if (window.initAccordions) window.initAccordions();
}

export class FilterDrawer extends HTMLElement {
  constructor() {
    super();

    this.trigger = null;
    this.drawerTriggers = [];
    this.backdropOverlay = null;
    this.lastIsMobile = window.innerWidth < 1024;

    this.touchStartX = 0;
    this.touchEndX = 0;
    this.swipeThreshold = 50; // Minimum distance for a swipe

    this.openBound = this.open.bind(this);
    this.closeBound = this.close.bind(this);
    this.onDocumentKeyDownBound = this.onDocumentKeyDown.bind(this);
    this._resizeHandler = this._onResize.bind(this);

    this.handleTouchStartBound = this.handleTouchStart.bind(this);
    this.handleTouchMoveBound = this.handleTouchMove.bind(this);
    this.handleTouchEndBound = this.handleTouchEnd.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "dialog");

    this.trigger = document.querySelector("filter-trigger");
    this.backdropOverlay = document.querySelector("backdrop-root");

    // Also look for external triggers with the old data attribute
    const externalTriggers = document.querySelectorAll(
      '[data-trigger="filter-drawer"]',
    );

    if (this.trigger) {
      this.trigger.addEventListener("click", this.openBound);
    }

    externalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", this.openBound);
    });

    if (this.backdropOverlay) {
      this.backdropOverlay.addEventListener("click", this.closeBound);
    }

    this.connectDrawerTriggers();

    document.addEventListener("keydown", this.onDocumentKeyDownBound);

    this.addEventListener("touchstart", this.handleTouchStartBound);
    this.addEventListener("touchmove", this.handleTouchMoveBound);
    this.addEventListener("touchend", this.handleTouchEndBound);

    window.addEventListener("resize", this._resizeHandler);
  }

  disconnectedCallback() {
    if (this.trigger) {
      this.trigger.removeEventListener("click", this.openBound);
    }

    const externalTriggers = document.querySelectorAll(
      '[data-trigger="filter-drawer"]',
    );
    externalTriggers.forEach((trigger) => {
      trigger.removeEventListener("click", this.openBound);
    });

    if (this.backdropOverlay) {
      this.backdropOverlay.removeEventListener("click", this.closeBound);
    }

    this.disconnectDrawerTriggers();

    document.removeEventListener("keydown", this.onDocumentKeyDownBound);

    this.removeEventListener("touchstart", this.handleTouchStartBound);
    this.removeEventListener("touchmove", this.handleTouchMoveBound);
    this.removeEventListener("touchend", this.handleTouchEndBound);

    window.removeEventListener("resize", this._resizeHandler);
  }

  connectDrawerTriggers() {
    this.drawerTriggers = document.querySelectorAll("filter-drawer-trigger");

    this.drawerTriggers.forEach((trigger) => {
      trigger.addEventListener("click", this.closeBound);
    });
  }

  disconnectDrawerTriggers() {
    this.drawerTriggers.forEach((trigger) => {
      trigger.removeEventListener("click", this.closeBound);
    });
  }

  _onResize() {
    const isMobile = window.innerWidth < 1024;

    if (!isMobile && this.lastIsMobile) {
      // Transitioning from mobile to desktop - close drawer and sync state
      if (this.getAttribute("aria-hidden") === "false") {
        this.close();
      }
      this.syncFilterStateReverse();
    } else if (isMobile && !this.lastIsMobile) {
      // Transitioning from desktop to mobile - initialize panel and sync state
      initFilterPanel();
      this.syncFilterState();
    }

    this.lastIsMobile = isMobile;
  }

  /** @param {KeyboardEvent} event */
  onDocumentKeyDown(event) {
    if (
      event.key === "Escape" &&
      this.getAttribute("aria-hidden") === "false"
    ) {
      this.close();
    }
  }

  open() {
    if (!this.backdropOverlay) return;

    this.backdropOverlay.classList.remove("translate-x-full");
    this.classList.remove("-translate-x-full");
    this.setAttribute("aria-hidden", "false");

    this.syncFilterState();
  }

  close() {
    if (!this.backdropOverlay) return;

    this.syncFilterStateReverse();

    this.backdropOverlay.classList.add("translate-x-full");
    this.classList.add("-translate-x-full");
    this.setAttribute("aria-hidden", "true");
  }

  syncFilterState() {
    const sidebarForm = document.querySelector(
      "#filter-sidebar #filter-form-sidebar",
    );
    const drawerForm = document.querySelector(
      "filter-drawer-root #filter-form-drawer",
    );

    if (!sidebarForm || !drawerForm) {
      return;
    }

    window.isFilterStateSyncing = true;

    // Copy checkbox states
    const sidebarCheckboxes = sidebarForm.querySelectorAll(
      'input[type="checkbox"]',
    );
    const drawerCheckboxes = drawerForm.querySelectorAll(
      'input[type="checkbox"]',
    );

    sidebarCheckboxes.forEach((sidebarBox, index) => {
      const drawerBox = drawerCheckboxes[index];
      if (drawerBox && sidebarBox.name === drawerBox.name) {
        drawerBox.checked = sidebarBox.checked;
      }
    });

    // Copy price range values
    const sidebarPriceInputs = sidebarForm.querySelectorAll(
      'input[name$="[gte]"], input[name$="[lte]"]',
    );
    const drawerPriceInputs = drawerForm.querySelectorAll(
      'input[name$="[gte]"], input[name$="[lte]"]',
    );

    sidebarPriceInputs.forEach((sidebarInput, index) => {
      const drawerInput = drawerPriceInputs[index];
      if (drawerInput && sidebarInput.name === drawerInput.name) {
        drawerInput.value = sidebarInput.value;
      }
    });

    // Update price sliders to reflect the new values
    if (window.updatePriceSliders) {
      window.updatePriceSliders();
    }

    if (window.updateFilterCounts) {
      window.updateFilterCounts();
    }

    setTimeout(() => {
      window.isFilterStateSyncing = false;
    }, 100);
  }

  syncFilterStateReverse() {
    const sidebarForm = document.querySelector(
      "#filter-sidebar #filter-form-sidebar",
    );
    const drawerForm = document.querySelector(
      "filter-drawer-root #filter-form-drawer",
    );

    if (!sidebarForm || !drawerForm) {
      return;
    }

    window.isFilterStateSyncing = true;

    // Copy checkbox states
    const sidebarCheckboxes = sidebarForm.querySelectorAll(
      'input[type="checkbox"]',
    );
    const drawerCheckboxes = drawerForm.querySelectorAll(
      'input[type="checkbox"]',
    );

    drawerCheckboxes.forEach((drawerBox, index) => {
      const sidebarBox = sidebarCheckboxes[index];
      if (sidebarBox && drawerBox.name === sidebarBox.name) {
        sidebarBox.checked = drawerBox.checked;
      }
    });

    // Copy price range values
    const sidebarPriceInputs = sidebarForm.querySelectorAll(
      'input[name$="[gte]"], input[name$="[lte]"]',
    );
    const drawerPriceInputs = drawerForm.querySelectorAll(
      'input[name$="[gte]"], input[name$="[lte]"]',
    );

    drawerPriceInputs.forEach((drawerInput, index) => {
      const sidebarInput = sidebarPriceInputs[index];
      if (sidebarInput && drawerInput.name === sidebarInput.name) {
        sidebarInput.value = drawerInput.value;
      }
    });

    // Update price sliders to reflect the new values
    if (window.updatePriceSliders) {
      window.updatePriceSliders();
    }

    if (window.updateFilterCounts) {
      window.updateFilterCounts();
    }

    setTimeout(() => {
      window.isFilterStateSyncing = false;
    }, 100);
  }

  /**
   * Handle touch start, move, and end events for swipe to close
   */
  handleTouchStart(event) {
    // Ignore touches that start on price slider elements
    if (this.isTouchOnSlider(event.target)) {
      return;
    }
    
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchMove(event) {
    if (this.getAttribute("aria-hidden") === "true") {
      return;
    }

    if (this.isTouchOnSlider(event.target)) {
      return;
    }

    const touchX = event.touches[0].clientX;
    const diff = touchX - this.touchStartX;

    if (diff < 0) {
      event.preventDefault();
      this.style.transform = `translateX(${diff}px)`;
    }
  }

  handleTouchEnd(event) {
    if (this.getAttribute("aria-hidden") === "true") {
      return;
    }

    if (this.isTouchOnSlider(event.target)) {
      return;
    }

    this.touchEndX = event.changedTouches[0].clientX;
    const diff = this.touchEndX - this.touchStartX;

    this.style.transform = "";

    if (Math.abs(diff) > this.swipeThreshold) {
      if (diff < 0) {
        // Swipe left - close drawer
        this.close();
      }
    }
  }

  /**
   * Check if touch target is on a price slider element
   * used to prevent drawer swipe when touching the price slider
   */
  isTouchOnSlider(target) {
    let element = target;
    while (element && element !== this) {
      if (
        element.classList.contains('price-slider') ||
        element.classList.contains('slider-track') ||
        element.classList.contains('noUi-target') ||
        element.classList.contains('noUi-handle') ||
        element.classList.contains('noUi-connect') ||
        element.classList.contains('noUi-base') ||
        element.id === 'price-range'
      ) {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }
}
