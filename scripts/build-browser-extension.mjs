import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const output = new URL("dist/pierre-github-icons/", root);
const icons = new URL("icons/", root);

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, root), "utf8"));
}

const [{ iconDefinitions, light: _light, ...theme }, { version }, manifest] = await Promise.all([
  readJson("icons/theme-complete.json"),
  readJson("package.json"),
  readJson("browser/manifest.json"),
]);

async function svgUrl(definition) {
  const svg = await readFile(new URL(definition.iconPath, icons));
  return `url("data:image/svg+xml;base64,${svg.toString("base64")}")`;
}

const css = await Promise.all(
  Object.entries(iconDefinitions)
    .filter(([name]) => !name.endsWith("_light"))
    .map(async ([name, dark]) => {
      const [darkUrl, lightUrl] = await Promise.all([
        svgUrl(dark),
        svgUrl(iconDefinitions[`${name}_light`]),
      ]);
      return (
        `[data-pierre-file-icon="${name}"] {\n` +
        `  --pierre-icon-dark: ${darkUrl};\n` +
        `  --pierre-icon-light: ${lightUrl};\n` +
        "}\n"
      );
    }),
);

await mkdir(output, { recursive: true });
await Promise.all([
  writeFile(new URL("icons.css", output), css.join("\n")),
  writeFile(new URL("theme.js", output), `const pierreCompleteTheme = ${JSON.stringify(theme)};\n`),
  writeFile(
    new URL("manifest.json", output),
    `${JSON.stringify({ ...manifest, version }, null, 2)}\n`,
  ),
  copyFile(new URL("icon.png", root), new URL("icon.png", output)),
  copyFile(new URL("LICENSE.md", root), new URL("LICENSE.md", output)),
  ...["github.js", "github.css"].map((file) =>
    copyFile(new URL(`browser/${file}`, root), new URL(file, output)),
  ),
]);
console.log("Wrote dist/pierre-github-icons/");
