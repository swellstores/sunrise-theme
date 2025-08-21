export class DropdownMenu extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super();

    this._internals = this.attachInternals();
    this._value = "";

    this.trigger = null;
    this.triggerPlaceholder = null;
    this.triggerLabel = null;

    this.onClickTriggerBound = this.onClickTrigger.bind(this);
    this.onClickOutsideBound = this.onClickOutside.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "listbox");
    this.setAttribute("aria-expanded", "false");

    this.trigger = this.querySelector("dropdown-trigger");

    if (this.trigger) {
      this.triggerPlaceholder = this.trigger.querySelector(
        "dropdown-trigger-placeholder"
      );
      this.triggerLabel = this.trigger.querySelector("dropdown-trigger-label");

      this.trigger.addEventListener("click", this.onClickTriggerBound);
    }

    document.addEventListener("click", this.onClickOutsideBound);
  }

  disconnectedCallback() {
    if (this.trigger) {
      this.trigger.removeEventListener("click", this.onClickTriggerBound);
    }
    document.removeEventListener("click", this.onClickOutsideBound);
  }

  formResetCallback() {
    this.value = "";
  }

  set value(value) {
    const required = this.hasAttribute("required");
    const option = value
      ? this.querySelector(`dropdown-option[value="${value}"]`)
      : null;

    if (option) {
      this._value = value;
      this.showSelectedValue(option.dataset?.label || value);
      this.setAttribute("value", this._value);
    } else {
      this._value = "";
      this.showPlaceholder();
      this.removeAttribute("value");
    }

    this._internals.setFormValue(this._value);

    if (required && !this._value) {
      this._internals.setValidity({ valueMissing: true }, null);
    } else {
      this._internals.setValidity({});
    }
  }

  get value() {
    return this._value;
  }

  get name() {
    return this.getAttribute("name");
  }

  get validity() {
    return this._internals.validity;
  }

  showSelectedValue(content) {
    if (this.triggerPlaceholder) {
      this.triggerPlaceholder.classList.add("hidden");
    }

    if (this.triggerLabel && content) {
      this.triggerLabel.classList.remove("hidden");
      this.triggerLabel.textContent = content;
    }
  }

  showPlaceholder() {
    if (this.triggerPlaceholder) {
      this.triggerPlaceholder.classList.remove("hidden");
    }

    if (this.triggerLabel) {
      this.triggerLabel.classList.add("hidden");
      this.triggerLabel.textContent = "";
    }
  }

  onClickTrigger() {
    const isExpanded = this.getAttribute("aria-expanded") === "true";

    this.setAttribute("aria-expanded", String(!isExpanded));
  }

  onClickOutside(event) {
    if (!this.contains(event.target)) {
      this.setAttribute("aria-expanded", "false");
    }
  }

  selectOption(selectedOption) {
    this.value = selectedOption.getAttribute("value");

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          id: this.getAttribute("id"),
          value: this.value,
          dataset: selectedOption.dataset,
        },
        bubbles: true,
      })
    );
  }
}

export class DropdownTrigger extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.setAttribute("aria-haspopup", "listbox");
  }
}

export class DropdownOption extends HTMLElement {
  constructor() {
    super();

    this.onSelectBound = this.onSelect.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "option");
    this.addEventListener("click", this.onSelectBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onSelectBound);
  }

  onSelect() {
    if (this.hasAttribute("selected")) {
      return;
    }

    const dropdownMenu = this.closest("dropdown-menu");

    if (dropdownMenu) {
      dropdownMenu.onClickTrigger();
      dropdownMenu.selectOption(this);
    }
  }
}
