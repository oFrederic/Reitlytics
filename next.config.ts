import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Use a different output directory to avoid OneDrive sync issues
  distDir: 'build',
};

export default nextConfig;
