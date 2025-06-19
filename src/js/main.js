import { Cart } from "./cart";
import { CartDrawer } from "./cart-drawer";
import { SearchDialog } from "./search-dialog";
import { MegaMenu } from "./mega-menu";
import hoverintent from "./hoverintent";
import { CascadingMenu } from "./cascading-menu";
import { VariantRadio } from "./variant-radio";
import { Popover } from "./popover";
import { CopyToClipboard } from "./copy-to-clipboard";
import { QuantitySelector } from "./quantity-selector";
import { AddProductForm } from "./add-product-form";
import { ProductPurchaseOptions } from "./product-purchase-options";
import { DrawerMenu } from "./drawer-menu";
import { initPriceSliders } from './price-slider';

// Make hoverintent available globally
window.hoverintent = hoverintent;

window.initPriceSliders = initPriceSliders;

// Import vendor libraries
import { loadIonIcons } from "./vendor";

// Import modules
import "./swiper-element-bundle";
import "./slideshow-navigation";
import "./accordion";
import "./filter";
import "./htmx.min";

// Initialize before IIFE to ensure global availability
window.theme = window.theme || {};
window.theme.slideshow_rendered = true;
window.theme.slideshow_navigation = true;
window.theme.accordion_rendered = true;

(function () {
  function defineCustomElements() {
    customElements.define("cart-root", Cart);
    customElements.define("cart-drawer-root", CartDrawer);
    customElements.define("search-dialog-root", SearchDialog);
    customElements.define("mega-menu-root", MegaMenu);
    customElements.define("variant-radio", VariantRadio);
    customElements.define("popover-root", Popover);
    customElements.define("copy-to-clipboard", CopyToClipboard);
    customElements.define("quantity-selector-root", QuantitySelector);
    customElements.define("cascading-menu-root", CascadingMenu);
    customElements.define("add-product-form", AddProductForm);
    customElements.define("product-purchase-options", ProductPurchaseOptions);
    customElements.define("desktop-drawer-menu-root", DrawerMenu);
  }

  // Call functions
  defineCustomElements();

  // Load IonIcons
  loadIonIcons();

  // Initialize price sliders
  initPriceSliders();
})();
