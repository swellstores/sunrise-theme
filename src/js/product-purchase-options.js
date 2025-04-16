import eventBus from './utils/event-bus';

/**
 * Product component - purchase options
 *
 * @export
 * @class Product
 * @extends {HTMLElement}
 */
export class ProductPurchaseOptions extends HTMLElement {
  constructor() {
    super();
    this.standardInput = null;
    this.standardDiv = null;
    this.standardDivPrice = null;
    this.subscriptionInput = null;
    this.subscriptionDiv = null;
    this.priceInput = null;
    this.subscriptionSelect = null;
    this.subscriptionOptions = [];

    this.subscriptions = [];
    this.handleClickStandardBound = this.handleClickStandard.bind(this);
    this.handleClickSubscriptionBound = this.handleClickSubscription.bind(this);
  }

  connectedCallback() {
    this.standardInput = this.querySelector("#standard");
    this.standardDiv = this.querySelector("#standard-div");
    this.standardDivPrice = this.querySelector("#standard-div-price");
    this.subscriptionInput = this.querySelector("#subscription");
    this.subscriptionDiv = this.querySelector("#subscription-div");
    this.priceInput = this.querySelector("#product-price");
    this.subscriptionSelect = this.querySelector('#subscription-select');
    this.subscriptionOptions = this.querySelectorAll('#subscription-select option');
  
    if (this.standardDiv) {
      this.standardDiv.addEventListener(
        "click",
        this.handleClickStandardBound,
      );
    }

    if (this.subscriptionDiv && this.subscriptionSelect) {
      this.subscriptionDiv.addEventListener(
        "click",
        this.handleClickSubscriptionBound,
      );
    }
  
    if (this.subscriptionSelect) {
      this.subscriptionSelect.addEventListener(
        "change",
        this.handleClickSubscriptionBound.bind(this),
      );
    }
    
    this.subscriptions.push(
      eventBus.on("product-price-change", this.handleUpdateProductPrice.bind(this)),
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions.length = 0;

    if (this.standardDiv) {
      this.standardDiv.removeEventListener(
        "click",
        this.handleClickStandardBound,
      );
    }

    if (this.subscriptionDiv && this.subscriptionSelect) {
      this.subscriptionDiv.removeEventListener(
        "click",
        this.handleClickSubscriptionBound,
      );
    }
  
    if (this.subscriptionSelect) {
      this.subscriptionSelect.removeEventListener(
        "change",
        this.handleClickSubscriptionBound.bind(this),
      );
    }

    this.standardInput = null;
    this.standardDiv = null;
    this.standardDivPrice = null;
    this.subscriptionInput = null;
    this.subscriptionDiv = null;
    this.priceInput = null;
    this.subscriptionSelect = null;
    this.subscriptionOptions = [];
  }

  /**
   * Handle updating product price
   */
  handleUpdateProductPrice(event) {
    const { price } = event;
    if (this.priceInput) {
      const purchaseOptionType = this.priceInput.getAttribute("data-purchase-option-type");
      // ignore options price for subscriptions
      if (purchaseOptionType !== 'subscription') {
        this.priceInput.innerHTML = price;
      }
    }

    // save updated price
    if (this.standardDiv) {
      this.standardDiv.setAttribute("data-price", price);
    }
    if (this.standardDivPrice) {
      this.standardDivPrice.innerHTML = price;
    }
  }

  toggleActive(activeDiv, inactiveDiv, activeInput, inactiveInput) {
    const activeBorderClass = activeDiv.getAttribute("data-active-border-class");
    const inactiveBorderClass = activeDiv.getAttribute("data-inactive-border-class");
    if (inactiveDiv) {
      inactiveDiv.classList.remove(activeBorderClass);
      inactiveDiv.classList.add(inactiveBorderClass);
    }
    activeDiv.classList.remove(inactiveBorderClass);
    activeDiv.classList.add(activeBorderClass);

    if (activeInput) {
      activeInput.setAttribute("checked", "checked");
    }
    if (inactiveInput) {
      inactiveInput.removeAttribute("checked");
    }
  }

  /**
   * Handle standard purchase option click
   */
  handleClickStandard() {
    this.toggleActive(this.standardDiv, this.subscriptionDiv, this.standardInput, this.subscriptionInput);

    if (this.priceInput) {
      this.priceInput.setAttribute("data-purchase-option-type", "standard");
      this.priceInput.setAttribute("data-purchase-option-plan", "");
      const newPrice = this.standardDiv.getAttribute("data-price");
      this.priceInput.innerHTML = newPrice;
      eventBus.emit("product-purchase-option-change", {
        type: "standard",
        planId: "",
      });
    }
  } 
  
  /**
   * Handle subscription purchase option click or select
   */
  handleClickSubscription() {
    this.toggleActive(this.subscriptionDiv, this.standardDiv, this.subscriptionInput, this.standardInput);
  
    if (this.subscriptionSelect && this.priceInput) {
      const planId = this.subscriptionSelect.value;
      for (const option of this.subscriptionOptions) {
        if (option.value === planId) {
          const newPrice = option.getAttribute("data-price");

          this.priceInput.setAttribute("data-purchase-option-type", "subscription");
          this.priceInput.setAttribute("data-purchase-option-plan", planId);
          this.priceInput.innerHTML = newPrice;
          eventBus.emit("product-purchase-option-change", {
            type: "subscription",
            planId,
          });
          break;
        }
      }
    }
  }
}
