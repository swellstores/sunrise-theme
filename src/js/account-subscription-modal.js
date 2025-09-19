import { Modal } from "./modal";
import { SubscriptionModalSubmitEvent } from "./utils/events";

export class AccountSubscriptionModal extends Modal {}

export class AccountSubscriptionModalCloseButton extends HTMLElement {
  constructor() {
    super();

    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.addEventListener("click", this.onClickBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClickBound);
  }

  onClick(event) {
    event.stopPropagation();

    const modal = this.closest("account-subscription-modal");

    if (modal) {
      modal.close();
    }
  }
}

export class AccountSubscriptionModalSubmitButton extends HTMLElement {
  constructor() {
    super();

    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.addEventListener("click", this.onClickBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClickBound);
  }

  onClick(event) {
    event.stopPropagation();

    const modal = this.closest("account-subscription-modal");

    if (modal) {
      this.dispatchEvent(new SubscriptionModalSubmitEvent());

      modal.close();
    }
  }
}

export class AccountSubscriptionActionButton extends HTMLElement {
  constructor() {
    super();

    this.modalId = null;
    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.modalId = this.getAttribute("aria-controls");

    this.setAttribute("role", "button");
    this.setAttribute("aria-haspopup", "dialog");
    this.addEventListener("click", this.onClickBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClickBound);
  }

  onClick(event) {
    event.stopPropagation();

    const modal = document.getElementById(this.modalId);

    if (modal) {
      modal.open();
    }
  }
}
