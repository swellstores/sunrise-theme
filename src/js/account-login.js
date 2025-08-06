export class AccountLogin extends HTMLElement {
  constructor() {
    super();

    this.onInputChangedBound = this.onInputChanged.bind(this);
  }

  connectedCallback() {
    this.addEventListener("keyup", this.onInputChangedBound);
  }

  disconnectedCallback() {
    this.removeEventListener("keyup", this.onInputChangedBound);
  }

  onInputChanged() {
    const submitLoginButton = this.querySelector("#submit-login");
    if (submitLoginButton) {
      const emailInput = this.querySelector("input[name='customer\[email\]']");
      const emailValue = emailInput?.value;
      const passwordInput = this.querySelector("input[name='customer\[password\]']");
      const passwordValue = passwordInput?.value;

      if (emailValue && passwordValue) {
        submitLoginButton.disabled = false;
      } else {
        submitLoginButton.disabled = true;
      }
    }

    const submitRecoverButton = this.querySelector("#submit-recover");
    if (submitRecoverButton) {
      const recoverEmailInput = this.querySelector("#RecoverEmail");
      const recoverEmailValue = recoverEmailInput?.value;

      if (recoverEmailValue) {
        submitRecoverButton.disabled = false;
      } else {
        submitRecoverButton.disabled = true;
      }
    }
  }
}
