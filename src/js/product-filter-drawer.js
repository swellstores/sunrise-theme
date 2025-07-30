export class ProductFilterDrawer extends HTMLElement {
  constructor() {
    super();

    this.touchStartX = 0;
    this.touchEndX = 0;
    this.swipeThreshold = 50; // Minimum distance for a swipe

    this.openBound = this.open.bind(this);
    this.closeBound = this.close.bind(this);
    this.onDocumentKeyDownBound = this.onDocumentKeyDown.bind(this);

    this.handleTouchStartBound = this.handleTouchStart.bind(this);
    this.handleTouchMoveBound = this.handleTouchMove.bind(this);
    this.handleTouchEndBound = this.handleTouchEnd.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "dialog");

    document.addEventListener("keydown", this.onDocumentKeyDownBound);

    this.addEventListener("touchstart", this.handleTouchStartBound);
    this.addEventListener("touchmove", this.handleTouchMoveBound);
    this.addEventListener("touchend", this.handleTouchEndBound);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.onDocumentKeyDownBound);

    this.removeEventListener("touchstart", this.handleTouchStartBound);
    this.removeEventListener("touchmove", this.handleTouchMoveBound);
    this.removeEventListener("touchend", this.handleTouchEndBound);
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

  toggle() {
    const isHidden = this.getAttribute("aria-hidden").trim() === "true";

    return isHidden ? this.open() : this.close();
  }

  open() {
    this.classList.remove("-translate-x-full");
    this.setAttribute("aria-hidden", "false");
  }

  close() {
    this.classList.add("-translate-x-full");
    this.setAttribute("aria-hidden", "true");
  }

  /**
   * Handle touch start, move, and end events
   */
  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchMove(event) {
    if (this.getAttribute("aria-hidden") === "true") {
      return;
    }

    const touchX = event.touches[0].clientX;
    const diff = this.touchStartX - touchX;

    // Only allow left swipes
    if (diff > 0) {
      event.preventDefault();
      this.style.transform = `translateX(-${Math.abs(diff)}px)`;
    }
  }

  handleTouchEnd(event) {
    if (this.getAttribute("aria-hidden") === "true") {
      return;
    }

    this.touchEndX = event.changedTouches[0].clientX;
    const diff = this.touchStartX - this.touchEndX;
    const absDiff = Math.abs(diff);

    this.style.transform = "";

    if (absDiff > this.swipeThreshold && diff > 0) {
      // Swipe left - close menu
      this.closeBound();
    }
  }
}
