/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Monorepo support
  transpilePackages: ['@zyperia/shared-ui', '@zyperia/shared-lib'],

  // Image optimization
  images: {
    unoptimized: true,
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [];
  },

  // Rewrites for monorepo routing
  async rewrites() {
    return {
      beforeFiles: [
        // Crypto app routes
        {
          source: '/crypto/:path*',
          destination: '/apps/crypto/:path*',
        },
        // Intelligence app routes
        {
          source: '/intelligence/:path*',
          destination: '/apps/intelligence/:path*',
        },
        // OnlineBiz app routes
        {
          source: '/onlinebiz/:path*',
          destination: '/apps/onlinebiz/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
