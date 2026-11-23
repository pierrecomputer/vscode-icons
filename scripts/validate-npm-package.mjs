import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const packageJson = JSON.parse(await readFile(path.join(rootDir, "package.json"), "utf8"));
const packOutput = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  cwd: rootDir,
  encoding: "utf8",
});
const parsed = JSON.parse(packOutput);
const metadata = Array.isArray(parsed) ? parsed[0] : Object.values(parsed)[0];
const files = new Set(metadata.files.map(({ path: filePath }) => filePath));

assert.equal(metadata.name, packageJson.name);
assert.equal(metadata.version, packageJson.version);

for (const requiredFile of [
  "LICENSE.md",
  "README.md",
  "icon.png",
  "package.json",
  "icons/theme-minimal.json",
  "icons/theme-default.json",
  "icons/theme-complete.json",
]) {
  assert.ok(files.has(requiredFile), `npm package is missing ${requiredFile}`);
}

for (const themeName of ["minimal", "default", "complete"]) {
  const theme = JSON.parse(
    await readFile(path.join(rootDir, "icons", `theme-${themeName}.json`), "utf8"),
  );

  for (const { iconPath } of Object.values(theme.iconDefinitions)) {
    const packagedPath = path.posix.join("icons", iconPath.replace(/^\.\//, ""));
    assert.ok(files.has(packagedPath), `${themeName} theme references missing ${packagedPath}`);
  }
}

const excludedPrefixes = [".github/", "preview/", "scripts/", "svgs/", "test/", "zed/"];
for (const file of files) {
  assert.ok(
    !excludedPrefixes.some((prefix) => file.startsWith(prefix)),
    `npm package includes development file ${file}`,
  );
}

console.log(`Validated npm package ${packageJson.version} with ${files.size} files`);
