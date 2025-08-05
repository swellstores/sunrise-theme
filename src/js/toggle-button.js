export class ToggleButton extends HTMLElement {
  constructor() {
    super();

    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "switch");
    this.addEventListener("click", this.onClickBound);

    requestAnimationFrame(() => {
      this.updateCheckbox();
    });
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClickBound);
  }

  get(checked = this.isChecked()) {
    return {
      id: this.getAttribute("id"),
      value: checked ? this.getAttribute("value") : false,
      dataset: this.dataset,
    };
  }

  isChecked() {
    return this.getAttribute("aria-checked") === "true";
  }

  updateCheckbox() {
    const checkbox = this.querySelector("toggle-button-checkbox");

    if (checkbox) {
      checkbox.update(this);
    }
  }

  onClick(event) {
    event.stopPropagation();

    const checked = this.isChecked();

    this.setAttribute("aria-checked", String(!checked));
    this.updateCheckbox();

    this.dispatchChangeEvent(!checked);
  }

  dispatchChangeEvent(checked) {
    const detail = this.get(checked);

    this.dispatchEvent(
      new CustomEvent("change", {
        detail,
        bubbles: true,
      })
    );
  }
}

export class ToggleButtonCheckbox extends HTMLElement {
  update(toggleButton = this.closest("toggle-button")) {
    const checked = toggleButton.isChecked();

    if (checked) {
      this.check();
    } else {
      this.uncheck();
    }
  }

  check() {
    const { checkedClass, uncheckedClass } = this.dataset;

    if (checkedClass) {
      this.classList.add(checkedClass);
    }

    if (uncheckedClass) {
      this.classList.remove(uncheckedClass);
    }
  }

  uncheck() {
    const { checkedClass, uncheckedClass } = this.dataset;

    if (uncheckedClass) {
      this.classList.add(uncheckedClass);
    }

    if (checkedClass) {
      this.classList.remove(checkedClass);
    }
  }
}
