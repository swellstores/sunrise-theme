import { FiltersClearEvent } from "./utils/events";

export class FiltersClear extends HTMLElement {
  constructor() {
    super();

    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.addEventListener("click", this.onClickBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClickBound);
  }

  onClick(event) {
    event.stopPropagation();

    const filtersClearEvent = new FiltersClearEvent();

    this.dispatchEvent(filtersClearEvent);
  }
}
