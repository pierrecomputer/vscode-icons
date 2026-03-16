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
  { name: "file-text-duo", fileExtensions: [
    "txt", "md", "mdx", "markdown",
    "rst", "rtf",
    "log",
    "csv", "tsv",
    "ini", "cfg", "conf",
    "env", "env.local", "env.development", "env.production",
    "editorconfig",
    "LICENSE", "AUTHORS", "CONTRIBUTORS", "CHANGELOG",
  ]},
  { name: "image", fileExtensions: [
    "png", "jpg", "jpeg", "gif", "svg", "webp", "avif",
    "ico", "icns", "bmp", "tiff", "tif",
  ]},
  { name: "folder-duo" },
  { name: "folder-open-duo" },
];

const defaults = [
  { name: "lang-javascript-duo", fileExtensions: ["js", "cjs", "mjs", "jsx"] },
  { name: "lang-typescript-duo", fileExtensions: ["ts", "cts", "mts", "tsx"] },
  { name: "lang-css-duo", fileExtensions: ["css", "scss", "sass", "less", "postcss", "styl"] },
  { name: "lang-html", fileExtensions: ["html", "htm", "xhtml"] },
  { name: "lang-markdown", fileExtensions: ["md", "mdx", "markdown"] },
  { name: "lang-swift", fileExtensions: ["swift"] },
  { name: "lang-rust", fileExtensions: ["rs"] },
  { name: "lang-go", fileExtensions: ["go"] },
  { name: "lang-python", fileExtensions: ["py", "pyw", "pyi", "pyx"] },
  { name: "lang-ruby", fileExtensions: ["rb", "erb", "gemspec", "rake"],
    fileNames: ["Gemfile", "Rakefile"] },
  { name: "font", fileExtensions: ["ttf", "otf", "woff", "woff2", "eot"] },
  { name: "bash-duo", fileExtensions: ["sh", "bash", "zsh", "fish", "ksh", "csh"],
    fileNames: [".bashrc", ".bash_profile", ".zshrc", ".zshenv", ".zprofile"] },
  { name: "svg-2", fileExtensions: ["svg"] },
  { name: "braces", fileExtensions: ["json", "jsonc", "json5", "jsonl"] },
  { name: "git", fileNames: [".gitignore", ".gitattributes", ".gitmodules", ".gitkeep"] },
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

function buildTheme(icons) {
  const iconDefinitions = {};
  const fileExtensions = {};
  const lightFileExtensions = {};
  const fileNames = {};
  const lightFileNames = {};

  for (const { name, fileExtensions: exts, fileNames: names } of icons) {
    iconDefinitions[name] = { iconPath: `./${name}.svg` };
    iconDefinitions[`${name}_light`] = { iconPath: `./${name}-light.svg` };

    if (exts) {
      for (const ext of exts) {
        fileExtensions[ext] = name;
        lightFileExtensions[ext] = `${name}_light`;
      }
    }
    if (names) {
      for (const fn of names) {
        fileNames[fn] = name;
        lightFileNames[fn] = `${name}_light`;
      }
    }
  }

  const theme = {
    iconDefinitions,
    file: "file-duo",
    folder: "folder-duo",
    folderExpanded: "folder-open-duo",
    fileExtensions,
    light: {
      file: "file-duo_light",
      folder: "folder-duo_light",
      folderExpanded: "folder-open-duo_light",
      fileExtensions: lightFileExtensions,
    },
  };

  if (Object.keys(fileNames).length > 0) {
    theme.fileNames = fileNames;
    theme.light.fileNames = lightFileNames;
  }

  return theme;
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

const minimalTheme = buildTheme(tiers.minimal);
const minimalOutput = path.join(iconOutputDir, "theme-minimal.json");
await writeFile(minimalOutput, `${JSON.stringify(minimalTheme, null, 2)}\n`);
console.log(`Wrote ${path.relative(rootDir, minimalOutput)}`);

const defaultTheme = buildTheme(tiers.default);
const defaultOutput = path.join(iconOutputDir, "theme-default.json");
await writeFile(defaultOutput, `${JSON.stringify(defaultTheme, null, 2)}\n`);
console.log(`Wrote ${path.relative(rootDir, defaultOutput)}`);
