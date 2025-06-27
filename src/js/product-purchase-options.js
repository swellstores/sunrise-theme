export const DEFAULT_PURCHASE_OPTION = Object.freeze({
  type: "standard",
});

export class ProductPurchaseOptions extends HTMLElement {
  get() {
    const selected = this.getSelected();

    return selected?.get() || DEFAULT_PURCHASE_OPTION;
  }

  getSelected() {
    return [
      this.querySelector("product-purchase-option-standard"),
      this.querySelector("product-purchase-option-subscription"),
    ].find((purchaseOption) => purchaseOption?.hasAttribute("selected"));
  }
}
