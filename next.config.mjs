/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/interactive-course-flowchart",
  assetPrefix: "/interactive-course-flowchart/",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
