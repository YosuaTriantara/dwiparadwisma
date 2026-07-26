/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp"],
  },
  experimental: {
    // Helps Next.js 14 resolve webpack chunks correctly on Windows + Node 22
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
