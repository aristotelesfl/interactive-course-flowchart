/**
 * Copia o worker do pdf.js para public/ com extensão .js.
 *
 * O pdfjs-dist só distribui o worker como .mjs, e nem todo servidor
 * estático serve .mjs com MIME de JavaScript — o que faz o module worker
 * falhar silenciosamente. Com extensão .js o MIME é correto em qualquer
 * host. Roda automaticamente via predev/prebuild (package.json).
 */
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origem = join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const destino = join(root, "public", "pdf.worker.min.js");

await mkdir(dirname(destino), { recursive: true });
await copyFile(origem, destino);
console.log("pdf.worker.min.js copiado para public/");
