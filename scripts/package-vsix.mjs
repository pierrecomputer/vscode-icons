import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const pkgPath = path.join(rootDir, "package.json");

const original = readFileSync(pkgPath, "utf-8");
const pkg = JSON.parse(original);

const originalName = pkg.name;
pkg.name = "pierre-vscode-icons";

console.log(`Temporarily renaming package: ${originalName} → ${pkg.name}\n`);

try {
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  execSync("npx @vscode/vsce package", { stdio: "inherit", cwd: rootDir });
} finally {
  writeFileSync(pkgPath, original);
  console.log(`\nRestored package name: ${originalName}`);
}
