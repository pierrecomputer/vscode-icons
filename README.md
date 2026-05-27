# Pierre Icons

File icon theme for VS Code-compatible editors and Zed with three tiers and per-icon palette colors.

## Themes

The extension ships three icon themes, each building on the last:

- **Pierre Icons (Minimal)** -- file, folder, text, and image icons only. Monochrome.
- **Pierre Icons** -- adds language icons (JS, TS, CSS, HTML, Python, Go, Rust, Ruby, Swift, Bash, Markdown) plus font, SVG, JSON, and git. Monochrome.
- **Pierre Icons (Complete)** -- adds framework, tooling, and config icons (React, Vue, Svelte, Astro, Docker, Tailwind, ESLint, Prettier, npm, Vite, webpack, and more). Uses per-icon colors from the [Pierre palette](https://github.com/pierrecomputer/theme).

## Color system

Colors come from the Pierre palette, using level `400` for dark themes and `600` for light themes -- the same scale used for syntax tokens in the [Pierre color theme](https://github.com/pierrecomputer/theme).

Minimal and default tiers are monochrome (gray `400` / `800`). The complete tier applies per-icon colors, with two modes:

- **Single color** (`color(hue)`) -- one palette hue for all paths. Duo-tone icons get visual weight from the `opacity` attribute baked into the SVG's background path.
- **Dual color** (`duoColor(fg, bg)`) -- separate palette hues for foreground and background paths. Requires SVG paths to have `class="fg"` and `class="bg"` attributes (set in Figma). The build injects a `<style>` block to override bg fills via CSS.

## Build

```bash
npm run build
```

This reads source SVGs from `svgs/`, optimizes them with SVGO, stamps dark/light fill colors, and writes the output to `icons/`. Three VS Code theme JSON files are generated: `theme-minimal.json`, `theme-default.json`, and `theme-complete.json`. The build also writes Zed icon theme JSON files to `icon_themes/`.

For development, watch mode rebuilds on SVG changes:

```bash
npm run watch
```

## Load locally

### Run from source (VS Code)

1. Open this folder in VS Code.
2. Run `npm run build`.
3. Press `F5` to launch an Extension Development Host.
4. Choose one of the Pierre Icons themes from **File Icon Theme**.

### Run from source (Zed)

1. Run `npm ci` if dependencies are not installed.
2. Run `npm run build`.
3. In Zed, run `zed: install dev extension`.
4. Select this repository folder.
5. Choose one of the Pierre Icons themes from the Icon Theme Selector.

### Package a VSIX

```bash
npm run package
```

Then install the generated `.vsix` in VS Code or Cursor.

## Adding icons

1. Add or update SVGs in `svgs/`. For duo-tone icons, use `class="bg"` and `class="fg"` on paths.
2. Add an entry to the appropriate tier array in `scripts/build-icon-theme.mjs`:

```js
// Single color
{ name: "react", color: color(palette.cyan), fileExtensions: ["jsx", "tsx"] }

// Dual color (fg + bg)
{ name: "lang-python", color: duoColor(palette.blue, palette.yellow), fileExtensions: ["py"] }

// Monochrome (no color property)
{ name: "font", fileExtensions: ["ttf", "otf", "woff", "woff2"] }
```

3. Run `npm run build`.
