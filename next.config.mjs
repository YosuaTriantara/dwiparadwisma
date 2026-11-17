/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp"],
  },
  env: {
    // Fallback otomatis jika ditulis sebagai VITE_GOOGLE_CLIENT_ID di .env
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      process.env.VITE_GOOGLE_CLIENT_ID ||
      "",
  },
};

export default nextConfig;
