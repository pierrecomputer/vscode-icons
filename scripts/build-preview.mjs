import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const iconDir = path.join(rootDir, "icons");
const previewDir = path.join(rootDir, "preview");

const themes = [
  { id: "minimal", name: "Minimal" },
  { id: "default", name: "Default" },
  { id: "complete", name: "Complete" },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function readTheme({ id, name }) {
  const theme = JSON.parse(await readFile(path.join(iconDir, `theme-${id}.json`), "utf8"));
  const icons = [];

  for (const [iconName, definition] of Object.entries(theme.iconDefinitions)) {
    if (iconName.endsWith("_light")) continue;

    icons.push({
      name: iconName,
      file: path.basename(definition.iconPath),
    });
  }

  return { id, name, icons };
}

function renderIcon(icon) {
  return `
    <li class="icon-row">
      <img src="../icons/${escapeHtml(icon.file)}" alt="" />
      <span>${escapeHtml(icon.name)}</span>
    </li>`;
}

function renderTheme(theme) {
  return `
    <section class="theme-column" id="${theme.id}">
      <header>
        <h2>${theme.name}</h2>
        <span>${theme.icons.length}</span>
      </header>
      <ul>${theme.icons.map(renderIcon).join("")}</ul>
    </section>`;
}

const builtThemes = await Promise.all(themes.map(readTheme));

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pierre Icon Theme Preview</title>
    <style>
      :root {
        color-scheme: dark;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #18181b;
        color: #cccccc;
        font-synthesis: none;
      }
      * { box-sizing: border-box; }
      body {
        min-width: 720px;
        margin: 0;
        background: #18181b;
      }
      main {
        display: grid;
        grid-template-columns: repeat(3, minmax(240px, 1fr));
        min-height: 100vh;
      }
      .theme-column {
        min-width: 0;
        border-right: 1px solid #2b2b2f;
      }
      .theme-column:last-child {
        border-right: 0;
      }
      .theme-column > header {
        position: sticky;
        top: 0;
        display: flex;
        z-index: 1;
        height: 35px;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        background: #1f1f22;
        border-bottom: 1px solid #2b2b2f;
      }
      h2 {
        margin: 0;
        color: #e7e7e8;
        font-size: 12px;
        font-weight: 600;
      }
      header span {
        color: #79797f;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 10px;
      }
      ul {
        margin: 0;
        padding: 4px 0;
        list-style: none;
      }
      .icon-row {
        display: flex;
        height: 28px;
        gap: 8px;
        align-items: center;
        padding: 0 12px;
        font-size: 12px;
        white-space: nowrap;
      }
      .icon-row:hover {
        background: #242428;
        color: #ffffff;
      }
      .icon-row img {
        width: 16px;
        height: 16px;
        flex: none;
      }
      .icon-row span {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    </style>
  </head>
  <body>
    <main>${builtThemes.map(renderTheme).join("")}</main>
  </body>
</html>
`;

await mkdir(previewDir, { recursive: true });
const outputPath = path.join(previewDir, "index.html");
await writeFile(outputPath, html);
console.log(`Wrote ${path.relative(rootDir, outputPath)}`);
