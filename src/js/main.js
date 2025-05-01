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

// Make hoverintent available globally
window.hoverintent = hoverintent;

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

  function loadSlideshowScripts() {
    if (window.theme) {
      function appendScript(src) {
        var script = document.createElement("script");
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
      }

      // Slideshow scripts
      if (window.theme.slideshow_rendered)
        appendScript(window.theme.slideshow_asset_url);
      // Slideshow navigation scripts
      if (window.theme.slideshow_navigation)
        appendScript(window.theme.slideshow_navigation_asset_url);
      // Accordion scripts
      if (window.theme.accordion_rendered)
        appendScript(window.theme.accordion_asset_url);
    }
  }

  // Call functions
  defineCustomElements();
  loadSlideshowScripts();
})();
