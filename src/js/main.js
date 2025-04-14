import { Header } from "./header";
import { Cart } from "./cart";
import { CartDrawer } from "./cart-drawer";
import { SearchDialog } from "./search-dialog";
import { MegaMenu } from "./mega-menu";
import { VariantRadio } from "./variant-radio";
import { Popover } from "./popover";
import { CopyToClipboard } from "./copy-to-clipboard";
import { QuantitySelector } from "./quantity-selector";

(function () {
  function defineCustomElements() {
    customElements.define("cart-root", Cart);
    customElements.define("cart-drawer-root", CartDrawer);
    customElements.define("search-dialog-root", SearchDialog);
    customElements.define("mega-menu-root", MegaMenu);
    customElements.define("standard-dropdown-root", StandardDropdown);
    customElements.define("variant-radio", VariantRadio);
    customElements.define("popover-root", Popover);
    customElements.define("copy-to-clipboard", CopyToClipboard);
    customElements.define("quantity-selector-root", QuantitySelector);
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
