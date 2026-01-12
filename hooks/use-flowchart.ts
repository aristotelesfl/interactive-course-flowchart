"use client";

import { useState, useCallback, useMemo } from "react";
import type { Disciplina } from "@/lib/types";
import { disciplinas, getDisciplinaById } from "@/lib/data";

/**
 * Hook customizado para gerenciar o estado e a lógica do fluxograma
 */
export function useFlowchart() {
  const [disciplinaSelecionada, setDisciplinaSelecionada] =
    useState<Disciplina | null>(null);
  const [disciplinaHover, setDisciplinaHover] = useState<string | null>(null);

  /**
   * Encontra todos os pré-requisitos de uma disciplina (recursivamente)
   */
  const encontrarPreRequisitos = useCallback((id: string): Set<string> => {
    const resultado = new Set<string>();
    const disciplina = getDisciplinaById(id);

    if (disciplina?.preRequisito) {
      resultado.add(disciplina.preRequisito);
      encontrarPreRequisitos(disciplina.preRequisito).forEach((pr) =>
        resultado.add(pr)
      );
    }

    return resultado;
  }, []);

  /**
   * Encontra todas as disciplinas que dependem de uma disciplina (recursivamente)
   */
  const encontrarDependentes = useCallback((id: string): Set<string> => {
    const resultado = new Set<string>();

    disciplinas.forEach((d) => {
      if (d.preRequisito === id) {
        resultado.add(d.id);
        encontrarDependentes(d.id).forEach((dep) => resultado.add(dep));
      }
    });

    return resultado;
  }, []);

  /**
   * Calcula o fluxo completo (pré-requisitos + a própria + dependentes)
   */
  const fluxoDestacado = useMemo((): Set<string> => {
    if (!disciplinaHover) return new Set();

    const fluxo = new Set<string>([disciplinaHover]);
    encontrarPreRequisitos(disciplinaHover).forEach((id) => fluxo.add(id));
    encontrarDependentes(disciplinaHover).forEach((id) => fluxo.add(id));

    return fluxo;
  }, [disciplinaHover, encontrarPreRequisitos, encontrarDependentes]);

  /**
   * Obtém os pré-requisitos diretos e indiretos para exibição na sidebar
   */
  const getPreRequisitosParaSidebar = useCallback(
    (disciplina: Disciplina): Disciplina[] => {
      const preReqIds = encontrarPreRequisitos(disciplina.id);
      return Array.from(preReqIds)
        .map((id) => getDisciplinaById(id))
        .filter((d): d is Disciplina => d !== undefined);
    },
    [encontrarPreRequisitos]
  );

  /**
   * Obtém as disciplinas dependentes para exibição na sidebar
   */
  const getDependentesParaSidebar = useCallback(
    (disciplina: Disciplina): Disciplina[] => {
      const depIds = encontrarDependentes(disciplina.id);
      return Array.from(depIds)
        .map((id) => getDisciplinaById(id))
        .filter((d): d is Disciplina => d !== undefined);
    },
    [encontrarDependentes]
  );

  const handleDisciplinaClick = useCallback((disciplina: Disciplina) => {
    setDisciplinaSelecionada(disciplina);
  }, []);

  const handleDisciplinaHover = useCallback((id: string | null) => {
    setDisciplinaHover(id);
  }, []);

  const fecharSidebar = useCallback(() => {
    setDisciplinaSelecionada(null);
  }, []);

  return {
    disciplinaSelecionada,
    disciplinaHover,
    fluxoDestacado,
    handleDisciplinaClick,
    handleDisciplinaHover,
    fecharSidebar,
    getPreRequisitosParaSidebar,
    getDependentesParaSidebar,
  };
}
