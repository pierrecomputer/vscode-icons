import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgDir = path.resolve(__dirname, "..", "svgs");

function formatBytes(bytes) {
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes.toLocaleString()} B`;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const idx = args.indexOf("--threshold");
  if (idx !== -1 && args[idx + 1]) {
    return { threshold: Number(args[idx + 1]) };
  }
  return { threshold: null };
}

async function svgSizes() {
  const { threshold } = parseArgs();
  const files = (await readdir(svgDir)).filter((f) => f.endsWith(".svg")).sort();

  const entries = await Promise.all(
    files.map(async (file) => {
      const info = await stat(path.join(svgDir, file));
      return { file, size: info.size };
    }),
  );

  entries.sort((a, b) => b.size - a.size);

  const maxName = Math.max(...entries.map((e) => e.file.length));
  const maxSize = Math.max(...entries.map((e) => formatBytes(e.size).length));
  const colWidth = maxName + maxSize + 4;
  const termWidth = process.stdout.columns || 80;
  const cols = Math.max(1, Math.floor(termWidth / (colWidth + 2)));

  console.log("\nSVG File Sizes (largest first)");
  console.log("\u2500".repeat(Math.min(termWidth, cols * (colWidth + 2))));

  for (let i = 0; i < entries.length; i += cols) {
    const row = entries.slice(i, i + cols);
    const cells = row.map(({ file, size }) => {
      const sizeStr = formatBytes(size).padStart(maxSize);
      const marker = threshold !== null && size > threshold ? "*" : " ";
      return `${marker} ${file.padEnd(maxName)}  ${sizeStr}`;
    });
    console.log(cells.join("  "));
  }

  const totalSize = entries.reduce((sum, e) => sum + e.size, 0);
  const avg = Math.round(totalSize / entries.length);
  const max = entries[0];

  console.log("\u2500".repeat(Math.min(termWidth, cols * (colWidth + 2))));
  console.log(`  Total: ${entries.length} files, ${formatBytes(totalSize)}`);
  console.log(`  Avg:   ${formatBytes(avg)}`);
  console.log(`  Max:   ${max.file} (${formatBytes(max.size)})`);

  if (threshold !== null) {
    const over = entries.filter((e) => e.size > threshold);
    console.log(
      `  Over ${formatBytes(threshold)}: ${over.length} file${over.length === 1 ? "" : "s"} *`,
    );
  }

  console.log();
}

svgSizes();
