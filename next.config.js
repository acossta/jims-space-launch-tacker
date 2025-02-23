/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'thespacedevs-prod.nyc3.digitaloceanspaces.com',
      'spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com'
    ],
  },
}

module.exports = nextConfig