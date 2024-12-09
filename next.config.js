/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add any other configuration options here
  transpilePackages: ['three'],
  test: /\.json$/,
  type: 'javascript/auto',
  use: ['json-loader'],
}

module.exports = nextConfig
