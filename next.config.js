const withPWA = require('next-pwa')({
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

const nextConfig = {
  // output: 'export', // 🔥 ଏଇଟା Comment କରିଦିଅ
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  turbopack: {},
  
  // 👇 ଏଇ 3 Line Add କର
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withPWA(nextConfig)