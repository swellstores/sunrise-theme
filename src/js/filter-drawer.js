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
    this.lastIsMobile = this.isMobile();

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
    const isMobile = this.isMobile();

    if (!isMobile && this.lastIsMobile) {
      // Transitioning from mobile to desktop - close drawer and sync state
      if (this.getAttribute("aria-hidden") === "false") {
        this.close();
      }
      const sidebarForm = document.querySelector("#filter-sidebar #filter-form-sidebar");
      const drawerForm = document.querySelector("filter-drawer-root #filter-form-drawer");
      this.syncFilterState(drawerForm, sidebarForm);
    } else if (isMobile && !this.lastIsMobile) {
      // Transitioning from desktop to mobile - initialize panel and sync state
      initFilterPanel();
      const sidebarForm = document.querySelector("#filter-sidebar #filter-form-sidebar");
      const drawerForm = document.querySelector("filter-drawer-root #filter-form-drawer");
      this.syncFilterState(sidebarForm, drawerForm);
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

    const sidebarForm = document.querySelector("#filter-sidebar #filter-form-sidebar");
    const drawerForm = document.querySelector("filter-drawer-root #filter-form-drawer");
    this.syncFilterState(sidebarForm, drawerForm);
  }

  close() {
    if (!this.backdropOverlay) return;

    const sidebarForm = document.querySelector("#filter-sidebar #filter-form-sidebar");
    const drawerForm = document.querySelector("filter-drawer-root #filter-form-drawer");
    this.syncFilterState(drawerForm, sidebarForm);

    this.backdropOverlay.classList.add("translate-x-full");
    this.classList.add("-translate-x-full");
    this.setAttribute("aria-hidden", "true");
  }

  syncFilterState(sourceForm, targetForm) {
    if (!sourceForm || !targetForm) {
      return;
    }

    this._syncFormStates(sourceForm, targetForm);
  }

  _syncFormStates(sourceForm, targetForm) {
    window.isFilterStateSyncing = true;

    // Copy checkbox states
    const sourceCheckboxes = sourceForm.querySelectorAll(
      'input[type="checkbox"]',
    );
    const targetCheckboxes = targetForm.querySelectorAll(
      'input[type="checkbox"]',
    );

    sourceCheckboxes.forEach((sourceBox, index) => {
      const targetBox = targetCheckboxes[index];
      if (targetBox && sourceBox.name === targetBox.name) {
        targetBox.checked = sourceBox.checked;
      }
    });

    // Copy price range values
    const sourcePriceInputs = sourceForm.querySelectorAll(
      'input[name$="[gte]"], input[name$="[lte]"]',
    );
    const targetPriceInputs = targetForm.querySelectorAll(
      'input[name$="[gte]"], input[name$="[lte]"]',
    );

    sourcePriceInputs.forEach((sourceInput, index) => {
      const targetInput = targetPriceInputs[index];
      if (targetInput && sourceInput.name === targetInput.name) {
        targetInput.value = sourceInput.value;
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
        element.classList.contains("price-slider") ||
        element.classList.contains("slider-track") ||
        element.classList.contains("noUi-target") ||
        element.classList.contains("noUi-handle") ||
        element.classList.contains("noUi-connect") ||
        element.classList.contains("noUi-base") ||
        element.id === "price-range"
      ) {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }

  isMobile() {
    return window.innerWidth < 1024;
  }
}
