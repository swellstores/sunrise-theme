import { Modal } from "./modal";
import { getFormData, isFormChanged, isFormValid } from "./utils/form";
import { AddressModalSubmitEvent } from "./utils/events";

export class AddressModal extends Modal {
  constructor() {
    super();

    this.statesByCountry = new Map();

    this.modalTitle = null;
    this.form = null;
    this.updateAddressIdInput = null;
    this.initialFormData = null;
    this.submitButton = null;
    this.countryDropdown = null;
    this.stateInput = null;
    this.stateDropdown = null;
    this.stateOptions = null;
    this.setAsDefaultCheckbox = null;

    this.onChangeBound = this.onChange.bind(this);
    this.closeBound = this.close.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.setElements();
    this.addEventListener("input", this.onChangeBound);
    this.addEventListener("change", this.onChangeBound);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener("input", this.onChangeBound);
    this.removeEventListener("change", this.onChangeBound);
  }

  setElements() {
    // modal
    this.modalTitle = this.querySelector("address-modal-title");

    // form
    this.form = this.querySelector("form");
    this.updateAddressIdInput = this.querySelector(
      'input[name="update_address_id"]'
    );
    this.setAsDefaultCheckbox = this.querySelector(
      'toggle-button[name="address[default]"]'
    );
    this.submitButton = this.querySelector("address-modal-submit-button");

    //country
    this.countryDropdown = this.querySelector(
      "dropdown-menu#address-country-dropdown"
    );

    // state
    this.stateInput = this.querySelector("input#address-province-input");
    this.stateDropdown = this.querySelector(
      "dropdown-menu#address-province-dropdown"
    );

    if (this.stateDropdown) {
      this.stateOptions =
        this.stateDropdown.querySelectorAll("dropdown-option");
    }
  }

  open(title, addressId, isDefault) {
    super.open();

    this.reset();

    if (addressId) {
      this.populate(addressId, isDefault);
      this.updateAddressIdInput.value = addressId;
    }

    this.initialFormData = getFormData(this.form);

    this.setTitle(title);
  }

  close() {
    super.close();
  }

  getAddressFieldFromElement(element) {
    if (!element.name) {
      return;
    }

    const addressField = element.name.match(/address\[(.+?)\]/)?.[1];

    return addressField;
  }

  populate(addressId, isDefault) {
    const addressElement = document.getElementById(`address-data-${addressId}`);

    if (!addressElement) {
      return;
    }

    const address = JSON.parse(addressElement.textContent);

    for (const element of this.form.elements) {
      if (!element.name || element.disabled) {
        continue;
      }

      if (element.name === "address[default]") {
        if (isDefault) {
          element.value = true;
          element.setAttribute("disabled", "");
        }

        continue;
      }

      const addressField = this.getAddressFieldFromElement(element);

      if (!addressField) {
        continue;
      }

      const addressValue = address[addressField];

      if (!addressValue) {
        continue;
      }

      if (addressField === "country") {
        this.onChangeCountry(addressValue.name);
        element.value = addressValue.name;
      } else {
        element.value = addressValue;
      }
    }
  }

  reset() {
    this.form.reset();
    this.updateAddressIdInput.value = null;
    this.setAsDefaultCheckbox.removeAttribute("disabled");
    this.submitButton.setAttribute("disabled", "");
  }

  setTitle(title) {
    if (!title || !this.modalTitle) {
      return;
    }

    this.modalTitle.textContent = title;
  }

  getCountry(countryId) {
    return window.theme.geo.countries.find(
      (country) => country.id === countryId
    );
  }

  getCountryStates(countryId) {
    if (this.statesByCountry.has(countryId)) {
      return this.statesByCountry.get(countryId);
    }

    const states = window.theme.geo.states.filter(
      (state) => state.country === countryId
    );

    const statesById = new Map();

    states.forEach((state) => {
      statesById.set(state.id, state);
    });

    this.statesByCountry.set(countryId, statesById);

    return statesById;
  }

  showStateInput() {
    this.stateInput.disabled = false;
    this.stateInput.value = "";
    this.stateInput.classList.remove("hidden");

    this.stateDropdown.disabled = true;
    this.stateDropdown.removeAttribute("required");
    this.stateDropdown.classList.add("hidden");
  }

  showStateDropdown() {
    this.stateInput.disabled = true;
    this.stateInput.classList.add("hidden");

    this.stateDropdown.disabled = false;
    this.stateDropdown.setAttribute("required", "");
    this.stateDropdown.classList.remove("hidden");
  }

  showCountyStates(countryId) {
    const states = this.getCountryStates(countryId);
    const hasStates = states.size > 0;

    if (!hasStates) {
      return this.showStateInput();
    }

    this.showStateDropdown();

    let firstStateValue = null;

    this.stateOptions.forEach((option) => {
      const optionValue = option.getAttribute("value");

      if (states.has(optionValue)) {
        option.classList.remove("hidden");

        if (!firstStateValue) {
          firstStateValue = optionValue;
        }
      } else {
        option.classList.add("hidden");
      }
    });

    if (firstStateValue) {
      this.stateDropdown.value = firstStateValue;
    }
  }

  onChange(event) {
    event.stopPropagation();

    const id = event.target.id;

    if (id === "address-country") {
      this.onChangeCountry(event.detail.value);
    }

    if (
      !isFormChanged(this.form, this.initialFormData) ||
      !isFormValid(this.form)
    ) {
      this.submitButton.setAttribute("disabled", "");
    } else {
      this.submitButton.removeAttribute("disabled");
    }
  }

  onChangeCountry(countryId) {
    const country = this.getCountry(countryId);

    if (!country) {
      return;
    }

    this.showCountyStates(countryId);
  }
}

export class AddressAddButton extends HTMLElement {
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

    const { modalTitle } = this.dataset;
    const modal = document.querySelector("address-modal");

    if (modal) {
      modal.open(modalTitle);
    }
  }
}

export class AddressEditButton extends HTMLElement {
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

    const { modalTitle, addressId, isDefaultAddress } = this.dataset;
    const isDefault = isDefaultAddress === "true";
    const modal = document.querySelector("address-modal");

    if (modal) {
      modal.open(modalTitle, addressId, isDefault);
    }
  }
}

export class AddressModalCloseButton extends HTMLElement {
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

    const modal = this.closest("address-modal");

    if (modal) {
      modal.close();
    }
  }
}

export class AddressModalSubmitButton extends HTMLElement {
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

    const modal = this.closest("address-modal");

    if (modal) {
      this.dispatchEvent(new AddressModalSubmitEvent());

      modal.close();
    }
  }
}
