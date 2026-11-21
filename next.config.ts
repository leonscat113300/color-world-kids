import type { NextConfig } from "next";

// NEXT_OUTPUT=export → fully static build for the offline Android APK
// (Capacitor bundles ./out and the artworks live in IndexedDB instead of the API).
// default → standalone server build for the hosted web version.
const nextConfig: NextConfig = {
  output: process.env.NEXT_OUTPUT === "export" ? "export" : "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
