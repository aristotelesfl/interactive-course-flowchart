/**
 * Prefixo de rota do deploy (GitHub Pages serve o app em um subcaminho).
 * Definido em next.config.mjs via env NEXT_PUBLIC_BASE_PATH.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
