import type { NextConfig } from "next";

// PREVIEW_EXPORT=1 builds a static copy of the site (out/) for sharing as a preview.
const nextConfig: NextConfig = process.env.PREVIEW_EXPORT
  ? { output: "export", images: { unoptimized: true }, distDir: ".next-export" }
  : {};

export default nextConfig;
