import type { Disciplina } from "./types";

/**
 * Helpers puros sobre a lista de disciplinas de uma grade.
 *
 * Os dados em si vivem em public/data/grades/<id>.json e são carregados
 * via TanStack Query (hooks/use-grade.ts) — este módulo não conhece
 * nenhuma grade específica.
 */

/**
 * Semestre "sentinela" usado para agrupar disciplinas optativas/eletivas,
 * que não pertencem a um período fixo do fluxo.
 */
export const SEMESTRE_OPTATIVAS = 99;

/**
 * Retorna o rótulo de exibição de um semestre.
 * Semestres regulares viram "Nº Semestre"; o sentinela vira "Optativas".
 */
export function getSemestreLabel(semestre: number): string {
  return semestre === SEMESTRE_OPTATIVAS ? "Optativas" : `${semestre}º Semestre`;
}

/**
 * Retorna as disciplinas agrupadas por semestre
 */
export function getDisciplinasPorSemestre(
  disciplinas: Disciplina[]
): Map<number, Disciplina[]> {
  const porSemestre = new Map<number, Disciplina[]>();

  disciplinas.forEach((d) => {
    const lista = porSemestre.get(d.semestre) || [];
    lista.push(d);
    porSemestre.set(d.semestre, lista);
  });

  return porSemestre;
}

/**
 * Retorna uma disciplina pelo ID
 */
export function getDisciplinaById(
  disciplinas: Disciplina[],
  id: string
): Disciplina | undefined {
  return disciplinas.find((d) => d.id === id);
}
