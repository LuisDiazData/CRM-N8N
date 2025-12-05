/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080',
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678'
  }
};

module.exports = nextConfig;
