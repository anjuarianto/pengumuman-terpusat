/** @type {import('next').NextConfig} */
const nextConfig = {

    // env: {
    //   API_URL: process.env.API_URL,
    // },
    async rewrites() {
          return [
              {
                  source: '/:path*',
                  destination:'http://localhost/:path*',
              },
          ]
      },
  };

export default nextConfig;
