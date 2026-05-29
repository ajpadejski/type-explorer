# Scaffold: Type Explorer — Vite + React → GitHub Pages

## Context

I'm attaching `type-explorer.jsx`. It's a React component built in Claude's artifact sandbox — a browser-based typography testing tool for brand identity work. It loads fonts from three sources (Google Fonts, CSS/URL injection, local file upload) and renders them across four editorial layout contexts (hero, editorial, UI components, print/poster).

The component logic is complete and correct. The task is to scaffold a proper Vite + React project around it that deploys cleanly to GitHub Pages.

---

## Task

Scaffold a minimal Vite + React project using this component as the app root. No router, no backend, no TypeScript — just a clean static build that deploys to GitHub Pages.

---

## Specific requirements

### 1. Project structure

```
type-explorer/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx          ← the attached component goes here, adapted
│   └── index.css        ← CSS variable definitions + reset
├── public/
│   └── favicon.svg      ← simple minimal favicon
└── README.md
```

### 2. CSS variables — critical

The component uses CSS custom properties that were defined by Claude's sandbox environment. You must define them in `src/index.css` on `:root` so the tool chrome renders correctly. Map them as follows:

```css
:root {
  --color-background-primary: #ffffff;
  --color-background-secondary: #f4f4f2;
  --color-background-tertiary: #eeebe4;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #555550;
  --color-text-tertiary: #999992;
  --color-text-success: #2d6a2d;
  --color-text-danger: #c0392b;
  --color-border-tertiary: rgba(0, 0, 0, 0.1);
  --color-border-secondary: rgba(0, 0, 0, 0.2);
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Cascadia Mono', monospace;
  --font-serif: Georgia, 'Times New Roman', serif;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
}
```

Also add a sensible CSS reset and `box-sizing: border-box` globally. Set `body` to use `var(--font-sans)` and `background: var(--color-background-tertiary)`.

### 3. GitHub Pages deployment

The repo name will determine the base path. Configure `vite.config.js` to accept the base path from an environment variable so it works both locally and in CI:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
```

Add a deploy script using `gh-pages`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "VITE_BASE_PATH=/type-explorer/ vite build && gh-pages -d dist"
}
```

Install `gh-pages` as a dev dependency.

### 4. index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Type Explorer</title>
    <meta name="description" content="Browser-based typography testing tool — test fonts across hero, editorial, UI, and print contexts." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 5. Accessibility fixes to make while scaffolding

The component uses `<input type="checkbox">` without `<label>` wrapping — fix those to use proper `<label for>` associations. The file drop zone div should get `role="button"`, `tabIndex={0}`, and keyboard handling (`onKeyDown` for Enter/Space). Font source pill buttons should have `aria-pressed` state.

### 6. Form elements

The component avoids HTML `<form>` tags intentionally (artifact constraint). Keep that — use `onClick`/`onKeyDown` handlers throughout.

### 7. Preserve exactly

- All three font loading functions (`loadGoogleFont`, `loadCSSFont`, `loadFileFont`) — do not refactor
- All four layout context components (`HeroSection`, `EditorialSection`, `UISection`, `PrintSection`) — do not touch
- The `FontInput` component logic
- The `T(dark)` color token function and `ff(name)` helper — these drive the preview content, not the tool chrome

---

## Acceptance criteria

- `npm run dev` opens the app locally with fonts loading correctly
- `npm run build` produces a `dist/` folder with no errors
- `npm run deploy` pushes to `gh-pages` branch (assumes GitHub remote is set)
- The tool chrome renders using the defined CSS variables
- Google Fonts loads in the browser via the dynamic `<link>` injection
- File upload works (FileReader → base64 data URL → `@font-face` injection)
- No TypeScript, no ESLint config required, no testing setup

---

## README should cover

1. What this is (one sentence)
2. `npm install` → `npm run dev`
3. How to deploy: set the correct `VITE_BASE_PATH` for your repo name, then `npm run deploy`
4. Font source notes: Google Fonts by name, CSS/URL for hosted stylesheets, file upload for local/licensed fonts
