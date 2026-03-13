import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";
import { SVGOConfig } from "../svgo.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const iconOutputDir = path.join(rootDir, "icons");
const svgDir = path.join(rootDir, "svgs");

// ---------------------------------------------------------------------------
// Monochrome fill colors
// ---------------------------------------------------------------------------

const fill = { dark: "#adadb1", light: "#6C6C71" };

// ---------------------------------------------------------------------------
// Icon tiers
// ---------------------------------------------------------------------------

const minimal = [
  { name: "file-duo" },
  { name: "folder-duo" },
  { name: "folder-open-duo" },
];

const defaults = [
  // phase 2
];

const complete = [
  // phase 3
];

const tiers = {
  minimal,
  default: [...minimal, ...defaults],
  complete: [...minimal, ...defaults, ...complete],
};

// ---------------------------------------------------------------------------
// SVG generation — read source, optimize, stamp dark/light fills
// ---------------------------------------------------------------------------

async function generateSvgPair(name) {
  const srcPath = path.join(svgDir, `${name}.svg`);
  const raw = await readFile(srcPath, "utf8");
  const optimized = optimize(raw, SVGOConfig).data;

  const darkSvg = optimized.replaceAll("currentColor", fill.dark);
  const lightSvg = optimized.replaceAll("currentColor", fill.light);

  await writeFile(path.join(iconOutputDir, `${name}.svg`), darkSvg);
  await writeFile(path.join(iconOutputDir, `${name}-light.svg`), lightSvg);
}

// ---------------------------------------------------------------------------
// Theme builders
// ---------------------------------------------------------------------------

function buildMinimalTheme(icons) {
  const iconDefinitions = {};
  for (const { name } of icons) {
    iconDefinitions[name] = { iconPath: `./${name}.svg` };
    iconDefinitions[`${name}_light`] = { iconPath: `./${name}-light.svg` };
  }

  return {
    iconDefinitions,
    file: "file-duo",
    folder: "folder-duo",
    folderExpanded: "folder-open-duo",
    light: {
      file: "file-duo_light",
      folder: "folder-duo_light",
      folderExpanded: "folder-open-duo_light",
    },
  };
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

await mkdir(iconOutputDir, { recursive: true });

const allIcons = new Map();
for (const icons of Object.values(tiers)) {
  for (const icon of icons) {
    allIcons.set(icon.name, icon);
  }
}
await Promise.all([...allIcons.keys()].map(generateSvgPair));

const minimalTheme = buildMinimalTheme(tiers.minimal);
const minimalOutput = path.join(iconOutputDir, "theme-minimal.json");
await writeFile(minimalOutput, `${JSON.stringify(minimalTheme, null, 2)}\n`);
console.log(`Wrote ${path.relative(rootDir, minimalOutput)}`);
