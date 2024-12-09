/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  transpilePackages: ['three'], // This is valid and fine

  webpack: (config) => {
    // Remove unnecessary json-loader since Next.js natively supports JSON imports
    return config;
  }
}

module.exports = nextConfig;
