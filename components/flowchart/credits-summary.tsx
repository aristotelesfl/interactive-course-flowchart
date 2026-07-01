"use client";

import { memo } from "react";
import { GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { ResumoCreditos } from "@/lib/creditos";
import { cn } from "@/lib/utils";

interface CreditsSummaryProps {
  resumo: ResumoCreditos;
}

/**
 * Resumo de créditos por categoria (obrigatórias, optativas, ACC, AEE)
 * comparando o concluído com o exigido para colar grau.
 */
export const CreditsSummary = memo(function CreditsSummary({
  resumo,
}: CreditsSummaryProps) {
  return (
    <div className="p-4 bg-muted/30 rounded-lg space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="font-medium text-foreground">
            Créditos para Colar Grau
          </span>
        </div>
        <div className="text-sm">
          <span className="font-bold text-primary">
            {resumo.totalConcluido}
          </span>
          <span className="text-muted-foreground">
            {" "}
            / {resumo.totalExigido} créditos ({resumo.percentual}%)
          </span>
        </div>
      </div>

      <Progress value={resumo.percentual} className="h-2" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {resumo.categorias.map((c) => {
          const pct =
            c.creditosExigidos > 0
              ? Math.min(
                  100,
                  Math.round(
                    (c.creditosConcluidos / c.creditosExigidos) * 100
                  )
                )
              : 0;
          const completo = c.creditosConcluidos >= c.creditosExigidos;

          return (
            <div
              key={c.categoria}
              className="p-3 rounded-lg bg-background border border-border"
              title={c.nomeCompleto}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground truncate">
                  {c.label}
                </span>
                <span
                  className={cn(
                    "text-xs font-mono shrink-0",
                    completo ? "text-emerald-500" : "text-muted-foreground"
                  )}
                >
                  {c.creditosConcluidos}/{c.creditosExigidos}
                </span>
              </div>
              <Progress
                value={pct}
                className={cn("h-1.5 mt-2", completo && "[&>div]:bg-emerald-500")}
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                {c.concluidas}{" "}
                {c.concluidas === 1 ? "concluída" : "concluídas"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
});
