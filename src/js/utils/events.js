class BaseCustomEvent extends CustomEvent {
  constructor(type, detail) {
    super(type, {
      bubbles: true,
      detail,
    });
  }
}

/* CART EVENTS */

export class CartItemQuantityChangeEvent extends BaseCustomEvent {
  static type = "cart-item-quantity-change";

  constructor(detail) {
    super(CartItemQuantityChangeEvent.type, detail);
  }
}

export class CartItemRemoveEvent extends BaseCustomEvent {
  static type = "cart-item-remove";

  constructor(detail) {
    super(CartItemRemoveEvent.type, detail);
  }
}

/* PRODUCT EVENTS */

export class ProductQuantityChangeEvent extends BaseCustomEvent {
  static type = "product-quantity-change";

  constructor(detail) {
    super(ProductQuantityChangeEvent.type, detail);
  }
}

export class ProductOptionChangeEvent extends BaseCustomEvent {
  static type = "product-option-change";

  constructor(detail) {
    super(ProductOptionChangeEvent.type, detail);
  }
}

export class ProductPurchaseOptionChangeEvent extends BaseCustomEvent {
  static type = "product-purchase-option-change";

  constructor(detail) {
    super(ProductPurchaseOptionChangeEvent.type, detail);
  }
}
