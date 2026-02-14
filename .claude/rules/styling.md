---
paths:
  - "src/**/*.vue"
  - "src/**/*.css"
  - "src/theme/**/*.ts"
---

# Styling Architecture

Three layers - never add a fourth (no Tailwind, no CSS modules, no CSS-in-JS):

1. **`src/theme/preset.ts`** - PrimeVue design tokens (colors, radius, shadows). All PrimeVue components (Button, Card, DataTable, etc.) auto-theme from this. Edit here to change brand colors, border-radius, or component-level token overrides.
2. **`src/assets/main.css`** - Global base styles and app-specific CSS custom properties. Covers typography (h1-h6), base elements (links, hr, code), focus rings, scrollbars, and `--app-*` tokens (spacing, shadows, transitions).
3. **Scoped `<style>`** - Component-specific layout only (grids, positioning, flex). Never redefine typography, colors, or spacing here - use the global tokens instead.

## Rules

- Use `var(--p-*)` for PrimeVue tokens (colors, surfaces, primary) and `var(--app-*)` for app tokens (spacing, shadows, transitions)
- Use `--app-space-*` tokens for spacing that maps cleanly (0.25, 0.5, 1, 1.5, 2, 3rem). Fine-grained component-internal micro-spacing (icon gaps, badge padding, element sizing) can use literal values when no token fits
- Use `--app-transition-*` tokens for transition durations. Custom easing curves (cubic-bezier) for physical motion like sidebar slide/collapse are fine
- Headings (h1-h6) are globally styled - don't set font-size/weight/color in scoped styles unless intentionally overriding (e.g. 404 display text)
- PrimeVue components handle their own theming - don't override PrimeVue classes with scoped CSS
- No `font-weight: 900` anywhere - max weight is 700
- `app.css` in project root is a reference file only - it is NOT imported or used

## App tokens

```css
/* Spacing */
--app-space-xs: 0.25rem    --app-space-sm: 0.5rem
--app-space-md: 1rem        --app-space-lg: 1.5rem
--app-space-xl: 2rem        --app-space-2xl: 3rem

/* Shadows */
--app-shadow-sm / --app-shadow-md / --app-shadow-lg

/* Transitions */
--app-transition-fast: 0.15s    --app-transition-base: 0.2s    --app-transition-slow: 0.3s

/* Layout */
--app-content-padding: 1.5rem (1rem on mobile)
```
