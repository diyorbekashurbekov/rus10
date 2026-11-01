// Media is stored once in the repo, under docs/assets (served by GitHub Pages).
// Before dev/build, copy it to public/assets if that folder is missing (e.g. a fresh clone).
import { cpSync, existsSync } from "node:fs";

if (!existsSync("public/assets") && existsSync("docs/assets")) {
  cpSync("docs/assets", "public/assets", { recursive: true });
  console.log("public/assets restored from docs/assets");
}
