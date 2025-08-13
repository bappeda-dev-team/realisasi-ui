import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ['kertaskerja.local', '*.kertaskerja.local'],
  basePath: "/realisasi",
  assetPrefix: "/realisasi/",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.kertaskerja.cc',
        pathname: '**'
      }
    ]
  }
};

export default nextConfig;
