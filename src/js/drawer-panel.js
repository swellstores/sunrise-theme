const SIDES = Object.freeze({
  RIGHT: "right",
  LEFT: "left",
  BOTTOM: "bottom",
});

const DEFAULT_SIDE = SIDES.RIGHT;

export class DrawerPanel extends HTMLElement {
  constructor() {
    super();

    this.side = DEFAULT_SIDE;
    this.backdropOverlay = null;

    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.swipeThreshold = 100; // Minimum distance for a swipe

    this.openBound = this.open.bind(this);
    this.closeBound = this.close.bind(this);
    this.onDocumentKeyDownBound = this.onDocumentKeyDown.bind(this);
    this.handleTouchStartBound = this.handleTouchStart.bind(this);
    this.handleTouchMoveBound = this.handleTouchMove.bind(this);
    this.handleTouchEndBound = this.handleTouchEnd.bind(this);
  }

  connectedCallback() {
    const { side = DEFAULT_SIDE } = this.dataset;

    this.side = side;

    this.setAttribute("role", "dialog");
    this.setAttribute("aria-hidden", "true");
    this.setAttribute("aria-modal", "true");
    this.setAttribute("aria-tabindex", "-1");

    this.classList.add(
      "fixed",
      "z-[5001]",
      "h-screen",
      "overflow-y-auto",
      "transition-transform",
      "duration-300"
    );

    if (this.isRightDrawer()) {
      this.classList.add("top-0", "right-0");
    } else if (this.isLeftDrawer()) {
      this.classList.add("top-0", "left-0");
    } else if (this.isBottomDrawer()) {
      this.classList.add("bottom-0", "left-0");
    }

    this.backdropOverlay = document.querySelector("backdrop-root");

    if (this.backdropOverlay) {
      this.backdropOverlay.addEventListener("click", this.closeBound);
    }

    // Close drawer on escape key press
    document.addEventListener("keydown", this.onDocumentKeyDownBound);

    // Add touch event listeners
    this.addEventListener("touchstart", this.handleTouchStartBound);
    this.addEventListener("touchmove", this.handleTouchMoveBound);
    this.addEventListener("touchend", this.handleTouchEndBound);
  }

  disconnectedCallback() {
    if (this.backdropOverlay) {
      this.backdropOverlay.removeEventListener("click", this.closeBound);
    }

    document.removeEventListener("keydown", this.onDocumentKeyDownBound);

    // Remove touch event listeners
    this.removeEventListener("touchstart", this.handleTouchStartBound);
    this.removeEventListener("touchmove", this.handleTouchMoveBound);
    this.removeEventListener("touchend", this.handleTouchEndBound);
  }

  isRightDrawer() {
    return this.side === SIDES.RIGHT;
  }

  isLeftDrawer() {
    return this.side === SIDES.LEFT;
  }

  isBottomDrawer() {
    return this.side === SIDES.BOTTOM;
  }

  getTranslateClass() {
    switch (this.side) {
      case SIDES.LEFT:
        return "-translate-x-full";
      case SIDES.BOTTOM:
        return "translate-y-full";
      case SIDES.RIGHT:
      default:
        return "translate-x-full";
    }
  }

  toggle() {
    const isHidden = this.getAttribute("aria-hidden").trim() === "true";

    return isHidden ? this.open() : this.close();
  }

  open() {
    const translate = this.getTranslateClass();

    this.setAttribute("aria-hidden", "false");
    this.classList.remove(translate);

    if (this.backdropOverlay) {
      this.backdropOverlay.show("drawer-panel");
    }
  }

  close() {
    const translate = this.getTranslateClass();

    this.setAttribute("aria-hidden", "true");
    this.classList.add(translate);

    if (this.backdropOverlay) {
      this.backdropOverlay.hide("drawer-panel");
    }
  }

  /** @param {KeyboardEvent} event */
  onDocumentKeyDown(event) {
    if (
      event.key === "Escape" &&
      this.getAttribute("aria-hidden") === "false"
    ) {
      this.closeBound();
    }
  }

  /**
   * Handle touch start, move, and end events
   */
  handleTouchStart(event) {
    if (this.isBottomDrawer()) {
      this.touchStartY = event.touches[0].clientY;
    } else {
      this.touchStartX = event.touches[0].clientX;
    }
  }

  handleTouchMove(event) {
    if (this.getAttribute("aria-hidden") === "true") {
      return;
    }

    if (this.isBottomDrawer()) {
      const touchY = event.touches[0].clientY;
      const diffY = this.touchStartY - touchY;

      if (diffY < 0) {
        event.preventDefault();
        this.style.transform = `translateY(${Math.abs(diffY)}px)`;
      }
    } else {
      const isRightDrawer = this.isRightDrawer();
      const touchX = event.touches[0].clientX;
      const diff = this.touchStartX - touchX;

      if ((isRightDrawer && diff < 0) || (!isRightDrawer && diff > 0)) {
        event.preventDefault();

        const translate = isRightDrawer ? Math.abs(diff) : -diff;

        this.style.transform = `translateX(${translate}px)`;
      }
    }
  }

  handleTouchEnd(event) {
    if (this.getAttribute("aria-hidden") === "true") {
      return;
    }

    this.style.transform = "";

    if (this.isBottomDrawer()) {
      const endY = event.changedTouches[0].clientY;
      const diffY = this.touchStartY - endY;

      if (-diffY > this.swipeThreshold) {
        this.closeBound();
      }
    } else {
      const isRightDrawer = this.isRightDrawer();
      const endX = event.changedTouches[0].clientX;
      const diff = this.touchStartX - endX;

      const shouldClose =
        (isRightDrawer && diff < -this.swipeThreshold) ||
        (!isRightDrawer && diff > this.swipeThreshold);

      if (shouldClose) {
        this.closeBound();
      }
    }
  }
}
