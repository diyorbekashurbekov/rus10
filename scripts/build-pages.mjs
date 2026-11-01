// Static export for GitHub Pages: builds into out/, then publishes it as docs/
import { execSync } from "node:child_process";
import { cpSync, rmSync, writeFileSync } from "node:fs";

execSync("node scripts/restore-assets.mjs", { stdio: "inherit" });
execSync("npx next build", { stdio: "inherit", env: { ...process.env, PAGES: "1" } });
rmSync("docs", { recursive: true, force: true });
cpSync("out", "docs", { recursive: true });
writeFileSync("docs/.nojekyll", ""); // otherwise Pages hides the _next/ folder
console.log("docs/ ready for GitHub Pages");
