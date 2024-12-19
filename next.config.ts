// next.config.js

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Activar solo para producción
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
};

export default nextConfig;
