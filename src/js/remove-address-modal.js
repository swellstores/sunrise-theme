import { Modal } from "./modal";
import { AddressRemoveModalSubmitEvent } from "./utils/events";

export class AddressRemoveModal extends Modal {
  constructor() {
    super();

    this.deleteAddressIdInput = null;
  }

  connectedCallback() {
    super.connectedCallback();

    this.deleteAddressIdInput = this.querySelector(
      'input[name="delete_address_id"]'
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  open(addressId) {
    super.open();

    this.deleteAddressIdInput.value = addressId;
  }

  close() {
    super.close();
  }
}

export class AddressRemoveButton extends HTMLElement {
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

    const { addressId } = this.dataset;
    const modal = document.querySelector("address-remove-modal");

    if (modal) {
      modal.open(addressId);
    }
  }
}

export class AddressRemoveModalCloseButton extends HTMLElement {
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

    const modal = this.closest("address-remove-modal");

    if (modal) {
      modal.close();
    }
  }
}

export class AddressRemoveModalSubmitButton extends HTMLElement {
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

    const modal = this.closest("address-remove-modal");

    if (modal) {
      this.dispatchEvent(new AddressRemoveModalSubmitEvent());

      modal.close();
    }
  }
}
