export class ProductFilterSidebar extends HTMLElement {
  toggle() {
    const isHidden = this.getAttribute("aria-hidden").trim() === "true";

    this.setAttribute("aria-hidden", String(!isHidden));
  }
}
