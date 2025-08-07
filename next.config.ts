import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Only run ESLint on specific directories during builds
    dirs: ['src', 'pages', 'components', 'lib', 'utils'],
    // Alternatively, if you want to disable ESLint during builds completely:
    // ignoreDuringBuilds: true,
  },
};

export default nextConfig;
