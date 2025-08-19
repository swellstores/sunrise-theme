class BaseCustomEvent extends CustomEvent {
  constructor(type, detail) {
    super(type, {
      bubbles: true,
      detail,
    });
  }
}

/* FILTER EVENTS */

export class FilterInputChangeEvent extends BaseCustomEvent {
  static type = "filter-input-change";

  constructor(detail) {
    super(FilterInputChangeEvent.type, detail);
  }
}

export class FiltersClearEvent extends BaseCustomEvent {
  static type = "filters-clear";

  constructor(detail) {
    super(FiltersClearEvent.type, detail);
  }
}

/* PAGINATION EVENTS */

export class PaginationLinkClickEvent extends BaseCustomEvent {
  static type = "pagination-link-click";

  constructor(detail) {
    super(PaginationLinkClickEvent.type, detail);
  }
}

export class PaginationChangeEvent extends BaseCustomEvent {
  static type = "pagination-change";

  constructor(detail) {
    super(PaginationChangeEvent.type, detail);
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

export class ProductOptionGiftcardSendToggleEvent extends BaseCustomEvent {
  static type = "product-option-giftcard-send-toggle";

  constructor(detail) {
    super(ProductOptionGiftcardSendToggleEvent.type, detail);
  }
}

export class ProductPurchaseOptionChangeEvent extends BaseCustomEvent {
  static type = "product-purchase-option-change";

  constructor(detail) {
    super(ProductPurchaseOptionChangeEvent.type, detail);
  }
}

export class ProductSortChangeEvent extends BaseCustomEvent {
  static type = "product-sort-change";

  constructor(detail) {
    super(ProductSortChangeEvent.type, detail);
  }
}

export class ProductFiltersChangeEvent extends BaseCustomEvent {
  static type = "product-filters-change";

  constructor(detail) {
    super(ProductFiltersChangeEvent.type, detail);
  }
}

export class ProductFilterToggleEvent extends BaseCustomEvent {
  static type = "product-filter-toggle";

  constructor(detail) {
    super(ProductFilterToggleEvent.type, detail);
  }
}

/* ADDRESS EVENTS */

export class AddressModalSubmitEvent extends BaseCustomEvent {
  static type = "address-modal-submit";

  constructor(detail) {
    super(AddressModalSubmitEvent.type, detail);
  }
}

export class AddressRemoveModalSubmitEvent extends BaseCustomEvent {
  static type = "address-remove-modal-submit";

  constructor(detail) {
    super(AddressRemoveModalSubmitEvent.type, detail);
  }
}
