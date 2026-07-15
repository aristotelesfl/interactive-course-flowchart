"use client";

import { useState, useCallback, useMemo } from "react";
import type { Disciplina } from "@/lib/types";

/**
 * Hook customizado para gerenciar o estado e a lógica do fluxograma.
 * Recebe a lista de disciplinas da grade em exibição.
 */
export function useFlowchart(disciplinas: Disciplina[]) {
  const [disciplinaSelecionada, setDisciplinaSelecionada] =
    useState<Disciplina | null>(null);
  const [disciplinaHover, setDisciplinaHover] = useState<string | null>(null);

  const disciplinasById = useMemo(
    () => new Map(disciplinas.map((d) => [d.id, d])),
    [disciplinas]
  );

  /**
   * Encontra todos os pré-requisitos de uma disciplina (recursivamente)
   */
  const encontrarPreRequisitos = useCallback(
    (id: string): Set<string> => {
      const resultado = new Set<string>();
      const disciplina = disciplinasById.get(id);

      disciplina?.preRequisitos.forEach((preReqId) => {
        if (resultado.has(preReqId)) return;
        resultado.add(preReqId);
        encontrarPreRequisitos(preReqId).forEach((pr) => resultado.add(pr));
      });

      return resultado;
    },
    [disciplinasById]
  );

  /**
   * Encontra todas as disciplinas que dependem de uma disciplina (recursivamente)
   */
  const encontrarDependentes = useCallback(
    (id: string): Set<string> => {
      const resultado = new Set<string>();

      disciplinas.forEach((d) => {
        if (d.preRequisitos.includes(id) && !resultado.has(d.id)) {
          resultado.add(d.id);
          encontrarDependentes(d.id).forEach((dep) => resultado.add(dep));
        }
      });

      return resultado;
    },
    [disciplinas]
  );

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
        .map((id) => disciplinasById.get(id))
        .filter((d): d is Disciplina => d !== undefined);
    },
    [encontrarPreRequisitos, disciplinasById]
  );

  /**
   * Obtém as disciplinas dependentes para exibição na sidebar
   */
  const getDependentesParaSidebar = useCallback(
    (disciplina: Disciplina): Disciplina[] => {
      const depIds = encontrarDependentes(disciplina.id);
      return Array.from(depIds)
        .map((id) => disciplinasById.get(id))
        .filter((d): d is Disciplina => d !== undefined);
    },
    [encontrarDependentes, disciplinasById]
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
    disciplinasById,
    handleDisciplinaClick,
    handleDisciplinaHover,
    fecharSidebar,
    getPreRequisitosParaSidebar,
    getDependentesParaSidebar,
  };
}
