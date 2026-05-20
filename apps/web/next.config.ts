import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@renace/core",
    "@renace/supabase",
    "@renace/ai",
    "@renace/tokens"
  ],
  experimental: {
    typedRoutes: false
  }
};

export default nextConfig;
