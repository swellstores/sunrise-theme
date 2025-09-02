import hoverintent from "./hoverintent";
// components
import { Backdrop } from "./backdrop";
import { RadioButton, RadioOption } from "./radio-button";
import { DropdownMenu, DropdownTrigger, DropdownOption } from "./dropdown-menu";
import { ToggleButton, ToggleButtonCheckbox } from "./toggle-button";
import { RangeSlider, RangeSliderTooltip } from "./range-slider";
import { QuantitySelector } from "./quantity-selector";
import { CopyToClipboard } from "./copy-to-clipboard";
import { SearchInput, SearchDialog, SearchDialogTrigger } from "./search";
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";
import { PaginationNav, PaginationLink } from "./pagination";
import {
  AddressModal,
  AddressAddButton,
  AddressEditButton,
  AddressModalCloseButton,
  AddressModalSubmitButton,
} from "./address-modal";
import {
  AddressRemoveModal,
  AddressRemoveButton,
  AddressRemoveModalCloseButton,
  AddressRemoveModalSubmitButton,
} from "./remove-address-modal";
// filters
import { FilterInputBoolean } from "./filter-input-boolean";
import { FilterInputList } from "./filter-input-list";
import { FilterInputPriceRange } from "./filter-input-price-range";
import { FiltersClear } from "./filters-clear";
// menu
import { MegaMenu } from "./mega-menu";
import { CascadingMenu } from "./cascading-menu";
import { MenuDrawer } from "./menu-drawer";
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
import {
  ProductOptionGiftcard,
  GiftcardSend,
  GiftcardSendEmail,
  GiftcardSendNote,
  GiftcardSendNoteCount,
} from "./product-option-giftcard";
import { ProductPurchaseOptions } from "./product-purchase-options";
import { ProductPurchaseOptionStandard } from "./product-purchase-option-standard";
import { ProductPurchaseOptionSubscription } from "./product-purchase-option-subscription";
import { ProductSection } from "./product-section";
// product list
import { ProductListSection } from "./product-list-section";
import { ProductSort } from "./product-sort";
import { ProductFilters } from "./product-filters";
import { ProductFilterSidebar } from "./product-filter-sidebar";
import { ProductFilterDrawer } from "./product-filter-drawer";
import { ProductFilterToggle } from "./product-filter-toggle";
// account
import { AccountNav, AccountNavDrawer, AccountNavTrigger } from "./account-nav";
import { AccountDetails } from "./account-details";
import {
  AccountSubscriptionModal,
  AccountSubscriptionModalCloseButton,
  AccountSubscriptionModalSubmitButton,
  AccountSubscriptionActionButton,
} from "./account-subscription-modal";
import { AccountLogin } from "./account-login";
import { AccountResetPassword } from "./account-reset-password";
import { AccountRegister } from "./account-register";
import { AccountRecover } from "./account-recover";

// Import vendor libraries
import { loadIonIcons } from "./vendor";
// Import modules
import "./swiper-element-bundle";
import "./slideshow-navigation";
import "./htmx.min";

// Make hoverintent available globally
window.hoverintent = hoverintent;

// Initialize before IIFE to ensure global availability
window.theme = window.theme || {};
window.theme.slideshow_rendered = true;
window.theme.slideshow_navigation = true;
window.theme.accordion_rendered = true;

(function () {
  function defineCustomElements() {
    // components
    customElements.define("backdrop-root", Backdrop);
    customElements.define("radio-button", RadioButton);
    customElements.define("radio-option", RadioOption);
    customElements.define("dropdown-menu", DropdownMenu);
    customElements.define("dropdown-trigger", DropdownTrigger);
    customElements.define("dropdown-option", DropdownOption);
    customElements.define("toggle-button", ToggleButton);
    customElements.define("toggle-button-checkbox", ToggleButtonCheckbox);
    customElements.define("range-slider", RangeSlider);
    customElements.define("range-slider-tooltip", RangeSliderTooltip);
    customElements.define("quantity-selector", QuantitySelector);
    customElements.define("copy-to-clipboard", CopyToClipboard);
    customElements.define("search-input", SearchInput, { extends: "input" });
    customElements.define("search-dialog", SearchDialog);
    customElements.define("search-dialog-trigger", SearchDialogTrigger);
    customElements.define("accordion-root", AccordionRoot);
    customElements.define("accordion-item", AccordionItem);
    customElements.define("accordion-trigger", AccordionTrigger);
    customElements.define("accordion-content", AccordionContent);
    customElements.define("pagination-nav", PaginationNav);
    customElements.define("pagination-link", PaginationLink);
    customElements.define("address-modal", AddressModal);
    customElements.define("address-add-button", AddressAddButton);
    customElements.define("address-edit-button", AddressEditButton);
    customElements.define(
      "address-modal-close-button",
      AddressModalCloseButton
    );
    customElements.define(
      "address-modal-submit-button",
      AddressModalSubmitButton
    );
    customElements.define("address-remove-modal", AddressRemoveModal);
    customElements.define("address-remove-button", AddressRemoveButton);
    customElements.define(
      "address-remove-modal-close-button",
      AddressRemoveModalCloseButton
    );
    customElements.define(
      "address-remove-modal-submit-button",
      AddressRemoveModalSubmitButton
    );

    // filters
    customElements.define("filter-input-boolean", FilterInputBoolean);
    customElements.define("filter-input-list", FilterInputList);
    customElements.define("filter-input-price-range", FilterInputPriceRange);
    customElements.define("filters-clear", FiltersClear);

    // menu
    customElements.define("mega-menu-root", MegaMenu);
    customElements.define("cascading-menu-root", CascadingMenu);
    customElements.define("menu-drawer", MenuDrawer);

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
    customElements.define("product-option-giftcard", ProductOptionGiftcard);
    customElements.define("giftcard-send", GiftcardSend);
    customElements.define("giftcard-send-email", GiftcardSendEmail);
    customElements.define("giftcard-send-note", GiftcardSendNote);
    customElements.define("giftcard-send-note-count", GiftcardSendNoteCount);
    customElements.define("product-purchase-options", ProductPurchaseOptions);
    customElements.define(
      "product-purchase-option-standard",
      ProductPurchaseOptionStandard
    );
    customElements.define(
      "product-purchase-option-subscription",
      ProductPurchaseOptionSubscription
    );

    // product list
    customElements.define("product-list-section", ProductListSection);
    customElements.define("product-sort", ProductSort);
    customElements.define("product-filters", ProductFilters);
    customElements.define("product-filter-sidebar", ProductFilterSidebar);
    customElements.define("product-filter-drawer", ProductFilterDrawer);
    customElements.define("product-filter-toggle", ProductFilterToggle);

    // account
    customElements.define("account-nav", AccountNav);
    customElements.define("account-nav-drawer", AccountNavDrawer);
    customElements.define("account-nav-trigger", AccountNavTrigger);
    customElements.define("account-details", AccountDetails);
    customElements.define(
      "account-subscription-modal",
      AccountSubscriptionModal
    );
    customElements.define(
      "account-subscription-modal-close-button",
      AccountSubscriptionModalCloseButton
    );
    customElements.define(
      "account-subscription-modal-submit-button",
      AccountSubscriptionModalSubmitButton
    );
    customElements.define(
      "account-subscription-action-button",
      AccountSubscriptionActionButton
    );
    customElements.define("account-login", AccountLogin);
    customElements.define("account-reset-password", AccountResetPassword);
    customElements.define("account-register", AccountRegister);
    customElements.define("account-recover", AccountRecover);
  }

  // Call functions
  defineCustomElements();

  // Load IonIcons
  loadIonIcons();
})();
