/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
