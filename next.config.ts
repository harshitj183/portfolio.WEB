import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        // For standard assets in public/ (which don't have content hashes in their filename), 
        // we use a strong stale-while-revalidate caching strategy instead of immutable 
        // so that updates are eventualy propagated without cache busting issues.
        source: '/:all*(svg|jpg|png|webp|avif|ico|mp4|webm|mp3)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'leetcode.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.leetcode.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 604800, // 7 days cache for remote images
  },
};

export default withSerwist(nextConfig);
