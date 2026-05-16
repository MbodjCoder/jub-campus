import type { NextConfig } from "next";

// En-têtes de sécurité appliqués à toutes les réponses.
const ENTETES_SECURITE = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Compression gzip/brotli des réponses.
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // avatars Google
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async headers() {
    return [{ source: "/:chemin*", headers: ENTETES_SECURITE }];
  },
};

export default nextConfig;
