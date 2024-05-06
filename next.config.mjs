/** @type {import('next').NextConfig} */
const nextConfig = {

    env: {
      API_URL: process.env.API_URL,
    },
    async rewrites() {
          return [
              {
                  source: '/api/:path*',
                  destination:'http://127.0.0.1:8000/api/:path*',
              },
              {
                  source: '/storage/:path*',
                  destination:'http://127.0.0.1:8000/storage/:path*',
              },
          ]
      },
  };

export default nextConfig;
