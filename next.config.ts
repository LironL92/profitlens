import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to see if that's causing the issue
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
