/**
 *
 *
 * @export
 * @class Announcement
 * @extends {HTMLElement}
 */
export class Announcement extends HTMLElement {
  constructor() {
    super();
    this.trigger = null;
    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.trigger = this.querySelector('announcement-trigger');

    if (this.trigger) {
      this.trigger.addEventListener("click", this.onClickBound);
    }
  }

  disconnectedCallback() {
     if (this.trigger) {
      this.trigger.removeEventListener("click", this.onClickBound);
    }
    this.trigger = null;
  }

  // hide section after dismiss button clicked
  onClick() {
    this.classList.add("hidden");
  }
}
