import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";
import { SVGOConfig } from "../svgo.config.js";
import { fill } from "./palette.mjs";
import minimal from "./themes/minimal.mjs";
import defaults from "./themes/default.mjs";
import complete from "./themes/complete.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const iconOutputDir = path.join(rootDir, "icons");
const svgDir = path.join(rootDir, "svgs");

const tiers = {
  minimal,
  default: [...minimal, ...defaults],
  complete: [...minimal, ...defaults, ...complete],
};

// ---------------------------------------------------------------------------
// SVG generation — read source, optimize, stamp dark/light fills
// ---------------------------------------------------------------------------

function applyOpacity(svg, opacity) {
  if (!opacity || opacity === 1) return svg;
  return svg.replace("<svg", `<svg opacity="${opacity}"`);
}

function applyBgStyle(svg, bgColor) {
  return svg.replace(">", `><style>.bg{fill:${bgColor}}</style>`);
}

function optimizeSvg(raw) {
  return optimize(raw, SVGOConfig).data;
}

async function generateSvgPair(name, { opacity } = {}) {
  const srcPath = path.join(svgDir, `${name}.svg`);
  const raw = await readFile(srcPath, "utf8");
  const optimized = optimizeSvg(raw);

  const darkSvg = applyOpacity(optimized.replaceAll("currentColor", fill.dark), opacity);
  const lightSvg = applyOpacity(optimized.replaceAll("currentColor", fill.light), opacity);

  await writeFile(path.join(iconOutputDir, `${name}.svg`), darkSvg);
  await writeFile(path.join(iconOutputDir, `${name}-light.svg`), lightSvg);
}

async function generateColoredSvg(name, iconColor, { opacity } = {}) {
  const srcPath = path.join(svgDir, `${name}.svg`);
  const raw = await readFile(srcPath, "utf8");
  const optimized = optimizeSvg(raw);

  let darkSvg, lightSvg;

  if (iconColor.fg) {
    darkSvg = applyBgStyle(
      optimized.replaceAll("currentColor", iconColor.fg.dark),
      iconColor.bg.dark,
    );
    lightSvg = applyBgStyle(
      optimized.replaceAll("currentColor", iconColor.fg.light),
      iconColor.bg.light,
    );
  } else {
    darkSvg = optimized.replaceAll("currentColor", iconColor.dark);
    lightSvg = optimized.replaceAll("currentColor", iconColor.light);
  }

  darkSvg = applyOpacity(darkSvg, opacity);
  lightSvg = applyOpacity(lightSvg, opacity);

  await writeFile(path.join(iconOutputDir, `${name}-color.svg`), darkSvg);
  await writeFile(path.join(iconOutputDir, `${name}-color-light.svg`), lightSvg);
}

// ---------------------------------------------------------------------------
// Theme builders
// ---------------------------------------------------------------------------

function buildTheme(icons, { colored = false } = {}) {
  const iconDefinitions = {};
  const fileExtensions = {};
  const lightFileExtensions = {};
  const fileNames = {};
  const lightFileNames = {};
  const folderNames = {};
  const lightFolderNames = {};
  const folderNamesExpanded = {};
  const lightFolderNamesExpanded = {};

  for (const {
    name,
    color: iconColor,
    fileExtensions: exts,
    fileNames: names,
    folderNames: folders,
  } of icons) {
    const hasColor = colored && iconColor;
    const darkPath = hasColor ? `./${name}-color.svg` : `./${name}.svg`;
    const lightPath = hasColor ? `./${name}-color-light.svg` : `./${name}-light.svg`;
    iconDefinitions[name] = { iconPath: darkPath };
    iconDefinitions[`${name}_light`] = { iconPath: lightPath };

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
    if (folders) {
      for (const fn of folders) {
        folderNames[fn] = name;
        lightFolderNames[fn] = `${name}_light`;
        folderNamesExpanded[fn] = name;
        lightFolderNamesExpanded[fn] = `${name}_light`;
      }
    }
  }

  const hasSymlink = icons.some((i) => i.name === "file-symlink-duo");

  const theme = {
    iconDefinitions,
    file: "file-duo",
    folder: "folder-duo",
    folderExpanded: "folder-open-duo",
    ...(hasSymlink && { fileSymlink: "file-symlink-duo" }),
    fileExtensions,
    light: {
      file: "file-duo_light",
      folder: "folder-duo_light",
      folderExpanded: "folder-open-duo_light",
      ...(hasSymlink && { fileSymlink: "file-symlink-duo_light" }),
      fileExtensions: lightFileExtensions,
    },
  };

  if (Object.keys(fileNames).length > 0) {
    theme.fileNames = fileNames;
    theme.light.fileNames = lightFileNames;
  }

  if (Object.keys(folderNames).length > 0) {
    theme.folderNames = folderNames;
    theme.folderNamesExpanded = folderNamesExpanded;
    theme.light.folderNames = lightFolderNames;
    theme.light.folderNamesExpanded = lightFolderNamesExpanded;
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
await Promise.all(
  [...allIcons.values()].map((i) => generateSvgPair(i.name, { opacity: i.opacity })),
);

const coloredIcons = [...allIcons.values()].filter((i) => i.color);
await Promise.all(
  coloredIcons.map((i) => generateColoredSvg(i.name, i.color, { opacity: i.opacity })),
);

const tierOptions = {
  minimal: { colored: false },
  default: { colored: false },
  complete: { colored: true },
};

for (const [name, icons] of Object.entries(tiers)) {
  const theme = buildTheme(icons, tierOptions[name]);
  const out = path.join(iconOutputDir, `theme-${name}.json`);
  await writeFile(out, `${JSON.stringify(theme, null, 2)}\n`);
  console.log(`Wrote ${path.relative(rootDir, out)}`);
}
