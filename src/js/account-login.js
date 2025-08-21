import { getFormData, isFormChanged, isFormValid } from "./utils/form";

const FIELDS = Object.freeze([
  "customer[email]",
  "customer[password]",
]);

export class AccountLogin extends HTMLElement {
  constructor() {
    super();

    this.form = null;
    this.submitButton = null;
    this.initialFormData = null;

    this.onInputChangeBound = this.onInputChange.bind(this);
  }

  connectedCallback() {
    this.form = this.querySelector("#login > form");
    this.submitButton = this.querySelector("#submit-login");
    
    this.initialFormData = getFormData(this.form, FIELDS);

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
      !isFormChanged(this.form, FIELDS, this.initialFormData) ||
      !isFormValid(this.form, FIELDS)
    ) {
      this.submitButton.disabled = true;
    } else {
      this.submitButton.disabled = false;
    }
  }
}

