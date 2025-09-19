export class ToggleButton extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super();

    this._internals = this.attachInternals();

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

  formResetCallback() {
    this.value = false;
  }

  get value() {
    return this.getAttribute("aria-checked") === "true" ? true : null;
  }

  set value(checked) {
    this.setAttribute("aria-checked", Boolean(checked));
    this.updateCheckbox();
    this._internals.setFormValue(checked ? true : null);
  }

  get name() {
    return this.getAttribute("name");
  }

  get(checked = this.value) {
    return {
      id: this.getAttribute("id"),
      value: checked ? this.getAttribute("value") : false,
      dataset: this.dataset,
    };
  }

  updateCheckbox() {
    const checkbox = this.querySelector("toggle-button-checkbox");

    if (checkbox) {
      checkbox.update(this);
    }
  }

  onClick(event) {
    event.stopPropagation();

    const checked = Boolean(this.value);

    this.value = !checked;
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
    return toggleButton.value ? this.check() : this.uncheck();
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
