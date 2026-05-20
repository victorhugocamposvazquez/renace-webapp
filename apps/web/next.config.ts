import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@renace/core",
    "@renace/supabase",
    "@renace/ai",
    "@renace/tokens"
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**"
      }
    ]
  },
  experimental: {
    typedRoutes: false
  }
};

export default nextConfig;
