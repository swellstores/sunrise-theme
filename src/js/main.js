import hoverintent from "./hoverintent";
// components
import { RadioButton, RadioOption } from "./radio-button";
import { DropdownMenu, DropdownTrigger, DropdownOption } from "./dropdown-menu";
import { ToggleButton } from "./toggle-button";
import { QuantitySelector } from "./quantity-selector";
import { CopyToClipboard } from "./copy-to-clipboard";
import { Popover } from "./popover";
import { SearchDialog } from "./search-dialog";
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";
// menu
import { MegaMenu } from "./mega-menu";
import { CascadingMenu } from "./cascading-menu";
import { DrawerMenu } from "./drawer-menu";
// cart
import { Cart } from "./cart";
import { CartDrawer } from "./cart-drawer";
import { CartCount } from "./cart-count";
import { CartItemQuantity } from "./cart-item-quantity";
import { CartItemRemove } from "./cart-item-remove";
// product
import { ProductQuantity } from "./product-quantity";
import { ProductOptions } from "./product-options";
import { ProductOptionSelect } from "./product-option-select";
import { ProductOptionToggle } from "./product-option-toggle";
import { ProductOptionText } from "./product-option-text";
import { ProductPurchaseOptions } from "./product-purchase-options";
import { ProductPurchaseOptionStandard } from "./product-purchase-option-standard";
import { ProductPurchaseOptionSubscription } from "./product-purchase-option-subscription";
import { ProductSection } from "./product-section";
// products filter
import { FilterDrawer } from "./filter-drawer";
import { initPriceSliders, updatePriceSliders } from "./price-slider";
import { MainSubscription } from "./main-subscription";

// Make hoverintent available globally
window.hoverintent = hoverintent;

window.initPriceSliders = initPriceSliders;
window.updatePriceSliders = updatePriceSliders;

// Initialize accordions function
function initAccordions() {
  const accordionItems = document.querySelectorAll("accordion-item");
  accordionItems.forEach((item) => {
    const isExpanded = item.getAttribute("aria-expanded") === "true";
    const content = item.querySelector("accordion-content");

    if (content && isExpanded) {
      // Force open if it should be expanded
      content.open();
    }
  });
}

window.initAccordions = initAccordions;

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
    // components
    customElements.define("radio-button", RadioButton);
    customElements.define("radio-option", RadioOption);
    customElements.define("dropdown-menu", DropdownMenu);
    customElements.define("dropdown-trigger", DropdownTrigger);
    customElements.define("dropdown-option", DropdownOption);
    customElements.define("toggle-button", ToggleButton);
    customElements.define("quantity-selector", QuantitySelector);
    customElements.define("copy-to-clipboard", CopyToClipboard);
    customElements.define("popover-root", Popover);
    customElements.define("search-dialog-root", SearchDialog);
    customElements.define("accordion-root", AccordionRoot);
    customElements.define("accordion-item", AccordionItem);
    customElements.define("accordion-trigger", AccordionTrigger);
    customElements.define("accordion-content", AccordionContent);

    // menu
    customElements.define("mega-menu-root", MegaMenu);
    customElements.define("cascading-menu-root", CascadingMenu);
    customElements.define("desktop-drawer-menu-root", DrawerMenu);

    // cart
    customElements.define("cart-root", Cart);
    customElements.define("cart-drawer-root", CartDrawer);
    customElements.define("cart-count", CartCount);
    customElements.define("cart-item-quantity", CartItemQuantity);
    customElements.define("cart-item-remove", CartItemRemove);

    // product
    customElements.define("product-section", ProductSection);
    customElements.define("product-quantity", ProductQuantity);
    customElements.define("product-options", ProductOptions);
    customElements.define("product-option-select", ProductOptionSelect);
    customElements.define("product-option-toggle", ProductOptionToggle);
    customElements.define("product-option-text", ProductOptionText);
    customElements.define("product-purchase-options", ProductPurchaseOptions);
    customElements.define("filter-drawer-root", FilterDrawer);
    customElements.define(
      "product-purchase-option-standard",
      ProductPurchaseOptionStandard,
    );
    customElements.define(
      "product-purchase-option-subscription",
      ProductPurchaseOptionSubscription,
    );

    // subscription
    customElements.define("main-subscription", MainSubscription);
  }

  // Call functions
  defineCustomElements();

  // Load IonIcons
  loadIonIcons();

  // Initialize price sliders
  initPriceSliders();
})();
