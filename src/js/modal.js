export class Modal extends HTMLElement {
  constructor() {
    super();

    this.backdropOverlay = null;
  }

  connectedCallback() {
    this.classList.add(
      "fixed",
      "top-1/2",
      "left-1/2",
      "-translate-x-1/2",
      "-translate-y-1/2",
      "z-50",
      "hidden"
    );

    this.backdropOverlay = document.querySelector("backdrop-root");
  }

  disconnectedCallback() {}

  open() {
    this.classList.remove("hidden");

    if (this.backdropOverlay) {
      this.backdropOverlay.show("modal");
    }
  }

  close() {
    this.classList.add("hidden");

    if (this.backdropOverlay) {
      this.backdropOverlay.hide("modal");
    }
  }
}
