import type { NextConfig } from "next";

const ALLOWED_DEV_ORIGINS = process.env.NEXT_PUBLIC_DEV_ORIGINS || "http://localhost:9000"

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [ALLOWED_DEV_ORIGINS],
  eslint: {
    // Workaround for ESLint circular JSON error during `next build`.
    // Linting can still be run via `npm run lint`.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.kertaskerja.cc',
        pathname: "/logo/**"
      }
    ]
  }
};

export default nextConfig;
