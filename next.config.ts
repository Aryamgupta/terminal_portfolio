import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["via.placeholder.com", "placehold.co"],
  },
  serverExternalPackages: ["potrace", "jimp"],
};

export default nextConfig;
