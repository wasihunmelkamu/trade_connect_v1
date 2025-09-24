import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "mild-bison-734.convex.cloud",
      port: "",
      pathname: "/api/storage/**",
    }]
  }
};

export default nextConfig;
