import type { NextConfig } from "next";

// `npm run pages` builds a static copy for GitHub Pages under /rus10
const pages = process.env.PAGES === "1";
const basePath = pages ? "/rus10" : "";

const nextConfig: NextConfig = {
  ...(pages && { output: "export", trailingSlash: true }),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
