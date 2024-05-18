/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    // Consider removing ignoreBuildErrors for stricter type checking
    ignoreBuildErrors: true,
  },
  env: {
    API_URL: process.env.API_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_URL+ "/api/:path*",
      },
      {
        source: "/storage/:path*",
        destination: process.env.API_URL+ "/storage/:path*",
      },
    ];
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */

// import withNextEnv from "next-env";
// // import dotenv from "dotenv";
// import webpack from "webpack";

// // dotenv.config();

// const nextConfig = {
//   experimental: {
//     appDir: true,
//   },
//   typescript: {
//     // Consider removing ignoreBuildErrors for stricter type checking
//     // ignoreBuildErrors: true,
//   },
//   env: {
//     API_URL: process.env.API_URL,
//   },
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "http://127.0.0.1:8000/api/:path*",
//       },
//       {
//         source: "/storage/:path*",
//         destination: "http://127.0.0.1:8000/storage/:path*",
//       },
//     ];
//   },
// };

// module.exports = withNextEnv({
//   reactStrictMode: true,
//   webpack: (config) => {
//     config.plugins.push(new webpack.EnvironmentPlugin(process.env));

//     return config;
//   },
// });

// export default nextConfig;
