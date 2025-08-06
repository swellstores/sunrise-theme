export class AccountResetPassword extends HTMLElement {
  constructor() {
    super();

    this.onInputChangedBound = this.onInputChanged.bind(this);
  }

  connectedCallback() {
    this.addEventListener("input", this.onInputChangedBound);
  }

  disconnectedCallback() {
    this.removeEventListener("input", this.onInputChangedBound);
  }

  onInputChanged() {
    const submitButton = this.querySelector("#submit-reset-password");
    if (!submitButton) {
      return;
    }

    const emailInput = this.querySelector("input[name='customer\[email\]']");
    const emailValue = emailInput?.value;
    const passwordInput = this.querySelector("input[name='customer\[password_confirmation\]']");
    const passwordValue = passwordInput?.value;

    if (emailValue && passwordValue) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }
}
