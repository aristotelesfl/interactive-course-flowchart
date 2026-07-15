/**
 * Tipos e interfaces para o sistema de fluxograma de disciplinas
 */

export interface Disciplina {
  id: string;
  nome: string;
  semestre: number;
  /** IDs das disciplinas que são pré-requisito desta. Vazio se não houver. */
  preRequisitos: string[];
  /** Quantidade de créditos da disciplina. */
  creditos: number;
}

/** Mapa de ID da disciplina para o texto da ementa, carregado sob demanda. */
export type Ementas = Record<string, string>;

/**
 * Grade curricular completa de um curso, como servida em
 * public/data/grades/<id>.json (mesmo envelope que virá do Firestore).
 * O `id` é derivado de curso + fluxo e serve como chave de deduplicação.
 */
export interface Grade {
  id: string;
  curso: string;
  nivel: string;
  turno: string;
  fluxo: string;
  disciplinas: Disciplina[];
}

/**
 * Identidade de um curso (cursos/{cursoSlug} no Firestore ou uma entrada
 * de public/data/cursos.json) — só o suficiente para listar/buscar o
 * curso. Os fluxos (variantes de grade) ficam na subcoleção/JSON
 * separado abaixo, para a lista de cursos não crescer com cada fluxo
 * novo cadastrado.
 */
export interface CursoIdentidade {
  slug: string;
  curso: string;
}

/**
 * Um fluxo específico de um curso (cursos/{cursoSlug}/fluxos/{fluxoSlug}
 * no Firestore ou public/data/fluxos/<cursoSlug>.json). `id` aponta para
 * o documento completo em grades/{id}.
 */
export interface FluxoIndexEntry {
  id: string;
  fluxo: string;
  nivel: string;
  turno: string;
}

export interface DisciplinaComPosicao extends Disciplina {
  x: number;
  y: number;
}

export interface Conexao {
  de: string;
  para: string;
  dePos: { x: number; y: number };
  paraPos: { x: number; y: number };
}

export interface FlowchartState {
  disciplinaSelecionada: Disciplina | null;
  disciplinaHover: string | null;
  fluxoDestacado: Set<string>;
}
