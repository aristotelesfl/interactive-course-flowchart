"use client";

import { memo } from "react";
import { Check } from "lucide-react";

/**
 * Legenda explicativa do fluxograma
 */
export const Legend = memo(function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-muted/30 rounded-lg text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-card border-2 border-border" />
        <span className="text-muted-foreground">Disciplina</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-4 h-4 rounded bg-emerald-500/20 border-2 border-emerald-500">
          <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="h-2 w-2 text-white" />
          </div>
        </div>
        <span className="text-muted-foreground">Concluída</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-amber-500" />
        <span className="text-muted-foreground">Tem pré-requisito</span>
      </div>

      <div className="flex items-center gap-2">
        <svg width="40" height="10" className="overflow-visible">
          <path
            d="M 0 5 C 15 5, 25 5, 40 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground/40"
          />
          <polygon
            points="35 2, 40 5, 35 8"
            fill="currentColor"
            className="text-muted-foreground/40"
          />
        </svg>
        <span className="text-muted-foreground">Conexão de pré-requisito</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-card border-2 border-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        <span className="text-muted-foreground">Fluxo destacado (hover)</span>
      </div>
    </div>
  );
});
