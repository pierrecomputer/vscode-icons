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
  { name: "image-duo", fileExtensions: [
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
  // Frameworks & libraries
  { name: "astro", fileExtensions: ["astro"] },
  { name: "bootstrap-duo", fileNames: [
    "bootstrap.min.css", "bootstrap.css", "bootstrap.min.js", "bootstrap.js",
    "bootstrap.bundle.min.js", "bootstrap.bundle.js",
  ]},
  { name: "react", fileExtensions: ["jsx", "tsx"] },
  { name: "svelte", fileExtensions: ["svelte"] },
  { name: "vue", fileExtensions: ["vue"] },

  // Languages & formats
  { name: "graphql", fileExtensions: ["graphql", "gql"] },
  { name: "sass", fileExtensions: ["scss", "sass"] },
  { name: "terraform", fileExtensions: ["tf", "tfvars", "tfstate"],
    fileNames: [".terraform.lock.hcl"] },
  { name: "wasm-duo", fileExtensions: ["wasm", "wat", "wast"] },
  { name: "yml", fileExtensions: ["yml", "yaml"] },
  { name: "zig", fileExtensions: ["zig"] },

  // Tooling configs
  { name: "npm-duo", fileNames: [
    "package.json", "package-lock.json", ".npmrc", ".npmignore",
  ]},
  { name: "eslint", fileNames: [
    ".eslintrc", ".eslintrc.json", ".eslintrc.yml", ".eslintrc.yaml",
    ".eslintrc.js", ".eslintrc.cjs",
    "eslint.config.js", "eslint.config.mjs", "eslint.config.cjs",
    "eslint.config.ts", "eslint.config.mts",
    ".eslintignore",
  ]},
  { name: "prettier", fileNames: [
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
  { name: "vite", fileNames: [
    "vite.config.js", "vite.config.ts", "vite.config.mjs", "vite.config.mts",
  ]},
  { name: "svgo", fileNames: [
    "svgo.config.js", "svgo.config.mjs", "svgo.config.cjs", "svgo.config.ts",
  ]},
  { name: "babel", fileNames: [
    ".babelrc", ".babelrc.json",
    "babel.config.js", "babel.config.json", "babel.config.cjs", "babel.config.mjs",
  ]},
  { name: "docker", fileNames: [
    "Dockerfile", ".dockerignore",
    "docker-compose.yml", "docker-compose.yaml", "docker-compose.override.yml",
    "compose.yml", "compose.yaml",
  ]},
  { name: "tailwind", fileNames: [
    "tailwind.config.js", "tailwind.config.ts",
    "tailwind.config.mjs", "tailwind.config.cjs",
  ]},
  { name: "nextjs", fileNames: [
    "next.config.js", "next.config.ts", "next.config.mjs", "next.config.mts",
  ]},
  { name: "webpack", fileNames: [
    "webpack.config.js", "webpack.config.ts",
    "webpack.config.mjs", "webpack.config.cjs",
    "webpack.config.babel.js",
  ]},
  { name: "postcss", fileNames: [
    "postcss.config.js", "postcss.config.cjs", "postcss.config.mjs",
    "postcss.config.ts",
    ".postcssrc", ".postcssrc.json", ".postcssrc.yml", ".postcssrc.yaml",
  ]},
  { name: "biome", fileNames: ["biome.json", "biome.jsonc"] },
  { name: "bun-duo", fileNames: ["bunfig.toml", "bun.lockb", "bun.lock"] },
  { name: "oxc", fileNames: [".oxlintrc.json"] },
  { name: "browserslist-duo", fileNames: [".browserslistrc"] },
  { name: "claude", fileNames: ["CLAUDE.md"] },
  { name: "vscode", fileExtensions: ["code-workspace"] },
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

for (const [name, icons] of Object.entries(tiers)) {
  const theme = buildTheme(icons);
  const out = path.join(iconOutputDir, `theme-${name}.json`);
  await writeFile(out, `${JSON.stringify(theme, null, 2)}\n`);
  console.log(`Wrote ${path.relative(rootDir, out)}`);
}
