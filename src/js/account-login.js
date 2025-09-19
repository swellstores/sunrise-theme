import { getFormData, isFormChanged, isFormValid } from "./utils/form";

export class AccountLogin extends HTMLElement {
  constructor() {
    super();

    this.form = null;
    this.submitButton = null;
    this.initialFormData = null;

    this.onInputChangeBound = this.onInputChange.bind(this);
  }

  connectedCallback() {
    this.form = this.querySelector("form");
    this.submitButton = this.querySelector('button[type="submit"]');
    
    this.initialFormData = getFormData(this.form);

    this.addEventListener("input", this.onInputChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener("input", this.onInputChangeBound);

    this.form = null;
    this.submitButton = null;
    this.initialFormData = null;
  }

  onInputChange(ev) {
    ev.stopPropagation();
    if (
      !isFormChanged(this.form, this.initialFormData) ||
      !isFormValid(this.form)
    ) {
      this.submitButton.disabled = true;
    } else {
      this.submitButton.disabled = false;
    }
  }
}

