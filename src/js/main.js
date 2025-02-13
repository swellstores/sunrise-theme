// @ts-nocheck

import { Cart } from './cart.js';
import { CartDrawer } from './cart-drawer';
import { SearchDialog } from './search-dialog.js';
import { DropdownMenu } from './dropdown-menu';
import { MegaMenu } from './mega-menu';
import { Modal } from './modal';
import { VariantRadio } from './variant-radio';
import { Popover } from './popover';
import { CopyToClipboard } from './copy-to-clipboard';
import { QuantitySelector } from './quantity-selector.js';

(function () {
  // Function to define custom elements
  function defineCustomElements() {
    customElements.define('cart-root', Cart);
    customElements.define('cart-drawer-root', CartDrawer);
    // customElements.define('dropdown', Dropdown);
    customElements.define('search-dialog-root', SearchDialog);
    customElements.define('mega-menu', MegaMenu);
    // customElements.define('modal', Modal);
    customElements.define('variant-radio', VariantRadio);
    customElements.define('popover-root', Popover);
    customElements.define('copy-to-clipboard', CopyToClipboard);
    customElements.define('quantity-selector-root', QuantitySelector);
  }

  function loadSlideshowScripts() {
    if (window.theme) {
      function appendScript(src) {
        var script = document.createElement('script');
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
      }

      // Slideshow scripts
      if (window.theme.slideshow_rendered) appendScript(window.theme.slideshow_asset_url);
      // Slidehow navigation scripts
      if (window.theme.slideshow_navigation) appendScript(window.theme.slideshow_navigation_asset_url);
      // Accordion scripts
      if (window.theme.accordion_rendered) appendScript(window.theme.accordion_asset_url);
    }
  }

  // Call functions
  defineCustomElements();
  loadSlideshowScripts();
})();
