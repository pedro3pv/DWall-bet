import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
  /* other config options here */
};

export default nextConfig;
