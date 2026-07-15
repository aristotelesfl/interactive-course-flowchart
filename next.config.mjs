// Na Vercel o app é servido na raiz do domínio (basePath vazio); no GitHub
// Pages fica sob /interactive-course-flowchart. A Vercel define VERCEL=1 no
// build, então detectamos o alvo automaticamente — nada a configurar.
const basePath = process.env.VERCEL === "1" ? "" : "/interactive-course-flowchart";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Só inclui basePath/assetPrefix quando há subcaminho (GitHub Pages).
  ...(basePath && { basePath, assetPrefix: `${basePath}/` }),
  env: {
    // Consumido pelos fetches (hooks) e pelo worker do pdf.js — fica em
    // sincronia com o basePath acima em qualquer alvo de deploy.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
