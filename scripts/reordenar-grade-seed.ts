/**
 * Reaplica ordenarDisciplinasParaFluxo() a uma grade já salva em
 * public/data/grades/. Uso ad-hoc: rodar de novo só quando o algoritmo
 * de ordenação mudar ou uma grade seed for atualizada manualmente.
 *
 *   npx tsx scripts/reordenar-grade-seed.ts <id-da-grade>
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ordenarDisciplinasParaFluxo } from "../lib/ordenar-disciplinas";
import type { Grade } from "../lib/types";

const gradeId = process.argv[2];
if (!gradeId) {
  console.error("Uso: npx tsx scripts/reordenar-grade-seed.ts <id-da-grade>");
  process.exit(1);
}

const caminho = join(
  __dirname,
  "..",
  "public",
  "data",
  "grades",
  `${gradeId}.json`
);

const grade: Grade = JSON.parse(readFileSync(caminho, "utf-8"));
grade.disciplinas = ordenarDisciplinasParaFluxo(grade.disciplinas);
writeFileSync(caminho, JSON.stringify(grade, null, 2) + "\n", "utf-8");

console.log(`Grade reordenada: ${caminho}`);
