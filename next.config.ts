import type { NextConfig } from "next";

// Deployed at https://<user>.github.io/thai-stock-compass/, so assets and
// routes need this prefix. Set by the GitHub Actions workflow; empty locally
// so `next dev`/`next build` still serve from "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
};

export default nextConfig;
