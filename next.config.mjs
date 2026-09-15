/**
 * Vercel ALWAYS reads the build from the default `.next` directory - pointing production
 * builds at `.next-production` is what caused "routes-manifest.json couldn't be found"
 * (and the earlier `eb5b69c` build failure). So the override is scoped to local machines
 * only, where its purpose is to stop `npm run build` from clobbering the `.next` a running
 * dev server is using. `VERCEL` is set to "1" in every Vercel build environment.
 *
 * @type {import('next').NextConfig}
 */
const onVercel = Boolean(process.env.VERCEL);

const nextConfig = {
  distDir: onVercel
    ? ".next"
    : process.env.NODE_ENV === "development"
      ? process.env.NEXT_DEV_DIST_DIR || ".next"
      : ".next-production",
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
