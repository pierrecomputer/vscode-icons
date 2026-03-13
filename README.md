# Peti VS Code Icons

Minimal starter file icon theme for VS Code.

## What it does

- Uses the built-in VS Code Seti icon theme as the base and overlays your custom SVGs
- Sources custom icons from `svgs/`
- Ships starter mappings for:
  - `package.json`, `.npmrc`, `package-lock.json`, `npm-shrinkwrap.json` -> `svgs/npm.svg`
  - `*.js`, `*.cjs`, `*.mjs` -> `svgs/javascript.svg`
  - `*.css`, `*.module.css`, `*.scss`, `*.sass`, `*.less`, `*.postcss` and related CSS-family language modes -> `svgs/css.svg`

## Build

```bash
npm run build
```

This generates `icons/theme.json` and copies the required Seti font into `icons/seti.woff`.

By default the build reads Seti from `/Applications/Visual Studio Code.app`. If your VS Code app is elsewhere, set `VSCODE_APP_PATH` when building:

```bash
VSCODE_APP_PATH="/path/to/Visual Studio Code.app" npm run build
```

## Load locally in VS Code or Cursor

### Option 1: Run as an extension from source in vanilla VS Code

1. Open this folder in VS Code.
2. Run `npm run build`.
3. Press `F5` to launch an Extension Development Host.
4. In the new window, choose `Peti Icons` from `File Icon Theme`.

The extension is active in the Extension Development Host window, not the original workspace window.

### Option 2: Install locally into Cursor

```bash
npm run install:cursor
```

Then:

1. Reload Cursor.
2. Open `Preferences: File Icon Theme`.
3. Select `Peti Icons`.

### Option 3: Package a VSIX

```bash
npx @vscode/vsce package
```

Then install the generated `.vsix` in VS Code.

## Customize

Replace the SVG files in `svgs/` and extend `scripts/build-icon-theme.mjs` with more filename or extension mappings, then rebuild.
