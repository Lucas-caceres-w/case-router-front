/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/fotos_casos/*",
      },
      {
        protocol: "http",
        hostname: "77.37.62.52",
        port: "3001",
        pathname: "/backend/fotos_casos/*",
      },
      {
        protocol: "https",
        hostname: "caseroute.io",
        pathname: "/backend/fotos_casos/*",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
