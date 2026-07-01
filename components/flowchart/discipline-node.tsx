"use client";

import type React from "react";

import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Check } from "lucide-react";
import type { Disciplina } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Dados carregados por cada nó de disciplina no React Flow.
 */
export type DisciplinaNodeData = {
  disciplina: Disciplina;
  isHighlighted: boolean;
  isDimmed: boolean;
  isConcluida: boolean;
  onToggleConcluida: (id: string) => void;
};

export type DisciplinaNode = Node<DisciplinaNodeData, "disciplina">;

/**
 * Nó customizado que renderiza o card de uma disciplina.
 * As arestas se ancoram aos Handles (esquerda = entrada, direita = saída),
 * então nunca descolam em scroll/zoom/resize — o React Flow cuida disso.
 */
export const DisciplineNode = memo(function DisciplineNode({
  data,
}: NodeProps<DisciplinaNode>) {
  const { disciplina, isHighlighted, isDimmed, isConcluida, onToggleConcluida } =
    data;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleConcluida(disciplina.id);
  };

  return (
    <div
      className={cn(
        "relative px-3 py-2 rounded-lg cursor-pointer transition-all duration-300",
        "bg-card border-2 border-border hover:border-primary",
        "w-[180px] text-center",
        isConcluida &&
          "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
        isHighlighted &&
          !isConcluida &&
          "border-primary shadow-[0_0_20px_rgba(59,130,246,0.5)]",
        isHighlighted &&
          isConcluida &&
          "border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]",
        isDimmed && "opacity-30"
      )}
    >
      {/* Handles de conexão (invisíveis, apenas ancoram as arestas) */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="!h-1.5 !w-1.5 !min-w-0 !border-0 !bg-transparent"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="!h-1.5 !w-1.5 !min-w-0 !border-0 !bg-transparent"
      />

      {/* Código e créditos */}
      <span
        className={cn(
          "text-[10px] font-mono",
          isConcluida
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground"
        )}
      >
        {disciplina.id} · {disciplina.creditos} cr
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
      {disciplina.preRequisitos.length > 0 && !isConcluida && (
        <span
          className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 rounded-full"
          title="Tem pré-requisito"
        />
      )}

      {/* Toggle de concluída (nodrag evita conflito com o pan/drag do canvas) */}
      <button
        onClick={handleToggle}
        className={cn(
          "nodrag absolute -top-2 -left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
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
