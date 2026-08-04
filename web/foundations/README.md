# @k4k3ru/design-system-foundations

Foundation styles for the k4k3ru design system. The package provides a small,
conservative CSS reset and default styles for common HTML elements.

## Installation

```sh
npm install @k4k3ru/design-system-foundations
```

## Usage

Import the reset before the element styles in your application entry point:

```css
@import "@k4k3ru/design-system-foundations/reset.css";
@import "@k4k3ru/design-system-foundations/element.css";
```

The files can also be imported from JavaScript when supported by your bundler:

```js
import "@k4k3ru/design-system-foundations/reset.css";
import "@k4k3ru/design-system-foundations/element.css";
```

## Included styles

- `reset.css` applies `border-box` sizing, removes selected default margins,
  normalizes form typography, makes media responsive, and collapses table
  borders.
- `element.css` defines typography, text and link colors, heading sizes, list
  markers, responsive images, and basic inline element styles.

The reset only removes list styling from `ol` and `ul` elements that have a
class. Unclassed semantic lists retain the markers supplied by `element.css`.

## Customization

Override the package's custom properties to adapt the element styles:

```css
:root {
    --element-color-text: #202124;
    --element-color-link: #0969da;
    --element-font-family: Inter, system-ui, sans-serif;
    --element-body-font-size: 1rem;
    --element-body-line-height: 1.5rem;
}
```

Typography properties also use design-token variables such as
`--typography-body-medium-font-size` and
`--typography-headline-large-font-size` when they are available, with built-in
fallback values otherwise.

Dark mode follows `prefers-color-scheme` by default. Set `data-theme` on the
root element to explicitly select a theme:

```html
<html data-theme="dark">
```

Supported values are `light` and `dark`.

## License

[MIT](./LICENSE)
