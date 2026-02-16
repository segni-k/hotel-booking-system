import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'standalone' for Vercel — Vercel handles output natively.
  // Use 'standalone' only for Docker/self-hosted deployments.
  // output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
  headers: async () => [
    {
      source: '/sw.js',
      headers: [
        {
          key: 'Service-Worker-Allowed',
          value: '/',
        },
        {
          key: 'Cache-Control',
          value: 'no-cache',
        },
      ],
    },
  ],
};

export default nextConfig;
