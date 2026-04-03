import { color, duoColor, palette } from "../palette.mjs";

// ---------------------------------------------------------------------------
// Overrides — re-map default icons with different colors in the complete tier
// ---------------------------------------------------------------------------

const overrides = [
  {
    name: "lang-javascript-duo",
    color: color(palette.yellow),
    fileExtensions: ["js", "cjs", "mjs", "jsx"],
  },
  {
    name: "lang-typescript-duo",
    color: color(palette.blue),
    fileExtensions: ["ts", "cts", "mts", "tsx"],
  },
  {
    name: "lang-css-duo",
    color: color(palette.indigo),
    fileExtensions: ["css", "scss", "sass", "less", "postcss", "styl"],
  },
  {
    name: "bash-duo",
    color: color(palette.gray),
    fileExtensions: ["sh", "bash", "zsh", "fish", "ksh", "csh"],
    fileNames: [".bashrc", ".bash_profile", ".zshrc", ".zshenv", ".zprofile"],
  },
  {
    name: "svg-2",
    color: color(palette.orange),
    opacity: 0.75,
    fileExtensions: ["svg"],
  },
];

// ---------------------------------------------------------------------------
// Frameworks & libraries
// ---------------------------------------------------------------------------

const frameworks = [
  {
    name: "astro",
    color: duoColor(palette.purple, palette.pink),
    fileExtensions: ["astro"],
  },
  {
    name: "bootstrap-duo",
    color: color(palette.indigo),
    fileNames: [
      "bootstrap.min.css",
      "bootstrap.css",
      "bootstrap.min.js",
      "bootstrap.js",
      "bootstrap.bundle.min.js",
      "bootstrap.bundle.js",
    ],
  },
  {
    name: "react",
    color: color(palette.cyan),
    fileExtensions: ["jsx", "tsx"],
  },
  {
    name: "svelte",
    color: color(palette.red),
    fileExtensions: ["svelte"],
  },
  {
    name: "vue",
    color: color(palette.green),
    fileExtensions: ["vue"],
  },
];

// ---------------------------------------------------------------------------
// Languages & formats
// ---------------------------------------------------------------------------

const languages = [
  {
    name: "graphql",
    color: color(palette.pink),
    fileExtensions: ["graphql", "gql"],
  },
  {
    name: "sass",
    color: color(palette.pink),
    fileExtensions: ["scss", "sass"],
  },
  {
    name: "terraform",
    color: color(palette.indigo),
    fileExtensions: ["tf", "tfvars", "tfstate"],
    fileNames: [".terraform.lock.hcl"],
  },
  {
    name: "wasm-duo",
    color: color(palette.indigo),
    fileExtensions: ["wasm", "wat", "wast"],
  },
  {
    name: "yml",
    color: color(palette.red),
    fileExtensions: ["yml", "yaml"],
  },
  {
    name: "zig",
    color: color(palette.orange),
    fileExtensions: ["zig"],
  },
];

// ---------------------------------------------------------------------------
// Tooling configs
// ---------------------------------------------------------------------------

const tooling = [
  {
    name: "npm",
    color: color(palette.red),
    opacity: 0.75,
    fileNames: ["package.json", "package-lock.json", ".npmrc", ".npmignore"],
  },
  {
    name: "eslint",
    color: color(palette.indigo),
    fileNames: [
      ".eslintrc",
      ".eslintrc.json",
      ".eslintrc.yml",
      ".eslintrc.yaml",
      ".eslintrc.js",
      ".eslintrc.cjs",
      "eslint.config.js",
      "eslint.config.mjs",
      "eslint.config.cjs",
      "eslint.config.ts",
      "eslint.config.mts",
      ".eslintignore",
    ],
  },
  {
    name: "prettier",
    color: color(palette.teal),
    fileNames: [
      ".prettierrc",
      ".prettierrc.json",
      ".prettierrc.yml",
      ".prettierrc.yaml",
      ".prettierrc.js",
      ".prettierrc.cjs",
      ".prettierrc.mjs",
      ".prettierrc.toml",
      "prettier.config.js",
      "prettier.config.cjs",
      "prettier.config.mjs",
      ".prettierignore",
    ],
  },
  {
    name: "stylelint",
    fileNames: [
      ".stylelintrc",
      ".stylelintrc.json",
      ".stylelintrc.yml",
      ".stylelintrc.yaml",
      ".stylelintrc.js",
      ".stylelintrc.cjs",
      ".stylelintrc.mjs",
      "stylelint.config.js",
      "stylelint.config.cjs",
      "stylelint.config.mjs",
      ".stylelintignore",
    ],
  },
  {
    name: "vite",
    color: color(palette.purple),
    opacity: 0.75,
    fileNames: ["vite.config.js", "vite.config.ts", "vite.config.mjs", "vite.config.mts"],
  },
  {
    name: "svgo",
    color: color(palette.green),
    fileNames: ["svgo.config.js", "svgo.config.mjs", "svgo.config.cjs", "svgo.config.ts"],
  },
  {
    name: "babel",
    color: color(palette.yellow),
    fileNames: [
      ".babelrc",
      ".babelrc.json",
      "babel.config.js",
      "babel.config.json",
      "babel.config.cjs",
      "babel.config.mjs",
    ],
  },
  {
    name: "docker",
    color: color(palette.blue),
    fileNames: [
      "Dockerfile",
      ".dockerignore",
      "docker-compose.yml",
      "docker-compose.yaml",
      "docker-compose.override.yml",
      "compose.yml",
      "compose.yaml",
    ],
  },
  {
    name: "tailwind",
    color: color(palette.cyan),
    fileNames: [
      "tailwind.config.js",
      "tailwind.config.ts",
      "tailwind.config.mjs",
      "tailwind.config.cjs",
    ],
  },
  {
    name: "nextjs",
    fileNames: ["next.config.js", "next.config.ts", "next.config.mjs", "next.config.mts"],
  },
  {
    name: "webpack",
    color: duoColor(palette.blue, palette.cyan),
    fileNames: [
      "webpack.config.js",
      "webpack.config.ts",
      "webpack.config.mjs",
      "webpack.config.cjs",
      "webpack.config.babel.js",
    ],
  },
  {
    name: "postcss",
    color: color(palette.red),
    fileNames: [
      "postcss.config.js",
      "postcss.config.cjs",
      "postcss.config.mjs",
      "postcss.config.ts",
      ".postcssrc",
      ".postcssrc.json",
      ".postcssrc.yml",
      ".postcssrc.yaml",
    ],
  },
  {
    name: "biome",
    color: color(palette.blue),
    fileNames: ["biome.json", "biome.jsonc"],
  },
  {
    name: "bun-duo",
    color: color(palette.brown),
    // color: duoColor(palette.pink, palette.brown),
    fileNames: ["bunfig.toml", "bun.lockb", "bun.lock"],
  },
  {
    name: "oxc",
    color: color(palette.cyan),
    fileNames: [".oxlintrc.json"],
  },
  {
    name: "browserslist-duo",
    color: color(palette.yellow),
    fileNames: [".browserslistrc"],
  },
  {
    name: "claude",
    color: color(palette.orange),
    fileNames: ["CLAUDE.md"],
  },
  {
    name: "vscode",
    color: color(palette.blue),
    fileExtensions: ["code-workspace"],
  },
];

export default [...overrides, ...frameworks, ...languages, ...tooling];
