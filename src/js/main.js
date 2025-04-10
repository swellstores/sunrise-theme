import { Cart } from './cart';
import { CartDrawer } from './cart-drawer';
import { SearchDialog } from './search-dialog';
import { MegaMenu } from './mega-menu';
import { VariantRadio } from './variant-radio';
import { Popover } from './popover';
import { CopyToClipboard } from './copy-to-clipboard';
import { QuantitySelector } from './quantity-selector';

// Import vendor libraries
import { loadIonIcons } from './vendor';

// Import all modules that are currently loaded separately
import './swiper-element-bundle';
import './slideshow-navigation';
import './accordion';
import './filter';
import './htmx.min';

// Initialize before IIFE to ensure global availability
window.theme = window.theme || {};
window.theme.slideshow_rendered = true;
window.theme.slideshow_navigation = true;
window.theme.accordion_rendered = true;

(function () {
  // Function to define custom elements
  function defineCustomElements() {
    customElements.define('cart-root', Cart);
    customElements.define('cart-drawer-root', CartDrawer);
    customElements.define('search-dialog-root', SearchDialog);
    customElements.define('mega-menu-root', MegaMenu);
    customElements.define('variant-radio', VariantRadio);
    customElements.define('popover-root', Popover);
    customElements.define('copy-to-clipboard', CopyToClipboard);
    customElements.define('quantity-selector-root', QuantitySelector);
  }

  // Call functions
  defineCustomElements();
  // Load IonIcons
  loadIonIcons();
})();
