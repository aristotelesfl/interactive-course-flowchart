import type { Disciplina } from "./types";
import { SEMESTRE_OPTATIVAS } from "./data";

/**
 * Categorias de crédito que compõem os requisitos para colar grau.
 */
export type Categoria = "obrigatoria" | "optativa" | "acc" | "aee";

/** ID da disciplina que representa a Atividade Curricular Complementar (ACC). */
export const ID_ACC = "CL179";
/** ID da entrada que representa a Atividade Específica de Extensão (AEE). */
export const ID_AEE = "AEE";

/**
 * Créditos de optativas exigidos para colar grau.
 * Regra: bastam 2 optativas (de 4 créditos cada) — os demais não contam.
 */
export const CREDITOS_OPTATIVAS_EXIGIDOS = 8;

const LABELS: Record<Categoria, string> = {
  obrigatoria: "Obrigatórias",
  optativa: "Optativas",
  acc: "ACC",
  aee: "AEE",
};

const NOMES_COMPLETOS: Record<Categoria, string> = {
  obrigatoria: "Disciplinas obrigatórias",
  optativa: "Disciplinas optativas",
  acc: "Atividade Curricular Complementar",
  aee: "Atividade Específica de Extensão",
};

/**
 * Determina a categoria de crédito de uma disciplina.
 */
export function getCategoria(d: Disciplina): Categoria {
  if (d.id === ID_ACC) return "acc";
  if (d.id === ID_AEE) return "aee";
  if (d.semestre === SEMESTRE_OPTATIVAS) return "optativa";
  return "obrigatoria";
}

export interface ResumoCategoria {
  categoria: Categoria;
  label: string;
  nomeCompleto: string;
  /** Quantidade de disciplinas concluídas nesta categoria. */
  concluidas: number;
  /** Créditos concluídos que contam para o grau (já com teto aplicado). */
  creditosConcluidos: number;
  /** Créditos exigidos nesta categoria. */
  creditosExigidos: number;
}

export interface ResumoCreditos {
  categorias: ResumoCategoria[];
  totalExigido: number;
  totalConcluido: number;
  percentual: number;
}

/**
 * Créditos exigidos por categoria.
 * Obrigatórias/ACC/AEE = soma dos créditos das entradas do dataset;
 * Optativas = teto fixo (regra das 2 optativas).
 */
function creditosExigidosPorCategoria(
  porCategoria: Record<Categoria, Disciplina[]>
): Record<Categoria, number> {
  const soma = (lista: Disciplina[]) =>
    lista.reduce((total, d) => total + d.creditos, 0);

  return {
    obrigatoria: soma(porCategoria.obrigatoria),
    optativa: CREDITOS_OPTATIVAS_EXIGIDOS,
    acc: soma(porCategoria.acc),
    aee: soma(porCategoria.aee),
  };
}

/**
 * Calcula o resumo de créditos concluídos vs. exigidos por categoria,
 * respeitando o teto de créditos de optativas.
 */
export function calcularResumoCreditos(
  disciplinas: Disciplina[],
  concluidas: Set<string>
): ResumoCreditos {
  const porCategoria: Record<Categoria, Disciplina[]> = {
    obrigatoria: [],
    optativa: [],
    acc: [],
    aee: [],
  };

  disciplinas.forEach((d) => {
    porCategoria[getCategoria(d)].push(d);
  });

  const exigidos = creditosExigidosPorCategoria(porCategoria);
  const ordem: Categoria[] = ["obrigatoria", "optativa", "acc", "aee"];

  const categorias: ResumoCategoria[] = ordem.map((categoria) => {
    const concluidasLista = porCategoria[categoria].filter((d) =>
      concluidas.has(d.id)
    );
    const creditosBrutos = concluidasLista.reduce(
      (total, d) => total + d.creditos,
      0
    );

    return {
      categoria,
      label: LABELS[categoria],
      nomeCompleto: NOMES_COMPLETOS[categoria],
      concluidas: concluidasLista.length,
      // Nenhuma categoria pode contribuir com mais créditos do que os exigidos.
      creditosConcluidos: Math.min(creditosBrutos, exigidos[categoria]),
      creditosExigidos: exigidos[categoria],
    };
  });

  const totalExigido = categorias.reduce(
    (total, c) => total + c.creditosExigidos,
    0
  );
  const totalConcluido = categorias.reduce(
    (total, c) => total + c.creditosConcluidos,
    0
  );
  const percentual =
    totalExigido > 0 ? Math.round((totalConcluido / totalExigido) * 100) : 0;

  return { categorias, totalExigido, totalConcluido, percentual };
}
