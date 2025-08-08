import { DrawerPanel } from "./drawer-panel";

const DEFAULT_TAB = "details";

export class AccountNav extends HTMLElement {
  constructor() {
    super();

    this.drawer = null;
    this.onChangeTabBound = this.onChangeTab.bind(this);
  }

  connectedCallback() {
    window.addEventListener("hashchange", this.onChangeTabBound);
    this.onChangeTab();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.onChangeTabBound);
  }

  getDrawer() {
    this.drawer = this.drawer || this.querySelector("account-nav-drawer");

    return this.drawer;
  }

  toggleDrawer() {
    const drawer = this.getDrawer();

    if (drawer) {
      drawer.toggle();
    }
  }

  onChangeTab() {
    const { hash } = window.location;
    const activeNavItem = this.querySelector(
      `.account-nav-item[href="${hash}"]`
    );

    if (!activeNavItem) {
      window.location.hash = DEFAULT_TAB;
      return;
    }

    const navTriggerText = this.querySelector("account-nav-trigger-text");

    if (navTriggerText) {
      navTriggerText.textContent = activeNavItem.textContent;
    }

    const navItems = this.querySelectorAll(".account-nav-item");
    const tabs = document.querySelectorAll(".account-tab");

    navItems.forEach((navItem) => {
      const isActive = navItem.getAttribute("href") === hash;

      if (isActive) {
        navItem.classList.add("active");
      } else {
        navItem.classList.remove("active");
      }
    });

    tabs.forEach((tab) => {
      const isActive = `#${tab.id}` === hash;

      if (isActive) {
        tab.classList.remove("hidden");
      } else {
        tab.classList.add("hidden");
      }
    });
  }
}

export class AccountNavDrawer extends DrawerPanel {
  constructor() {
    super();

    this.onClickNavItemBound = this.onClickNavItem.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("click", this.onClickNavItemBound);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener("click", this.onClickNavItemBound);
  }

  onClickNavItem(event) {
    const target = event.target.closest(".account-nav-item");

    if (!target || !this.contains(target)) {
      return;
    }

    this.close();
  }
}

export class AccountNavTrigger extends HTMLElement {
  constructor() {
    super();

    this.nav = null;
    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.addEventListener("click", this.onClickBound);
  }

  disconnectedCallback() {
    this.addEventListener("click", this.onClickBound);
  }

  getNav() {
    this.nav = this.nav || this.closest("account-nav");

    return this.nav;
  }

  onClick(event) {
    event.stopPropagation();

    const nav = this.getNav();

    nav.toggleDrawer();
  }
}
