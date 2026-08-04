# @k4k3ru/design-system-tokens

Shared design tokens for web applications, provided as CSS custom properties.

Import this package before downstream UI components so they use the same colors,
typography, motion, elevation, and control values.


## Installation

```sh
npm install @k4k3ru/design-system-tokens
```


## Usage

```css
@import "@k4k3ru/design-system-tokens/style.css";
```

The stylesheet can also be imported from JavaScript when supported by your
bundler:

```js
import "@k4k3ru/design-system-tokens/style.css";
```

## Included tokens

- Motion easing, duration, and common transitions
- Elevation shadows
- Typography sizes and line heights
- Control dimensions, spacing, radii, and icon sizes
- Semantic colors for status, surface, content, and outlines

## Themes

Colors follow `prefers-color-scheme` by default. Set `data-theme` on the root
element to explicitly select a theme:

```html
<html data-theme="dark">
```

Supported values are `light` and `dark`.

## License

[MIT](./LICENSE)
