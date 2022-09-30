/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["preview.redd.it", "images.unsplash.com"]
  }
}

module.exports = nextConfig
