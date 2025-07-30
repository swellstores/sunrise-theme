export class Account extends HTMLElement {
  constructor() {
    super();

    this.ordersDiv = null;
    this.subscriptionsDiv = null;
    this.ordersLink = null;
    this.subscriptionsLink = null;

    this.onOrdersClickBound = this.onOrdersClick.bind(this);
    this.onSubscriptionsClickBound = this.onSubscriptionsClick.bind(this);
  }

  connectedCallback() {
    this.ordersDiv = this.querySelector("#account-orders");
    this.subscriptionsDiv = this.querySelector("#account-subscriptions");
    this.ordersLink = this.querySelector("#show-orders");
    this.subscriptionsLink = this.querySelector("#show-subscriptions");
    if (this.ordersLink) {
      this.ordersLink.addEventListener("click", this.onOrdersClickBound);
    }
    if (this.subscriptionsLink) {
      this.subscriptionsLink.addEventListener("click", this.onSubscriptionsClickBound);
    }

    // handle subscriptions link from other pages (for example, addresses)
    const url = new URL(window.location);
    const tab = url.searchParams.get('tab');
    if (tab === 'subscriptions') {
      this.showSubscriptions();
    } else {
      this.showOrders();
    }
  }

  disconnectedCallback() {
    if (this.ordersLink) {
      this.ordersLink.removeEventListener("click", this.onOrdersClickBound);
    }
    if (this.subscriptionsLink) {
      this.subscriptionsLink.removeEventListener("click", this.onSubscriptionsClickBound);
    }
    this.ordersDiv = null;
    this.subscriptionsDiv = null;
    this.ordersLink = null;
    this.subscriptionsLink = null;
  }

  switchTab(tab, showDiv, hideDiv) {
    if (showDiv) {
      showDiv.style.display = 'block';
    }
    if (hideDiv) {
      hideDiv.style.display = 'none';
    }

    // use tab parameter
    const url = new URL(window.location);
    if (tab) {
      url.searchParams.set('tab', tab);
    } else {
      url.searchParams.delete('tab');
    }

    history.replaceState(null, "", url);
  }

  showOrders() {
    this.switchTab('', this.ordersDiv, this.subscriptionsDiv);
  }

  showSubscriptions() {
    this.switchTab('subscriptions', this.subscriptionsDiv, this.ordersDiv);
  }

  onOrdersClick(ev) {
    ev.preventDefault();
    this.showOrders();
  }

  onSubscriptionsClick(ev) {
    ev.preventDefault();
    this.showSubscriptions();
  }
}
