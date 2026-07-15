import { SEMESTRE_OPTATIVAS, getDisciplinasPorSemestre } from "./data";
import type { Disciplina } from "./types";

/**
 * Peso de cada disciplina = tamanho do seu "ramo" na árvore formada pelos
 * primeiros pré-requisitos (1 + soma dos pesos de quem a tem como
 * primeiro pré-requisito). Uma folha vale 1; o tronco de uma cadeia longa
 * acumula o peso de tudo que vem depois dela.
 *
 * Optativas não contam como filhas: elas não são reordenadas nem
 * alinhadas por linha, então não devem influenciar qual ramo regular
 * "merece" ficar reto.
 *
 * Assume o grafo acíclico — já validado antes desta função ser chamada
 * (parse-grade-pdf.ts roda temCicloDePreRequisitos antes de ordenar).
 */
function calcularPesos(disciplinas: Disciplina[]): Map<string, number> {
  const porId = new Map(disciplinas.map((d) => [d.id, d]));
  const filhosPorId = new Map<string, Disciplina[]>();

  for (const d of disciplinas) {
    if (d.semestre === SEMESTRE_OPTATIVAS) continue;
    const paiId = d.preRequisitos[0];
    if (paiId === undefined || !porId.has(paiId)) continue;
    const filhos = filhosPorId.get(paiId) ?? [];
    filhos.push(d);
    filhosPorId.set(paiId, filhos);
  }

  const pesos = new Map<string, number>();
  const calcular = (id: string): number => {
    const memo = pesos.get(id);
    if (memo !== undefined) return memo;
    const filhos = filhosPorId.get(id) ?? [];
    const peso = 1 + filhos.reduce((soma, f) => soma + calcular(f.id), 0);
    pesos.set(id, peso);
    return peso;
  };

  disciplinas.forEach((d) => calcular(d.id));
  return pesos;
}

/**
 * Reordena as disciplinas de cada semestre regular para que, sempre que
 * possível, uma disciplina ocupe a mesma posição (linha) que seu primeiro
 * pré-requisito ocupou no semestre onde foi cursado — deixando as setas
 * do fluxograma retas em vez de cruzadas.
 *
 * Quando duas ou mais disciplinas do mesmo semestre disputam a mesma
 * posição, vence quem tiver o maior peso de ramo (a cadeia mais longa
 * que se apoia nela) — como numa árvore, o ramo maior fica na linha reta
 * e os menores vão para a próxima posição livre. Em caso de empate de
 * peso, vence a primeira na ordem original. Disciplinas com múltiplos
 * pré-requisitos usam apenas o primeiro da lista como referência.
 *
 * As optativas (SEMESTRE_OPTATIVAS) não são reordenadas: seus
 * pré-requisitos vêm de semestres muito diferentes entre si, então o
 * alinhamento por linha não ajuda a leitura do fluxo.
 */
export function ordenarDisciplinasParaFluxo(
  disciplinas: Disciplina[]
): Disciplina[] {
  const pesos = calcularPesos(disciplinas);
  const porSemestre = getDisciplinasPorSemestre(disciplinas);
  const semestresRegulares = Array.from(porSemestre.keys())
    .filter((s) => s !== SEMESTRE_OPTATIVAS)
    .sort((a, b) => a - b);

  const linhaPorId = new Map<string, number>();
  const resultado: Disciplina[] = [];

  for (const semestre of semestresRegulares) {
    const lista = porSemestre.get(semestre)!;
    const n = lista.length;
    const linhas: (Disciplina | undefined)[] = new Array(n).fill(undefined);
    const reservaPorLinha = new Map<number, Disciplina>();
    const pendentes: Disciplina[] = [];

    for (const d of lista) {
      const alvo = linhaPorId.get(d.preRequisitos[0]);
      if (alvo === undefined || alvo >= n) {
        pendentes.push(d);
        continue;
      }

      const atual = reservaPorLinha.get(alvo);
      if (!atual || pesos.get(d.id)! > pesos.get(atual.id)!) {
        if (atual) pendentes.push(atual);
        reservaPorLinha.set(alvo, d);
      } else {
        pendentes.push(d);
      }
    }

    reservaPorLinha.forEach((d, linha) => {
      linhas[linha] = d;
    });

    let cursor = 0;
    for (const d of pendentes) {
      while (linhas[cursor]) cursor++;
      linhas[cursor] = d;
    }

    linhas.forEach((d, i) => {
      linhaPorId.set(d!.id, i);
      resultado.push(d!);
    });
  }

  resultado.push(...(porSemestre.get(SEMESTRE_OPTATIVAS) ?? []));

  return resultado;
}
