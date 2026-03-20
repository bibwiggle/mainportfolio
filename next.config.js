/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  transpilePackages: ['three'], // This is valid and fine

  turbopack: {}
}

module.exports = nextConfig;
