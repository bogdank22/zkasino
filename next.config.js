/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["play.zkasino.io"],
    unoptimized: true,
  }
}

module.exports = nextConfig
