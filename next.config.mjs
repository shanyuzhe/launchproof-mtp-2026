/** @type {import('next').NextConfig} */
const githubPagesBasePath = process.env.GITHUB_PAGES === 'true' ? '/launchproof-mtp-2026' : '';

const nextConfig = {
  output: 'export',
  basePath: githubPagesBasePath || undefined,
  assetPrefix: githubPagesBasePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
