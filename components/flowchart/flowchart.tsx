"use client";

import { useMemo } from "react";
import { useFlowchart } from "@/hooks/use-flowchart";
import { getDisciplinasPorSemestre } from "@/lib/data";
import { SemesterColumn } from "./semester-column";
import { ConnectionLines } from "./connection-lines";
import { Sidebar } from "./sidebar";

interface FlowchartProps {
  isConcluida: (id: string) => boolean;
  toggleConcluida: (id: string) => void;
}

/**
 * Componente principal do fluxograma de disciplinas
 */
export function Flowchart({ isConcluida, toggleConcluida }: FlowchartProps) {
  const {
    disciplinaSelecionada,
    disciplinaHover,
    fluxoDestacado,
    handleDisciplinaClick,
    handleDisciplinaHover,
    fecharSidebar,
    getPreRequisitosParaSidebar,
    getDependentesParaSidebar,
  } = useFlowchart();

  // Agrupa disciplinas por semestre (memoizado)
  const disciplinasPorSemestre = useMemo(() => getDisciplinasPorSemestre(), []);
  const semestres = useMemo(
    () => Array.from(disciplinasPorSemestre.keys()).sort((a, b) => a - b),
    [disciplinasPorSemestre]
  );

  const hasHover = disciplinaHover !== null;

  return (
    <>
      {/* Container do fluxograma */}
      <div
        id="flowchart-container"
        className="relative w-full overflow-x-auto pb-8"
      >
        {/* Linhas de conexão (SVG) */}
        <ConnectionLines fluxoDestacado={fluxoDestacado} hasHover={hasHover} />

        {/* Grid de semestres */}
        <div className="relative z-10 flex gap-8 p-8 min-w-max">
          {semestres.map((semestre) => (
            <SemesterColumn
              key={semestre}
              semestre={semestre}
              disciplinas={disciplinasPorSemestre.get(semestre) || []}
              fluxoDestacado={fluxoDestacado}
              hasHover={hasHover}
              isConcluida={isConcluida}
              onToggleConcluida={toggleConcluida}
              onDisciplinaClick={handleDisciplinaClick}
              onDisciplinaHover={handleDisciplinaHover}
            />
          ))}
        </div>
      </div>

      {/* Sidebar de detalhes */}
      <Sidebar
        disciplina={disciplinaSelecionada}
        preRequisitos={
          disciplinaSelecionada
            ? getPreRequisitosParaSidebar(disciplinaSelecionada)
            : []
        }
        dependentes={
          disciplinaSelecionada
            ? getDependentesParaSidebar(disciplinaSelecionada)
            : []
        }
        isConcluida={
          disciplinaSelecionada ? isConcluida(disciplinaSelecionada.id) : false
        }
        onToggleConcluida={toggleConcluida}
        onClose={fecharSidebar}
        onDisciplinaClick={handleDisciplinaClick}
      />
    </>
  );
}
