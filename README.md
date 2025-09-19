# Sunrise

Sunrise is Swell's official default theme for Proxima, featuring comprehensive Shopify compatibility and subscription support. Sunrise provides a complete foundation for building high-converting ecommerce storefronts.

## Features

### Comprehensive theme sections
- **Announcement bar** - Promotional messages and notifications
- **Hero section** - Eye-catching homepage banners
- **Featured products** - Showcase bestsellers and highlights
- **Product slideshow** - Interactive product carousels
- **Newsletter signup** - Email capture and marketing
- **Testimonials** - Social proof and customer reviews
- **FAQ section** - Common questions and answers
- **Image gallery** - Visual storytelling and brand assets
- **Contact forms** - Customer inquiry collection
- **Rich text content** - Flexible content management
- **Video sections** - Multimedia product demonstrations
- **Collection showcase** - Category and product organization
- **Social proof** - Instagram feeds and reviews
- **Custom HTML** - Developer-friendly customization
- **Blog integration** - Content marketing support

### Subscription commerce
- **Subscription products** - Recurring purchase options with flexible billing schedules
- **Subscription management** - Customer portal for managing recurring orders
- **Trial periods** - Free trial support for subscription products
- **Multiple billing frequencies** - Daily, weekly, monthly, and yearly options
- **Subscription upsells** - Cross-selling and upgrade opportunities

### Shopify compatibility
- **Direct template mapping** - Seamless migration from Shopify themes
- **Liquid template support** - Full Swell Liquid implementation with Shopify objects
- **Form compatibility** - Cart, checkout, and contact form equivalents
- **Object structure** - Compatible product, collection, and customer objects
- **Theme settings** - Familiar configuration interface

### Development features
- **Tailwind CSS** - Utility-first styling framework
- **Rollup bundling** - Optimized JavaScript and CSS compilation
- **Custom HTML elements** - Modern web component approach
- **Hot reloading** - Real-time development updates
- **TypeScript support** - Type-safe development environment
- **Responsive design** - Mobile-first responsive layouts

## Getting started

### Prerequisites
- [Swell CLI](https://developers.swell.is/cli) installed globally
- Node.js 18+ and npm
- A Swell store with [Proxima](https://developers.swell.is/storefronts/proxima-app-guide) installed

### Installation

Clone this theme and create your own version:

```bash
# Clone the Sunrise theme
git clone https://github.com/swellstores/sunrise.git my-theme
cd my-theme

# Install dependencies
npm install

# Start development server with bundling
swell theme dev --bundle

# Or start without bundling
swell theme dev
```

### Development workflow

Sunrise uses the Swell CLI for development and deployment:

```bash
# Start local development with hot reloading
swell theme dev --bundle

# Build for production
npm run build

# Deploy to your Swell store
swell theme push

# Pull latest changes from store
swell theme pull
```

### Customization

#### Theme settings
Configure colors, fonts, and layout options in the Swell dashboard under **Storefront > Themes > Customize**.

#### Custom sections
Add new sections by creating files in the `theme/sections/` directory:

```liquid
<!-- theme/sections/my-custom-section.liquid -->
<section class="my-section">
  <h2>{{ section.settings.title }}</h2>
  <p>{{ section.settings.description }}</p>
</section>

{% schema %}
{
  "name": "Custom Section",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Section Title"
    }
  ]
}
{% endschema %}
```

#### Styling with Tailwind
Sunrise uses Tailwind CSS for styling. Add custom styles in `src/styles/`:

```css
/* src/styles/custom.css */
@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded;
  }
}
```

#### JavaScript functionality
Add interactive features using custom HTML elements:

```javascript
// src/components/my-component.js
class MyComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<p>Custom component loaded</p>';
  }
}

customElements.define('my-component', MyComponent);
```

## Project structure

```
sunrise/
├── theme/                  # Liquid templates
│   ├── assets/            # Static assets
│   ├── components/        # Reusable components
│   ├── config/           # Theme configuration
│   ├── layouts/          # Page layouts
│   ├── sections/         # Theme sections
│   └── templates/        # Page templates
├── src/                   # JS and CSS source files
├── rollup.config.js      # Build configuration
├── tailwind.config.js    # Tailwind configuration
└── swell.json           # Theme metadata
```

## Liquid templating

Sunrise uses [Swell Liquid](https://developers.swell.is/storefronts/swell-liquid-reference), an enhanced version of Liquid with additional objects and filters.

### Product templates
```liquid
<!-- Display product with subscription options -->
<div class="product">
  <h1>{{ product.name }}</h1>
  <div class="price">
    {% if product.purchase_options.subscription %}
      <!-- Subscription pricing -->
      {% for plan in product.purchase_options.subscription.plans %}
        <div class="subscription-option">
          {{ plan.name }} - {{ plan.price | money }}
        </div>
      {% endfor %}
    {% endif %}
    
    <!-- Standard pricing -->
    <span class="price">{{ product.price | money }}</span>
  </div>
</div>
```

### Cart functionality
```liquid
<!-- Add to cart with subscription -->
{% form 'cart_add' %}
  <input type="hidden" name="product_id" value="{{ product.id }}">
  
  {% if product.purchase_options.subscription %}
    <select name="purchase_option[plan_id]">
      {% for plan in product.purchase_options.subscription.plans %}
        <option value="{{ plan.id }}">{{ plan.name }}</option>
      {% endfor %}
    </select>
  {% endif %}
  
  <button type="submit">Add to Cart</button>
{% endform %}
```

## Subscription features

Sunrise includes comprehensive subscription commerce capabilities:

### Subscription products
- Multiple billing frequencies (monthly, yearly, etc.)
- Trial periods and introductory pricing
- Pause and skip functionality
- Subscription-only products

### Customer management
- Subscription dashboard in customer accounts
- Billing and shipping address management
- Payment method updates
- Order history and tracking

## Development patterns

### CSS (Tailwind)
We use Tailwind for styling. Refer to [Tailwind's documentation](https://tailwindcss.com/docs/installation) for more details.

### JavaScript
IIFE: Wrap all JavaScript code not imported in `src/main.js` in an Immediately Invoked Function Expression (IIFE) `(() => { ... })();`. This ensures a local scope and prevents global variable conflicts.

We use custom elements by creating classes that extend HTMLElement for JS and HTML interactions:

```js
class Accordion extends HTMLElement {
  constructor() {
    super();
  }
  // Element functionality written in here
}
```

```html
<accordion>
  <!-- Element markup written in here -->
</accordion>
```

## Dependencies

- **Slideshow** - [Swiper](https://github.com/nolimits4web/swiper)
- **Megamenu, Copy-to-Clipboard, Dropdown, Select** - [Floating UI](https://github.com/floating-ui/floating-ui)
- **Icons** - [Ionic Icons](https://ionic.io/ionicons)

## Resources

- [Swell Documentation](https://developers.swell.is/)
- [Swell Liquid Reference](https://developers.swell.is/storefronts/swell-liquid-reference)
- [Proxima Storefront](https://developers.swell.is/storefronts/proxima)
- [Subscription Commerce Guide](https://developers.swell.is/guides/subscription-commerce)
- [Theme Development](https://developers.swell.is/storefronts/themes)
- [Swell CLI Documentation](https://developers.swell.is/cli)

## 📄 License

See the [LICENSE](LICENSE) file for details.