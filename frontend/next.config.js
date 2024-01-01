/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5001",
  },
  images: {
    domains: ["ssl.gstatic.com", "res.cloudinary.com"],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
