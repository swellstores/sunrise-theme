# Theme ✨

## Documentation

Visit [https://acmecorp.com/docs](https://acmecorp.com/docs) to view the full documentation.

## Getting started

```bash
npm install
```

To launch the development server for the first time you will need to update the `STORE_URL` in `.env.local` to your own store url.

## Development

```bash
npm run watch
```

The watch command will launch two development servers. The first a shopify development server and the second a custom rollup server for bundling your js and Tailwind css.

## Structure

```shell
├── theme/
│   ├── assets
│   ├── config
│   ├── layout
│   ├── locales
│   ├── sections
│   ├── snippets
│   ├── templates
├── src/ # CSS and JS entry points to be bundled and moved to the /theme/assets folder
│   ├── css/
│   │   └── main.css
│   └── js/
│       └── main.js
├── rollup.config.js
├── tailwind.config.js
└── package.json
```

## Component Stacking (z-index)

| Section                    | Component                  | z-index       |
|----------------------------|----------------------------|---------------|
| `featured-content.liquid`  |                            | `z-10`        |
|                            | `<slideshow-button-prev>`  | `z-10`        |
|                            | `<slideshow-button-next>`  | `z-10`        |
| `testimonials.liquid`      |                            | `z-10`        |
| `header`                   | `<header-search />`        | `z-index: 50` |
|                            | `<header />`               | `z-index: 60` |
| `cart-drawer`              | `<cart-drawer />`          | `z-index: 60` |

## Patterns

### CSS (Tailwind)

We use Tailwind for styling please refer to Tailwinds [documentation](https://tailwindcss.com/docs/installation) for more.

### JS

IIFE: Wrap all JavaScript code not imported in `src/main.js` in an Immediately Invoked Function Expression (IIFE) `(() => { ... })();`. This ensures a local scope and prevents global variable conflicts.

We use custom elements by creating classes that extend HTMLElement for JS and HTML interactions.

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

## Deps

- Slideshow - [Swiper](https://github.com/nolimits4web/swiper)
- Megamenu, Copy-to-Clipboard, Dropdown, Select - [Floating UI](https://github.com/floating-ui/floating-ui)
- Icons - [Ionic Icons](https://ionic.io/ionicons)

## Contributing

Contributions to theme are welcome and highly appreciated. However, before you jump right into it, we would like you to review our [Contribution Guidelines](.github/CONTRIBUTING.md) to make sure you have a smooth experience contributing to theme.

## Authors

A list of the original co-authors that helped bring this theme to life.

- [Thomas Taylor](@thmsmtylr)

## License

Copyright (c) 2024-present Acmecorp.
