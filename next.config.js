/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable server-side features for Clerk authentication
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Exclude Supabase functions from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src', 'components', 'lib', 'utils'] // Only lint these directories
  }
}

module.exports = nextConfig
