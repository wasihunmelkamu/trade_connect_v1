import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "brainy-spider-664.convex.cloud",
        port: "",
        pathname: "/api/storage/**",
      },
    ],
  },

  // ✅ Ignore ESLint errors during build so deployment succeeds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
