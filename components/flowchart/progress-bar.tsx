"use client";

import { memo } from "react";
import { CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  completadas: number;
  total: number;
  percentual: number;
}

/**
 * Barra de progresso global do curso
 */
export const ProgressBar = memo(function ProgressBar({
  completadas,
  total,
  percentual,
}: ProgressBarProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <span className="font-medium text-foreground">Progresso do Curso</span>
      </div>

      <div className="flex-1 max-w-xs">
        <Progress value={percentual} className="h-2" />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold text-emerald-500">{percentual}%</span>
        <span className="text-muted-foreground">
          ({completadas}/{total} disciplinas)
        </span>
      </div>
    </div>
  );
});
