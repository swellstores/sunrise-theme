import { getFormData, isFormChanged, isFormValid } from "./utils/form";

const FIELDS = Object.freeze([
  "customer[first_name]",
  "customer[last_name]",
  "customer[email]",
  "customer[phone]",
]);

export class AccountDetails extends HTMLElement {
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
    this.initialFormData = getFormData(this.form, FIELDS);

    this.addEventListener("input", this.onInputChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener("input", this.onInputChangeBound);
  }

  onInputChange(event) {
    event.stopPropagation();

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
