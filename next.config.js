/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Hostinger Node.js deployment
  output: 'standalone',

  // Image optimization configuration
  images: {
    // Allow images from local content directory
    remotePatterns: [],
    // Disable image optimization in development for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Disable x-powered-by header
  poweredByHeader: false,
};

module.exports = nextConfig;
