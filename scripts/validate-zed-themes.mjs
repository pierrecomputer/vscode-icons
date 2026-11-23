import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const zedExtensionDir = path.join(rootDir, "zed");
const themeDir = path.join(zedExtensionDir, "icon_themes");
const iconDir = path.join(zedExtensionDir, "icons");

const expectedThemeFiles = [
  "pierre-icons-complete.json",
  "pierre-icons-minimal.json",
  "pierre-icons.json",
];

function validateIconPath(iconPath, referencedPaths) {
  assert.match(iconPath, /^\.\/icons\/[^/]+\.svg$/, `Invalid icon path: ${iconPath}`);

  const resolved = path.resolve(zedExtensionDir, iconPath);
  assert.ok(
    resolved.startsWith(`${zedExtensionDir}${path.sep}`),
    `Icon path escapes the extension: ${iconPath}`,
  );
  referencedPaths.add(resolved);
}

function validateIconAppearance(theme, iconPath) {
  assert.equal(
    iconPath.endsWith("-light.svg"),
    theme.appearance === "light",
    `${theme.name} references an icon for the wrong appearance: ${iconPath}`,
  );
}

function validateAssociations(theme, associationName) {
  for (const [association, iconName] of Object.entries(theme[associationName] ?? {})) {
    assert.ok(association, `${theme.name} has an empty ${associationName} key`);
    assert.ok(
      theme.file_icons[iconName],
      `${theme.name} maps ${association} to missing icon ${iconName}`,
    );
  }
}

const themeFiles = (await readdir(themeDir)).filter((file) => file.endsWith(".json")).sort();
assert.deepEqual(themeFiles, expectedThemeFiles, "Unexpected generated Zed theme files");

const themeNames = new Set();
const referencedPaths = new Set();

for (const file of themeFiles) {
  const family = JSON.parse(await readFile(path.join(themeDir, file), "utf8"));

  assert.equal(family.$schema, "https://zed.dev/schema/icon_themes/v0.3.0.json");
  assert.equal(family.author, "Pierre Computer");
  assert.ok(family.name, `${file} is missing a family name`);
  assert.equal(family.themes.length, 2, `${file} must contain dark and light themes`);
  assert.deepEqual(
    family.themes.map((theme) => theme.appearance).sort(),
    ["dark", "light"],
    `${file} must contain one theme per appearance`,
  );

  for (const theme of family.themes) {
    assert.ok(!themeNames.has(theme.name), `Duplicate Zed theme name: ${theme.name}`);
    themeNames.add(theme.name);
    assert.equal(
      theme.name,
      `${family.name} — ${theme.appearance === "dark" ? "Dark" : "Light"}`,
      `${theme.name} does not identify its appearance`,
    );

    assert.ok(theme.file_icons.default, `${theme.name} is missing its default file icon`);
    validateAssociations(theme, "file_stems");
    validateAssociations(theme, "file_suffixes");

    validateIconPath(theme.directory_icons.collapsed, referencedPaths);
    validateIconPath(theme.directory_icons.expanded, referencedPaths);
    validateIconAppearance(theme, theme.directory_icons.collapsed);
    validateIconAppearance(theme, theme.directory_icons.expanded);

    for (const definition of Object.values(theme.file_icons)) {
      validateIconPath(definition.path, referencedPaths);
      validateIconAppearance(theme, definition.path);
    }

    for (const definition of Object.values(theme.named_directory_icons ?? {})) {
      validateIconPath(definition.collapsed, referencedPaths);
      validateIconPath(definition.expanded, referencedPaths);
      validateIconAppearance(theme, definition.collapsed);
      validateIconAppearance(theme, definition.expanded);
    }
  }

  if (file === "pierre-icons-complete.json") {
    for (const theme of family.themes) {
      assert.equal(theme.file_suffixes["test.jsx"], "lang-javascript-test-duo");
      assert.equal(theme.file_suffixes["spec.tsx"], "lang-typescript-test-duo");
      assert.equal(theme.file_suffixes.ex, "lang-elixir");
      assert.equal(theme.file_suffixes.kts, "lang-kotlin");
      assert.equal(theme.file_stems[".oxfmtrc.jsonc"], "oxc");
      assert.equal(theme.file_stems["oxlint.config.mts"], "oxc");
      assert.equal(theme.file_stems["pnpm-lock.yaml"], "pnpm");
      assert.equal(theme.file_stems["rolldown.config.ts"], "rolldown");
      assert.equal(theme.file_stems["vitest.config.ts"], "vitest");
    }
  }
}

for (const iconPath of referencedPaths) {
  await access(iconPath);
  assert.match(await readFile(iconPath, "utf8"), /^<svg[\s>]/, `${iconPath} is not an SVG`);
}

const generatedIcons = (await readdir(iconDir))
  .filter((file) => file.endsWith(".svg"))
  .map((file) => path.join(iconDir, file))
  .sort();
assert.deepEqual(
  generatedIcons,
  [...referencedPaths].sort(),
  "Generated Zed icons and referenced icons differ",
);

const [manifest, packageJson] = await Promise.all([
  readFile(path.join(zedExtensionDir, "extension.toml"), "utf8"),
  readFile(path.join(rootDir, "package.json"), "utf8").then(JSON.parse),
]);
assert.match(manifest, /^id = "pierre-icons"$/m);
assert.match(manifest, new RegExp(`^version = "${packageJson.version}"$`, "m"));
await access(path.join(zedExtensionDir, "LICENSE.md"));

console.log(
  `Validated ${themeFiles.length} Zed theme families, ${themeNames.size} themes, and ${generatedIcons.length} icons`,
);
