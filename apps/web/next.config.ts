import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@quadrik/ui', '@quadrik/design-tokens'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
    ],
  },
}

export default nextConfig
