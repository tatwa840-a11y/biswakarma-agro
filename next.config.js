/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

const nextConfig = {
  // output: 'export', // 🔥 ଏଇଟା କମେଣ୍ଟ କରିଦିଅ
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  turbopack: {}
}

module.exports = withPWA(nextConfig)