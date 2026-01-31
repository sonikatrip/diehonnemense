/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Hostinger Node.js deployment
  output: 'standalone',

  // Disable image optimization (not supported on Hostinger shared hosting)
  images: {
    unoptimized: true,
  },

  // Disable x-powered-by header
  poweredByHeader: false,
};

module.exports = nextConfig;
