export class RadioButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute("role", "radiogroup");
  }

  selectOption(selectedOption) {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          id: this.getAttribute("id"),
          value: selectedOption.getAttribute("value"),
          dataset: selectedOption.dataset,
        },
        bubbles: true,
      })
    );
  }
}

export class RadioOption extends HTMLElement {
  constructor() {
    super();

    this.onSelectBound = this.onSelect.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.addEventListener("click", this.onSelectBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onSelectBound);
  }

  onSelect() {
    if (this.hasAttribute("selected")) {
      return;
    }

    const radioButton = this.closest("radio-button");

    if (radioButton) {
      radioButton.selectOption(this);
    }
  }
}
