import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  // GitHub Pages will be hosted at https://<username>.github.io/<repo-name>/
  // So we need to set the basePath for proper static asset loading.
  basePath: '/geometric-sandbox',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
