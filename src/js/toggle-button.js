export class ToggleButton extends HTMLElement {
  constructor() {
    super();

    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "switch");
    this.addEventListener("click", this.onClickBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClickBound);
  }

  onClick() {
    const checked = this.hasAttribute("checked");

    if (checked) {
      this.removeAttribute("checked");
    } else {
      this.setAttribute("checked", "");
    }

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          id: this.getAttribute("id"),
          value: !checked ? this.getAttribute("value") : false,
          dataset: this.dataset,
        },
        bubbles: true,
      })
    );
  }
}
