/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["play.zkasino.io"]
  }
}

module.exports = nextConfig
