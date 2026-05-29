# Type Explorer

A browser-based typography testing tool for brand identity work. Load fonts from multiple sources and preview them live across four editorial layout contexts — hero, article, UI components, and print/poster — using a fictional cultural magazine as the specimen content.

Built with Vite + React, deployable to GitHub Pages as a static site.

## Features

- **Three font loading methods** — Google Fonts by name, any hosted stylesheet via `<link>` tag / `@import` / URL, or local file upload (`.ttf`, `.woff2`, `.woff`, `.otf`) via FileReader
- **Pairing mode** — set a separate display and body font to evaluate type pairings side by side
- **Four preview contexts** — Hero (masthead + feature cards), Editorial (long-form article), UI (nav, buttons, tags, cards, type scale), Print/Poster (magazine cover + event poster + glyph specimen)
- **Dark preview** — toggle all contexts to a dark-background palette
- **Font history** — quick-recall of the last 8 fonts or pairings loaded in the session
- **Copy combo** — copies the active font name (or `Display / Body` pairing string) to the clipboard

## Getting started

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

```bash
npm run deploy
```

The deploy script builds with `VITE_BASE_PATH=/type-explorer/` and pushes `dist/` to the `gh-pages` branch. If your repo has a different name, update the script in `package.json`:

```json
"deploy": "VITE_BASE_PATH=/your-repo-name/ vite build && gh-pages -d dist"
```

Requires a GitHub remote: `git remote add origin https://github.com/you/your-repo`.

## Font source notes

- **Google Fonts** — enter the family name exactly as on fonts.google.com (e.g. `Fraunces`, `IBM Plex Sans`). Weights 300–800 and italics are loaded automatically.
- **CSS / URL** — paste a `<link>` tag, `@import`, or raw URL from any font service (Typographer, Adobe Fonts, etc.), then enter the `font-family` name as declared in that stylesheet. Multi-tag embed snippets with preconnect hints are handled correctly.
- **File upload** — drag or select a font file; give it a name and it's injected via `@font-face` as a base64 data URL. No CDN required — works for locally licensed or downloaded fonts.
