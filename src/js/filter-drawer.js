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

    this.drawer = null;
    this.body = null;
    this.backdropOverlay = null;
    this.lastIsMobile = window.innerWidth < 1024;
    this._resizeHandler = this._onResize.bind(this);

    this.onClickFilterDrawerBound = this.onClickFilterDrawer.bind(this);
    this.onDocumentKeyDownBound = this.onDocumentKeyDown.bind(this);
    this.onClickBackgroundOverlayBound =
      this.onClickBackgroundOverlay.bind(this);
  }

  connectedCallback() {
    this.drawer = this.querySelector('[data-target="filter-drawer"]');
    this.triggers = this.querySelectorAll('[data-trigger="filter-drawer"]');
    this.backdropOverlay = this.querySelector("backdrop-root");

    const externalTriggers = document.querySelectorAll(
      '[data-trigger="filter-drawer"]',
    );

    const allTriggers = [...this.triggers, ...externalTriggers];

    allTriggers.forEach((trigger) => {
      trigger.addEventListener("click", this.onClickFilterDrawerBound);
    });

    document.addEventListener("keydown", this.onDocumentKeyDownBound);

    if (this.backdropOverlay) {
      this.backdropOverlay.addEventListener(
        "click",
        this.onClickBackgroundOverlayBound,
      );
    }

    window.addEventListener("resize", this._resizeHandler);
  }

  disconnectedCallback() {
    if (this.triggers) {
      this.triggers.forEach((trigger) => {
        trigger.removeEventListener("click", this.onClickFilterDrawerBound);
      });
    }

    const externalTriggers = document.querySelectorAll(
      '[data-trigger="filter-drawer"]',
    );
    externalTriggers.forEach((trigger) => {
      trigger.removeEventListener("click", this.onClickFilterDrawerBound);
    });

    document.removeEventListener("keydown", this.onDocumentKeyDownBound);

    if (this.backdropOverlay) {
      this.backdropOverlay.removeEventListener(
        "click",
        this.onClickBackgroundOverlayBound,
      );
    }

    window.removeEventListener("resize", this._resizeHandler);

    this.triggers = null;
    this.drawer = null;
    this.backdropOverlay = null;
  }

  _onResize() {
    const isMobile = window.innerWidth < 1024;

    if (!isMobile && this.lastIsMobile) {
      this.syncFilterStateReverse();
    } else if (isMobile && !this.lastIsMobile) {
      initFilterPanel();
      this.syncFilterState();
    }

    this.lastIsMobile = isMobile;
  }

  /** @param {KeyboardEvent} event */
  onDocumentKeyDown(event) {
    if (
      event.key === "Escape" &&
      this.drawer &&
      this.drawer.getAttribute("aria-expanded") === "true"
    ) {
      this.close();
    }
  }

  /** @param {MouseEvent} event */
  onClickBackgroundOverlay(event) {
    if (
      this.drawer &&
      this.drawer.getAttribute("aria-expanded") === "true" &&
      !this.drawer.contains(event.target)
    ) {
      this.close();
    }
  }

  onClickFilterDrawer() {
    const isExpanded = this.drawer.getAttribute("aria-expanded") === "true";

    if (!isExpanded) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    if (!this.backdropOverlay) {
      return;
    }

    this.backdropOverlay.classList.remove("hidden");
    this.drawer.classList.remove("-translate-x-full");
    this.drawer.setAttribute("aria-expanded", "true");

    this.syncFilterState();
  }

  close() {
    if (!this.backdropOverlay) {
      return;
    }

    this.backdropOverlay.classList.add("hidden");
    this.drawer.classList.add("-translate-x-full");
    this.drawer.setAttribute("aria-expanded", "false");
  }

  syncFilterState() {
    const sidebarForm = document.querySelector(
      "#filter-sidebar #filter-form-stack",
    );
    const drawerForm = document.querySelector(
      "filter-drawer-root #filter-form-stack",
    );

    if (!sidebarForm || !drawerForm) {
      return;
    }

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
  }

  syncFilterStateReverse() {
    const sidebarForm = document.querySelector(
      "#filter-sidebar #filter-form-stack",
    );
    const drawerForm = document.querySelector(
      "filter-drawer-root #filter-form-stack",
    );

    if (!sidebarForm || !drawerForm) {
      return;
    }

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
  }
}
