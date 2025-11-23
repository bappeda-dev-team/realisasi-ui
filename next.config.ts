import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
const ALLOWED_DEV_ORIGINS = process.env.NEXT_PUBLIC_DEV_ORIGINS || "http://localhost:9000"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // panggilan fe
        destination: `${API_URL}/api/v1/:path*` // backend
      },
      {
        source: "/auth-api/:path*",
        destination: `${API_URL}/:path*` // backend
      }
    ]
  },
  output: "standalone",
  allowedDevOrigins: [ALLOWED_DEV_ORIGINS],
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
