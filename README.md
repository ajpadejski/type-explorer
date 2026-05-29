# Type Explorer

A browser-based typography testing tool — load fonts and preview them across hero, editorial, UI, and print layout contexts.

## Getting started

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

Set `VITE_BASE_PATH` to match your repo name, then run the deploy script:

```bash
npm run deploy
```

The default deploy script uses `/type-explorer/` as the base path. If your repo has a different name, update the `deploy` script in `package.json`:

```json
"deploy": "VITE_BASE_PATH=/your-repo-name/ vite build && gh-pages -d dist"
```

This requires a GitHub remote to be configured (`git remote add origin https://github.com/you/your-repo`).

## Font sources

- **Google Fonts** — enter the font family name exactly as it appears on fonts.google.com (e.g. `Fraunces`, `IBM Plex Sans`)
- **CSS / URL** — paste a `<link>` tag, `@import` statement, or raw stylesheet URL from any font host, then provide the `font-family` name as declared in that stylesheet
- **File upload** — drag or select a `.ttf`, `.woff2`, `.woff`, or `.otf` file from your local machine; give it a name to reference it in the preview
