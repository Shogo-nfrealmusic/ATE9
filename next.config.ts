import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    /**
     * Vercel の Hobby プランでは外部ドメインに対する Next.js の画像最適化が
     * 「OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED」で失敗するため、
     * いったん Next.js 側の最適化を無効化して直接画像を配信する。
     */
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
