import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgDir = path.resolve(__dirname, "..", "svgs");

const svgoConfig = {
  js2svg: { pretty: true, indent: 2 },
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          convertTransform: false,
          inlineStyles: false,
          convertColors: false,
        },
      },
    },
    {
      name: "removeAttrs",
      params: { attrs: ["id"] },
    },
    "sortAttrs",
  ],
};

function preprocess(svg) {
  return svg
    .replace(/<defs>[\s\S]*?<\/defs>/g, "")
    .replace(/<g[^>]*>/g, "")
    .replace(/<\/g>/g, "")
    .replace(/\s+clip-path="[^"]*"/g, "");
}

function postprocess(svg) {
  return svg
    .replace(/fill="(?!none|currentColor)[^"]+"/g, 'fill="currentColor"')
    .replace(/\s+stroke(?:-[\w-]+)?="[^"]*"/g, "");
}

async function formatSvgs() {
  const files = (await readdir(svgDir)).filter((f) => f.endsWith(".svg")).sort();

  for (const file of files) {
    const filePath = path.join(svgDir, file);
    const raw = await readFile(filePath, "utf8");
    const cleaned = preprocess(raw);
    const optimized = optimize(cleaned, svgoConfig).data;
    const normalized = postprocess(optimized);
    await writeFile(filePath, normalized);
    console.log(`Formatted ${file}`);
  }

  console.log(`\nFormatted ${files.length} SVGs`);
}

formatSvgs();
