/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.58'],
  images: { qualities: [75, 85] },

  transpilePackages: ['three'], // This is valid and fine

  turbopack: {}
}

module.exports = nextConfig;
