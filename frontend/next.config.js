/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BACKEND_URL: process.env.BACKEND_URL
    },
    reactStrictMode: false
}

module.exports = nextConfig
