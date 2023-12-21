/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BACKEND_URL: process.env.BACKEND_URL
    },
    images:{
        domains: ['ssl.gstatic.com'],
    },
    reactStrictMode: false
}

module.exports = nextConfig
