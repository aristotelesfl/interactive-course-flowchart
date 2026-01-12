/**
 * Tipos e interfaces para o sistema de fluxograma de disciplinas
 */

export interface Disciplina {
  id: string;
  nome: string;
  semestre: number;
  preRequisito: string | null;
  ementa: string;
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
