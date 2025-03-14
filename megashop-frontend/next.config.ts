/** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "export", // ✅ Static export for Firebase Hosting
//   reactStrictMode: true,

//   images: {
//     unoptimized: true, // ✅ Corrected spelling
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "megashop-backend-production.up.railway.app",
//         pathname: "/uploads/**",
//       },
//     ],
//   },
// };

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
};


export default nextConfig;
