import { watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const svgsDir = path.join(rootDir, "svgs");

console.log(`👀 Watching ${svgsDir} for changes...\n`);

let debounceTimer;
const debounce = (callback, delay = 500) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(callback, delay);
};

watch(svgsDir, { recursive: false }, (eventType, filename) => {
  if (filename && filename.endsWith(".svg")) {
    console.log(`📝 Detected change: ${filename}`);
    debounce(() => {
      try {
        console.log("🔨 Rebuilding...");
        execSync("npm run build", { cwd: rootDir, stdio: "inherit" });
        console.log("✅ Rebuild complete\n");
      } catch (error) {
        console.error("❌ Build failed\n");
      }
    });
  }
});

// Keep the process alive
process.on("SIGINT", () => {
  console.log("\n👋 Watch mode stopped");
  process.exit(0);
});
