import { CartAPI } from "./utils/cart-api";
import {
  ProductQuantityChangeEvent,
  ProductOptionChangeEvent,
  ProductPurchaseOptionChangeEvent,
} from "./utils/events";
import { setFormParams } from "./utils/form";
import { DEFAULT_PURCHASE_OPTION } from "./product-purchase-options";

export class ProductSection extends HTMLElement {
  constructor() {
    super();

    this.buyButton = null;

    this.onChangeProductBound = this.onChangeProduct.bind(this);
    this.onAddItemBound = this.onAddItem.bind(this);
  }

  connectedCallback() {
    this.addEventListener("htmx:configRequest", this.onChangeProductBound);

    this.buyButton = this.querySelector("button#buy-button");

    if (this.buyButton) {
      this.buyButton.addEventListener("click", this.onAddItemBound);
    }
  }

  disconnectedCallback() {
    this.removeEventListener("htmx:configRequest", this.onChangeProductBound);

    if (this.buyButton) {
      this.buyButton.removeEventListener("click", this.onAddItemBound);
    }
  }

  onChangeProduct(event) {
    const productData = this.getData(event, false);

    setFormParams(event, productData);
  }

  getData(event, validate = true) {
    const { options, option_values, selected_option_value } =
      this.getOptions(event, validate) || {};
    const purchaseOption = this.getPurchaseOption(event);
    const quantity = this.getQuantity(event);

    return {
      options,
      option_values,
      selected_option_value,
      purchase_option: purchaseOption,
      quantity,
    };
  }

  getQuantity(event) {
    const { triggeringEvent } = event.detail;

    if (triggeringEvent instanceof ProductQuantityChangeEvent) {
      return triggeringEvent.detail.value;
    }

    const productQuantity = this.querySelector("product-quantity");

    return productQuantity?.get() || 1;
  }

  getOptions(event, validate = true) {
    const productOptions = this.querySelector("product-options");

    if (!productOptions) {
      return;
    }

    const { options, valid } = productOptions.get(validate);

    if (validate && !valid) {
      throw new Error("Product options are invalid");
    }

    const { triggeringEvent } = event.detail;
    const valueIds = productOptions.getValueIds();
    const data = {
      options,
      option_values: valueIds.join(","),
    };

    if (triggeringEvent instanceof ProductOptionChangeEvent) {
      data.selected_option_value = triggeringEvent.detail.value_id;
    }

    return data;
  }

  getPurchaseOption(event) {
    const { triggeringEvent } = event.detail;

    if (triggeringEvent instanceof ProductPurchaseOptionChangeEvent) {
      return triggeringEvent.detail;
    }

    const purchaseOptions = this.querySelector("product-purchase-options");

    return purchaseOptions?.get() || DEFAULT_PURCHASE_OPTION;
  }

  async onAddItem(event) {
    event.preventDefault();

    try {
      const { productId } = this.dataset;
      const {
        options,
        purchase_option: purchaseOption,
        quantity,
      } = this.getData(event);

      this.toggleBuyButtonLoader(true);

      await CartAPI.addToCart(productId, options, purchaseOption, quantity);
    } catch (error) {
      console.error(error.message);
    } finally {
      this.toggleBuyButtonLoader(false);
    }
  }

  toggleBuyButtonLoader(loading) {
    const buyButtonText = this.buyButton.querySelector("#buy-button-text");
    const buyButtonLoader = this.buyButton.querySelector('[role="status"]');

    if (loading) {
      buyButtonText.classList.add("hidden");
      buyButtonLoader.classList.replace("hidden", "flex");
    } else {
      buyButtonText.classList.remove("hidden");
      buyButtonLoader.classList.replace("flex", "hidden");
    }
  }
}
