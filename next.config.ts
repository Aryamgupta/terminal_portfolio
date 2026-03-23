import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["via.placeholder.com", "placehold.co","images.unsplash.com"],
  },
  serverExternalPackages: ["potrace", "jimp"],
};

export default nextConfig;
