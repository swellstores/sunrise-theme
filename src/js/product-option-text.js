export class ProductOptionText extends HTMLElement {
  constructor() {
    super();

    this.optionId = null;
    this.value = "";
    this.required = false;
    this.error = null;

    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    this.optionId = this.dataset.optionId;
    this.required = this.hasAttribute("required");
    this.error = this.querySelector("option-error");

    this.addEventListener("change", this.onChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.onChangeBound);
  }

  get() {
    return {
      id: this.optionId,
      value: this.value,
    };
  }

  valid() {
    return !this.required || Boolean(this.value);
  }

  validate() {
    if (this.valid()) {
      this.hideError();

      return true;
    }

    this.showError();

    return false;
  }

  showError() {
    if (this.error) {
      this.error.classList.remove("hidden");
    }
  }

  hideError() {
    if (this.error) {
      this.error.classList.add("hidden");
    }
  }

  onChange(event) {
    event.stopPropagation();

    const { value } = event.target;

    this.value = value.trim();

    this.validate();
  }
}
