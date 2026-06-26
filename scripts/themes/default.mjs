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
    name: "lang-javascript-test-duo",
    svgName: "lang-javascript-duo",
    color: color(palette.red),
    fileExtensions: ["spec.js", "test.js"],
  },
  {
    name: "lang-typescript-test-duo",
    svgName: "lang-typescript-duo",
    color: color(palette.red),
    fileExtensions: ["spec.ts", "test.ts"],
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
    name: "lang-c",
    color: color(palette.blue),
    fileExtensions: ["c", "h"],
  },
  {
    name: "lang-cpp",
    svgName: "lang-c",
    color: color(palette.blue),
    fileExtensions: ["cpp", "cc", "cxx", "hpp", "hh", "hxx", "inl"],
  },
  {
    name: "lang-csharp",
    svgName: "lang-c",
    color: color(palette.purple),
    fileExtensions: ["cs"],
  },
  {
    name: "lang-objc",
    svgName: "lang-c",
    color: color(palette.vermilion),
    fileExtensions: ["m", "mm"],
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
    name: "file-symlink-duo",
  },
  {
    name: "server-duo",
    fileExtensions: ["db", "sql", "sqlite", "sqlite3"],
  },
  {
    name: "file-table-duo",
    fileExtensions: ["csv", "tsv", "xls", "xlsx", "ods"],
  },
  {
    name: "file-zip-duo",
    fileExtensions: ["zip", "tar", "gz", "tgz", "bz2", "xz", "7z", "rar", "jar", "war"],
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
    color: color(palette.vermilion),
    fileNames: [".gitignore", ".gitattributes", ".gitmodules", ".gitkeep"],
  },
];
