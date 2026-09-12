/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep a running dev server from overwriting production preview artifacts.
  distDir: process.env.NODE_ENV === "development" ? ".next" : ".next-production",
};

export default nextConfig;
