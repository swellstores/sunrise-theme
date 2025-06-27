import eventBus from "./utils/event-bus";

export class CartCount extends HTMLElement {
  constructor() {
    super();

    this.unsubscribeItemCountUpdate = null;
    this.onUpdateItemCountBound = this.onUpdateItemCount.bind(this);
  }

  connectedCallback() {
    this.unsubscribeItemCountUpdate = eventBus.on(
      "cart-item-count-update",
      this.onUpdateItemCountBound
    );
  }

  disconnectedCallback() {
    if (this.unsubscribeItemCountUpdate) {
      this.unsubscribeItemCountUpdate();
    }
  }

  onUpdateItemCount(itemCount) {
    this.textContent = itemCount;
  }
}
