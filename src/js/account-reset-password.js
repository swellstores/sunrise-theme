export class AccountResetPassword extends HTMLElement {
  constructor() {
    super();

    this.emailInput = null;
    this.passwordInput = null;
    this.submitButton = null;

    this.onChangedBound = this.onChanged.bind(this);
  }

  connectedCallback() {
   this.getSelectors();
  }

  disconnectedCallback() {
    this.clearSelectors();
  }

  getSelectors() {
    this.submitButton = this.querySelector("#submit-reset-password");

    this.emailInput = this.querySelector("input[name='customer\[email\]']");
    if (this.emailInput) {
      this.emailInput.addEventListener("keyup", this.onChangedBound);
    }
    this.passwordInput = this.querySelector("input[name='customer\[password_confirmation\]']");
    if (this.passwordInput) {
      this.passwordInput.addEventListener("keyup", this.onChangedBound);
    }
  }

  clearSelectors() {
    if (this.emailInput) {
      this.emailInput.removeEventListener("keyup", this.onChangedBound);
    }
    if (this.passwordInput) {
      this.passwordInput.removeEventListener("keyup", this.onChangedBound);
    }

    this.emailInput = null;
    this.passwordInput = null;
    this.submitButton = null;
  }

  onChanged() {
    if (!this.submitButton) {
      return;
    }

    const emailValue = this.emailInput?.value;
    const passwordValue = this.passwordInput?.value;
    if (emailValue && passwordValue) {
      this.submitButton.disabled = false;
    } else {
      this.submitButton.disabled = true;
    }
  }
}
