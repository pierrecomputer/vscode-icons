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
// Colors — Pierre palette (400 for dark, 600 for light)
// ---------------------------------------------------------------------------

const palette = {
  gray:   { 400: "#adadb1", 500: "#8E8E95", 600: "#84848A", 700: "#79797F", 800: "#6C6C71" },
  red:    { 400: "#ff6762", 600: "#d52c36" },
  orange: { 400: "#ffa359", 600: "#d47628" },
  yellow: { 400: "#ffd452", 600: "#d5a910" },
  green:  { 400: "#5ecc71", 600: "#199f43" },
  mint:   { 400: "#61d5c0", 600: "#16a994" },
  teal:   { 400: "#64d1db", 600: "#17a5af" },
  cyan:   { 400: "#68cdf2", 600: "#1ca1c7" },
  blue:   { 400: "#69b1ff", 600: "#1a85d4" },
  indigo: { 400: "#9d6afb", 600: "#693acf" },
  purple: { 400: "#d568ea", 600: "#a631be" },
  pink:   { 400: "#ff678d", 600: "#d32a61" },
  brown:  { 400: "#c3987b", 600: "#956b4f" },
};

const fill = { dark: palette.gray[400], light: palette.gray[800] };

function color(hue) { return { dark: hue[400], light: hue[600] }; }
function duoColor(fg, bg) { return { fg: color(fg), bg: color(bg) }; }

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
  { name: "image-duo", fileExtensions: [
    "png", "jpg", "jpeg", "gif", "svg", "webp", "avif",
    "ico", "icns", "bmp", "tiff", "tif",
  ]},
  { name: "folder-duo" },
  { name: "folder-open-duo" },
];

const defaults = [
  { name: "lang-javascript-duo", color: color(palette.yellow), fileExtensions: ["js", "cjs", "mjs", "jsx"] },
  { name: "lang-typescript-duo", color: color(palette.cyan), fileExtensions: ["ts", "cts", "mts", "tsx"] },
  { name: "lang-css-duo", color: color(palette.indigo), fileExtensions: ["css", "scss", "sass", "less", "postcss", "styl"] },
  { name: "lang-html-duo", color: color(palette.orange), fileExtensions: ["html", "htm", "xhtml"] },
  { name: "lang-markdown", fileExtensions: ["md", "mdx", "markdown"] },
  { name: "lang-swift", color: color(palette.orange), fileExtensions: ["swift"] },
  { name: "lang-rust", color: color(palette.orange), fileExtensions: ["rs"] },
  { name: "lang-go", color: color(palette.cyan), fileExtensions: ["go"] },
  { name: "lang-python", color: duoColor(palette.blue, palette.yellow), fileExtensions: ["py", "pyw", "pyi", "pyx"] },
  { name: "lang-ruby", color: color(palette.red), fileExtensions: ["rb", "erb", "gemspec", "rake"],
    fileNames: ["Gemfile", "Rakefile"] },
  { name: "font", fileExtensions: ["ttf", "otf", "woff", "woff2", "eot"] },
  { name: "bash-duo", color: color(palette.green), fileExtensions: ["sh", "bash", "zsh", "fish", "ksh", "csh"],
    fileNames: [".bashrc", ".bash_profile", ".zshrc", ".zshenv", ".zprofile"] },
  { name: "svg-2", fileExtensions: ["svg"] },
  { name: "braces", fileExtensions: ["json", "jsonc", "json5", "jsonl"] },
  { name: "git", color: color(palette.orange), fileNames: [".gitignore", ".gitattributes", ".gitmodules", ".gitkeep"] },
];

const complete = [
  // Override duo icons with non-duo variants at reduced opacity
  {
    name: "lang-javascript-duo",
    color: color(palette.yellow),
    // opacity: 0.75,
    fileExtensions: ["js", "cjs", "mjs", "jsx"]
  },
  {
    name: "lang-typescript-duo",
    color: color(palette.blue),
    // opacity: 0.75,
    fileExtensions: ["ts", "cts", "mts", "tsx"]
  },
  {
    name: "lang-css-duo",
    color: color(palette.indigo),
    // opacity: 0.75,
    fileExtensions: ["css", "scss", "sass", "less", "postcss", "styl"]
  },
  {
    name: "bash-duo",
    color: color(palette.gray),
    // opacity: 0.75,
    fileExtensions: ["sh", "bash", "zsh", "fish", "ksh", "csh"],
    fileNames: [".bashrc", ".bash_profile", ".zshrc", ".zshenv", ".zprofile"]
  },
  { name: "svg-2", color: color(palette.orange), fileExtensions: ["svg"] },

  // Frameworks & libraries
  { name: "astro", color: color(palette.purple), fileExtensions: ["astro"] },
  { name: "bootstrap-duo", color: color(palette.indigo), fileNames: [
    "bootstrap.min.css", "bootstrap.css", "bootstrap.min.js", "bootstrap.js",
    "bootstrap.bundle.min.js", "bootstrap.bundle.js",
  ]},
  { name: "react", color: color(palette.cyan), fileExtensions: ["jsx", "tsx"] },
  { name: "svelte", color: color(palette.red), fileExtensions: ["svelte"] },
  { name: "vue", color: color(palette.green), fileExtensions: ["vue"] },

  // Languages & formats
  { name: "graphql", color: color(palette.pink), fileExtensions: ["graphql", "gql"] },
  { name: "sass", color: color(palette.pink), fileExtensions: ["scss", "sass"] },
  { name: "terraform", color: color(palette.indigo), fileExtensions: ["tf", "tfvars", "tfstate"],
    fileNames: [".terraform.lock.hcl"] },
  { name: "wasm-duo", color: color(palette.indigo), fileExtensions: ["wasm", "wat", "wast"] },
  { name: "yml", color: color(palette.red), fileExtensions: ["yml", "yaml"] },
  { name: "zig", color: color(palette.orange), fileExtensions: ["zig"] },

  // Tooling configs
  // {
  //   name: "npm",
  //   color: color(palette.red),
  //   // opacity: 0.75,
  //   fileNames: [
  //     "package.json", "package-lock.json", ".npmrc", ".npmignore",
  //   ]
  // },
  {
    name: "npm-duo",
    color: color(palette.red),
    // opacity: 0.75,
    fileNames: [
      "package.json", "package-lock.json", ".npmrc", ".npmignore",
    ]
  },
  { name: "eslint", color: color(palette.indigo), fileNames: [
    ".eslintrc", ".eslintrc.json", ".eslintrc.yml", ".eslintrc.yaml",
    ".eslintrc.js", ".eslintrc.cjs",
    "eslint.config.js", "eslint.config.mjs", "eslint.config.cjs",
    "eslint.config.ts", "eslint.config.mts",
    ".eslintignore",
  ]},
  { name: "prettier", color: color(palette.teal), fileNames: [
    ".prettierrc", ".prettierrc.json", ".prettierrc.yml", ".prettierrc.yaml",
    ".prettierrc.js", ".prettierrc.cjs", ".prettierrc.mjs", ".prettierrc.toml",
    "prettier.config.js", "prettier.config.cjs", "prettier.config.mjs",
    ".prettierignore",
  ]},
  { name: "stylelint", fileNames: [
    ".stylelintrc", ".stylelintrc.json", ".stylelintrc.yml", ".stylelintrc.yaml",
    ".stylelintrc.js", ".stylelintrc.cjs", ".stylelintrc.mjs",
    "stylelint.config.js", "stylelint.config.cjs", "stylelint.config.mjs",
    ".stylelintignore",
  ]},
  { name: "vite", color: color(palette.purple), fileNames: [
    "vite.config.js", "vite.config.ts", "vite.config.mjs", "vite.config.mts",
  ]},
  { name: "svgo", color: color(palette.green), fileNames: [
    "svgo.config.js", "svgo.config.mjs", "svgo.config.cjs", "svgo.config.ts",
  ]},
  { name: "babel", color: color(palette.yellow), fileNames: [
    ".babelrc", ".babelrc.json",
    "babel.config.js", "babel.config.json", "babel.config.cjs", "babel.config.mjs",
  ]},
  { name: "docker", color: color(palette.blue), fileNames: [
    "Dockerfile", ".dockerignore",
    "docker-compose.yml", "docker-compose.yaml", "docker-compose.override.yml",
    "compose.yml", "compose.yaml",
  ]},
  { name: "tailwind", color: color(palette.cyan), fileNames: [
    "tailwind.config.js", "tailwind.config.ts",
    "tailwind.config.mjs", "tailwind.config.cjs",
  ]},
  { name: "nextjs", fileNames: [
    "next.config.js", "next.config.ts", "next.config.mjs", "next.config.mts",
  ]},
  { name: "webpack", color: color(palette.blue), fileNames: [
    "webpack.config.js", "webpack.config.ts",
    "webpack.config.mjs", "webpack.config.cjs",
    "webpack.config.babel.js",
  ]},
  { name: "postcss", color: color(palette.red), fileNames: [
    "postcss.config.js", "postcss.config.cjs", "postcss.config.mjs",
    "postcss.config.ts",
    ".postcssrc", ".postcssrc.json", ".postcssrc.yml", ".postcssrc.yaml",
  ]},
  { name: "biome", color: color(palette.blue), fileNames: ["biome.json", "biome.jsonc"] },
  { name: "bun-duo", color: color(palette.orange), fileNames: ["bunfig.toml", "bun.lockb", "bun.lock"] },
  { name: "oxc", color: color(palette.orange), fileNames: [".oxlintrc.json"] },
  { name: "browserslist-duo", color: color(palette.yellow), fileNames: [".browserslistrc"] },
  { name: "claude", color: color(palette.orange), fileNames: ["CLAUDE.md"] },
  { name: "vscode", color: color(palette.blue), fileExtensions: ["code-workspace"] },
];

const tiers = {
  minimal,
  default: [...minimal, ...defaults],
  complete: [...minimal, ...defaults, ...complete],
};

// ---------------------------------------------------------------------------
// SVG generation — read source, optimize, stamp dark/light fills
// ---------------------------------------------------------------------------

function normalizeSvg(svg) {
  return svg.replaceAll("#6c6c71", "currentColor");
}

function applyOpacity(svg, opacity) {
  if (!opacity || opacity === 1) return svg;
  return svg.replace("<svg", `<svg opacity="${opacity}"`);
}

function applyBgStyle(svg, bgColor) {
  return svg.replace(">", `><style>.bg{fill:${bgColor}}</style>`);
}

function optimizeSvg(raw) {
  return normalizeSvg(optimize(raw, SVGOConfig).data);
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
      iconColor.bg.dark
    );
    lightSvg = applyBgStyle(
      optimized.replaceAll("currentColor", iconColor.fg.light),
      iconColor.bg.light
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

  for (const { name, color: iconColor, fileExtensions: exts, fileNames: names } of icons) {
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
await Promise.all(
  [...allIcons.values()].map((i) => generateSvgPair(i.name, { opacity: i.opacity }))
);

const coloredIcons = [...allIcons.values()].filter((i) => i.color);
await Promise.all(
  coloredIcons.map((i) => generateColoredSvg(i.name, i.color, { opacity: i.opacity }))
);

const tierOptions = {
  minimal:  { colored: false },
  default:  { colored: false },
  complete: { colored: true },
};

for (const [name, icons] of Object.entries(tiers)) {
  const theme = buildTheme(icons, tierOptions[name]);
  const out = path.join(iconOutputDir, `theme-${name}.json`);
  await writeFile(out, `${JSON.stringify(theme, null, 2)}\n`);
  console.log(`Wrote ${path.relative(rootDir, out)}`);
}
