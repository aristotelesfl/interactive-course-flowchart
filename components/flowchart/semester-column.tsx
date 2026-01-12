"use client";

import { memo } from "react";
import type { Disciplina } from "@/lib/types";
import { DisciplineCard } from "./discipline-card";

interface SemesterColumnProps {
  semestre: number;
  disciplinas: Disciplina[];
  fluxoDestacado: Set<string>;
  hasHover: boolean;
  isConcluida: (id: string) => boolean;
  onToggleConcluida: (id: string) => void;
  onDisciplinaClick: (disciplina: Disciplina) => void;
  onDisciplinaHover: (id: string | null) => void;
}

/**
 * Coluna que agrupa disciplinas de um semestre
 */
export const SemesterColumn = memo(function SemesterColumn({
  semestre,
  disciplinas,
  fluxoDestacado,
  hasHover,
  isConcluida,
  onToggleConcluida,
  onDisciplinaClick,
  onDisciplinaHover,
}: SemesterColumnProps) {
  return (
    <div className="flex flex-col items-center gap-3 min-w-[160px]">
      {/* Cabeçalho do semestre */}
      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
        {semestre}º Semestre
      </div>

      {/* Lista de disciplinas */}
      <div className="flex flex-col gap-3">
        {disciplinas.map((disciplina) => (
          <DisciplineCard
            key={disciplina.id}
            disciplina={disciplina}
            isHighlighted={fluxoDestacado.has(disciplina.id)}
            isDimmed={hasHover && !fluxoDestacado.has(disciplina.id)}
            isConcluida={isConcluida(disciplina.id)}
            onToggleConcluida={onToggleConcluida}
            onClick={onDisciplinaClick}
            onMouseEnter={onDisciplinaHover}
            onMouseLeave={() => onDisciplinaHover(null)}
          />
        ))}
      </div>
    </div>
  );
});
