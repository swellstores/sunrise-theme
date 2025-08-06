export class AccountLogin extends HTMLElement {
  constructor() {
    super();

    this.emailInput = null;
    this.passwordInput = null;
    this.submitButton = null;

    this.recoverEmailInput = null;
    this.submitRecoverButton = null;

    this.onChangedBound = this.onChanged.bind(this);
    this.onChangedRecoverBound = this.onChangedRecover.bind(this);
  }

  connectedCallback() {
   this.getSelectors();
  }

  disconnectedCallback() {
    this.clearSelectors();
  }

  getSelectors() {
    this.submitButton = this.querySelector("#submit-login");

    this.emailInput = this.querySelector("input[name='customer\[email\]']");
    if (this.emailInput) {
      this.emailInput.addEventListener("keyup", this.onChangedBound);
    }
    this.passwordInput = this.querySelector("input[name='customer\[password\]']");
    if (this.passwordInput) {
      this.passwordInput.addEventListener("keyup", this.onChangedBound);
    }

    this.submitRecoverButton = this.querySelector("#submit-recover");

    this.recoverEmailInput = this.querySelector("#RecoverEmail");
    if (this.recoverEmailInput) {
      this.recoverEmailInput.addEventListener("keyup", this.onChangedRecoverBound);
    }
  }

  clearSelectors() {
    if (this.emailInput) {
      this.emailInput.removeEventListener("keyup", this.onChangedBound);
    }
    if (this.passwordInput) {
      this.passwordInput.removeEventListener("keyup", this.onChangedBound);
    }
     if (this.recoverEmailInput) {
      this.recoverEmailInput.removeEventListener("keyup", this.onChangedRecoverBound);
    }

    this.emailInput = null;
    this.passwordInput = null;
    this.submitButton = null;
    this.recoverEmailInput = null;
    this.submitRecoverButton = null;
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

  onChangedRecover() {
    if (!this.submitRecoverButton) {
      return;
    }

    const emailValue = this.recoverEmailInput?.value;
    if (emailValue) {
      this.submitRecoverButton.disabled = false;
    } else {
      this.submitRecoverButton.disabled = true;
    }
  }
}
