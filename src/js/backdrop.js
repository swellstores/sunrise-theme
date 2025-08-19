export class Backdrop extends HTMLElement {
  constructor() {
    super();
    this.sourceId = null;
  }

  show(sourceId) {
    this.sourceId = sourceId;
    this.classList.remove("hidden");
  }

  hide(sourceId) {
    if (sourceId !== this.sourceId) {
      return;
    }

    this.classList.add("hidden");
    this.sourceId = null;
  }
}
