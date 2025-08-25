/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desactivar ESLint durante el build para deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Desactivar verificación de tipos durante el build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración experimental actualizada
  experimental: {
    // Mover de serverComponentsExternalPackages a serverExternalPackages
  },
  serverExternalPackages: ["ethers"],
};

module.exports = nextConfig;
