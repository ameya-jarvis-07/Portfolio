/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Turn off strict mode to prevent double-mounts in Three.js/R3F dev mode
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  eslint: {
    // Skip lint checking during builds for faster compiling
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
