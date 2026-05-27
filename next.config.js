/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // Skip ESLint during `next build` — repo carries no eslint config beyond
  // the legacy Airbnb file, and the migration's lint pass is a separate AC.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Component test files import `@testing-library/jest-dom` matchers
    // that the project's tsconfig deliberately scopes out of the build.
    // Type-checking still runs over the rest of the codebase.
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
