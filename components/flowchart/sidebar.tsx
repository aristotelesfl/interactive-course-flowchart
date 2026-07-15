"use client";

import { memo } from "react";
import { X, BookOpen, GitBranch, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Disciplina } from "@/lib/types";
import { getSemestreLabel } from "@/lib/data";
import { useEmenta } from "@/hooks/use-ementas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SidebarProps {
  disciplina: Disciplina | null;
  preRequisitos: Disciplina[];
  dependentes: Disciplina[];
  isConcluida: boolean;
  onToggleConcluida: (id: string) => void;
  onClose: () => void;
  onDisciplinaClick: (disciplina: Disciplina) => void;
}

/**
 * Sidebar que exibe detalhes de uma disciplina selecionada
 */
export const Sidebar = memo(function Sidebar({
  disciplina,
  preRequisitos,
  dependentes,
  isConcluida,
  onToggleConcluida,
  onClose,
  onDisciplinaClick,
}: SidebarProps) {
  const { ementa, isLoading: ementaLoading } = useEmenta(disciplina?.id);

  if (!disciplina) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <header className="flex items-start justify-between p-6 border-b border-border shrink-0">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="font-mono">
                {disciplina.id}
              </Badge>
              {isConcluida && (
                <Badge className="bg-emerald-500 hover:bg-emerald-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Concluída
                </Badge>
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {disciplina.nome}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {getSemestreLabel(disciplina.semestre)} ·{" "}
              {disciplina.creditos} créditos
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </Button>
        </header>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <Button
                onClick={() => onToggleConcluida(disciplina.id)}
                variant={isConcluida ? "outline" : "default"}
                className={cn(
                  "w-full",
                  isConcluida &&
                    "border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                )}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {isConcluida ? "Marcar como Pendente" : "Marcar como Concluída"}
              </Button>

              <Separator />

              {/* Ementa */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">Ementa</h3>
                </div>
                {ementaLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : ementa ? (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ementa}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Ementa não disponível
                  </p>
                )}
              </section>

              <Separator />

              {/* Pré-requisitos */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <GitBranch className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold text-foreground">
                    Pré-requisitos
                  </h3>
                </div>
                {preRequisitos.length > 0 ? (
                  <div className="space-y-2">
                    {preRequisitos.map((pr) => (
                      <button
                        key={pr.id}
                        onClick={() => onDisciplinaClick(pr)}
                        className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <span className="text-xs font-mono text-muted-foreground">
                          {pr.id}
                        </span>
                        <p className="text-sm font-medium text-foreground">
                          {pr.nome}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhum pré-requisito
                  </p>
                )}
              </section>

              <Separator />

              {/* Dependentes */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight className="h-4 w-4 text-emerald-500" />
                  <h3 className="font-semibold text-foreground">
                    Disciplinas Dependentes
                  </h3>
                </div>
                {dependentes.length > 0 ? (
                  <div className="space-y-2">
                    {dependentes.map((dep) => (
                      <button
                        key={dep.id}
                        onClick={() => onDisciplinaClick(dep)}
                        className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <span className="text-xs font-mono text-muted-foreground">
                          {dep.id}
                        </span>
                        <p className="text-sm font-medium text-foreground">
                          {dep.nome}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhuma disciplina depende desta
                  </p>
                )}
              </section>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
});
