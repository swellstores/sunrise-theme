import { getFormData, isFormChanged, isFormValid } from "./utils/form";

const FIELDS = Object.freeze([
  "customer[first_name]",
  "customer[last_name]",
  "customer[email]",
  "customer[password]",
]);

export class AccountRegister extends HTMLElement {
  constructor() {
    super();

    this.form = null;
    this.submitButton = null;
    this.initialFormData = null;
    this.fields = {};

    this.onInputChangeBound = this.onInputChange.bind(this);
    this.onBeforeSwapBound = this.onBeforeSwap.bind(this);
    this.onAfterSwapBound = this.onAfterSwap.bind(this);
  }

  connectedCallback() {
    this.form = this.querySelector("form");
    this.submitButton = this.querySelector('button[type="submit"]');
    this.initialFormData = getFormData(this.form);

    this.addEventListener("input", this.onInputChangeBound);
    this.addEventListener("htmx:beforeSwap", this.onBeforeSwapBound);
    this.addEventListener("htmx:afterSwap", this.onAfterSwapBound);
  }

  disconnectedCallback() {
    this.removeEventListener("input", this.onInputChangeBound);
    this.removeEventListener("htmx:beforeSwap", this.onBeforeSwapBound);
    this.removeEventListener("htmx:afterSwap", this.onAfterSwapBound);

    this.form = null;
    this.submitButton = null;
    this.initialFormData = null;
    this.fields = {};
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

  onBeforeSwap() {
    // store fields
    this.fields = {};
    for (const field of FIELDS) {
      const value = this.form?.elements[field]?.value || '';
      this.fields[field] = value;
    }
  }

  onAfterSwap() {
    // restore fields
    for (const field of FIELDS) {
      const formField = this.form?.elements[field];
      if (formField) {
        formField.value = this.fields[field];
      }
    }
  }
}
