/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep production checks from overwriting the running development preview.
  distDir: process.env.NODE_ENV === "development" ? (process.env.NEXT_DEV_DIST_DIR || ".next") : ".next-production",
  // Keep the development overlay from covering the corner badge or mobile menu.
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
