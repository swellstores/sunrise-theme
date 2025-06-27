export class DropdownMenu extends HTMLElement {
  constructor() {
    super();

    this.onClickTriggerBound = this.onClickTrigger.bind(this);
    this.onClickOutsideBound = this.onClickOutside.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "listbox");
    this.setAttribute("aria-expanded", "false");

    this.trigger = this.querySelector("dropdown-trigger");

    if (this.trigger) {
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
