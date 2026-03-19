import { color, duoColor, palette } from "../palette.mjs";

export default [
  {
    name: "lang-javascript-duo",
    color: color(palette.yellow),
    fileExtensions: ["js", "cjs", "mjs", "jsx"],
  },
  {
    name: "lang-typescript-duo",
    color: color(palette.cyan),
    fileExtensions: ["ts", "cts", "mts", "tsx"],
  },
  {
    name: "lang-css-duo",
    color: color(palette.indigo),
    fileExtensions: ["css", "scss", "sass", "less", "postcss", "styl"],
  },
  {
    name: "lang-html-duo",
    color: color(palette.orange),
    fileExtensions: ["html", "htm", "xhtml"],
  },
  {
    name: "lang-markdown",
    fileExtensions: ["md", "mdx", "markdown"],
  },
  {
    name: "lang-swift",
    color: color(palette.orange),
    fileExtensions: ["swift"],
  },
  {
    name: "lang-rust",
    color: color(palette.orange),
    fileExtensions: ["rs"],
  },
  {
    name: "lang-go",
    color: color(palette.cyan),
    fileExtensions: ["go"],
  },
  {
    name: "lang-python",
    color: duoColor(palette.blue, palette.yellow),
    fileExtensions: ["py", "pyw", "pyi", "pyx"],
  },
  {
    name: "lang-ruby",
    color: color(palette.red),
    opacity: 0.75,
    fileExtensions: ["rb", "erb", "gemspec", "rake"],
    fileNames: ["Gemfile", "Rakefile"],
  },
  {
    name: "font",
    fileExtensions: ["ttf", "otf", "woff", "woff2", "eot"],
  },
  {
    name: "bash-duo",
    color: color(palette.green),
    fileExtensions: ["sh", "bash", "zsh", "fish", "ksh", "csh"],
    fileNames: [".bashrc", ".bash_profile", ".zshrc", ".zshenv", ".zprofile"],
  },
  {
    name: "svg-2",
    fileExtensions: ["svg"],
  },
  {
    name: "braces",
    fileExtensions: ["json", "jsonc", "json5", "jsonl"],
  },
  {
    name: "git",
    color: color(palette.orange),
    opacity: 0.75,
    fileNames: [".gitignore", ".gitattributes", ".gitmodules", ".gitkeep"],
  },
];
