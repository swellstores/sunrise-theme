export class AccountRegister extends HTMLElement {
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
    const submitButton = this.querySelector("#submit-register");
    if (!submitButton) {
      return;
    }

    const firstNameInput = this.querySelector("input[name='customer\[first_name\]']");
    const firstNameValue = firstNameInput?.value;
    const lastNameInput = this.querySelector("input[name='customer\[last_name\]']");
    const lastNameValue = lastNameInput?.value;
    const emailInput = this.querySelector("input[name='customer\[email\]']");
    const emailValue = emailInput?.value;
    const passwordInput = this.querySelector("input[name='customer\[password\]']");
    const passwordValue = passwordInput?.value;
   
     if (emailValue && passwordValue && firstNameValue && lastNameValue) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }
}
