/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable server-side features for Clerk authentication
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
