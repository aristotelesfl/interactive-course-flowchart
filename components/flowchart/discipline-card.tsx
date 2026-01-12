"use client";

import type React from "react";

import { memo } from "react";
import { Check } from "lucide-react";
import type { Disciplina } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DisciplineCardProps {
  disciplina: Disciplina;
  isHighlighted: boolean;
  isDimmed: boolean;
  isConcluida: boolean;
  onClick: (disciplina: Disciplina) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  onToggleConcluida: (id: string) => void;
}

/**
 * Card individual de uma disciplina no fluxograma
 * Usa memo para evitar re-renders desnecessários
 */
export const DisciplineCard = memo(function DisciplineCard({
  disciplina,
  isHighlighted,
  isDimmed,
  isConcluida,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onToggleConcluida,
}: DisciplineCardProps) {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleConcluida(disciplina.id);
  };

  return (
    <div
      data-id={disciplina.id}
      className={cn(
        "relative px-3 py-2 rounded-lg cursor-pointer transition-all duration-300",
        "bg-card border-2 border-border hover:border-primary",
        "min-w-[140px] text-center",
        isConcluida &&
          "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
        isHighlighted &&
          !isConcluida &&
          "border-primary shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105 z-10",
        isHighlighted &&
          isConcluida &&
          "border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-105 z-10",
        isDimmed && "opacity-30"
      )}
      onClick={() => onClick(disciplina)}
      onMouseEnter={() => onMouseEnter(disciplina.id)}
      onMouseLeave={onMouseLeave}
    >
      {/* Código da disciplina */}
      <span
        className={cn(
          "text-[10px] font-mono",
          isConcluida
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground"
        )}
      >
        {disciplina.id}
      </span>

      {/* Nome da disciplina */}
      <h3
        className={cn(
          "text-xs font-medium leading-tight mt-0.5",
          isConcluida
            ? "text-emerald-700 dark:text-emerald-300"
            : "text-foreground"
        )}
      >
        {disciplina.nome}
      </h3>

      {/* Indicador de pré-requisito */}
      {disciplina.preRequisito && !isConcluida && (
        <span
          className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 rounded-full"
          title="Tem pré-requisito"
        />
      )}

      <button
        onClick={handleToggle}
        className={cn(
          "absolute -top-2 -left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
          isConcluida
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "bg-background border-muted-foreground/30 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950"
        )}
        title={isConcluida ? "Marcar como pendente" : "Marcar como concluída"}
      >
        {isConcluida && <Check className="h-3 w-3" />}
      </button>
    </div>
  );
});
