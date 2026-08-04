# @k4k3ru/design-system-button

A lightweight, accessible Button component for HTML applications. It provides BEM-based CSS, semantic color variants, responsive theme fallbacks, and an optional TypeScript-powered ripple interaction.

## Installation

```sh
npm install @k4k3ru/design-system-button
```

The shared design tokens are optional. When they are not installed, the Button component uses its own light and dark fallback values.

```sh
npm install @k4k3ru/tokens
```

## Usage

Import the shared tokens first when using them, followed by the Button stylesheet.

```css
@import "@k4k3ru/tokens/dist/style.css";
@import "@k4k3ru/design-system-button/style.css";
```

Create a button using the `.button` block and its elements.

```html
<button class="button button--success button--round" type="button">
  <svg class="button__icon" viewBox="0 0 24 24" aria-hidden="true">
    <!-- icon path -->
  </svg>
  <span class="button__label">Save changes</span>
</button>
```

Initialize the optional ripple interaction once per document.

```ts
import { Button } from "@k4k3ru/design-system-button";

const button = new Button();
button.run();

// Remove the delegated event listener when it is no longer needed.
button.destroy();
```

The CSS can be used without initializing JavaScript. Only the pointer ripple interaction requires JavaScript.

## Modifiers

### Appearance

- `.button--outlined`
- `.button--text`
- `.button--round`

### Size

- `.button--small`
- Default medium size
- `.button--large`

### Semantic color

- `.button--error`
- `.button--info`
- `.button--success`
- `.button--warning`

Modifiers can be combined.

```html
<button class="button button--large button--error button--outlined button--round" type="button">
  <span class="button__label">Delete account</span>
</button>
```

## Button group

Use the standalone `.button-group` block to arrange multiple buttons.

```html
<div class="button-group">
  <button class="button button--text" type="button">
    <span class="button__label">Cancel</span>
  </button>
  <button class="button button--success" type="button">
    <span class="button__label">Save</span>
  </button>
</div>
```

## Disabled state

Use the native `disabled` attribute for `<button>` elements.

```html
<button class="button" disabled type="button">
  <span class="button__label">Unavailable</span>
</button>
```

`aria-disabled="true"` is also styled and excluded from ripple interactions. ARIA does not prevent activation by itself, so applications must suppress activation when it is used on links or other non-button elements.

## Themes

Without shared tokens, the component follows the operating-system color scheme. An explicit theme can be selected on the root HTML element.

```html
<html data-theme="light">
```

```html
<html data-theme="dark">
```

When `@k4k3ru/tokens` is loaded, its color variables take precedence over the built-in fallback palette.

## Customization

Override the public Button custom properties after importing the stylesheet.

```css
:root {
  --button-background: #f1f3f5;
  --button-color-success: #087f5b;
  --button-height-medium: 2.75rem;
  --button-radius-round: 999px;
}
```

Variables prefixed with `--_button-` are internal implementation details and are not part of the public customization API.

## Accessibility

- Prefer the native `<button>` element.
- Set `type="button"` unless the button submits a form.
- Provide visible label text or an accessible name for icon-only buttons.
- Decorative SVG icons should use `aria-hidden="true"`.
- Reduced-motion preferences disable ripple animation.

## Development

From the repository root:

```sh
npm run typecheck
npm run build:button
```

To view the example with a local HTTP server:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/web/components/button/example/`.

## License

[MIT](./LICENSE)
