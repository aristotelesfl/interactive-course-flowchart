"use client";

import { useMemo } from "react";
import { Flowchart } from "@/components/flowchart/flowchart";
import { Legend } from "@/components/flowchart/legend";
import { CreditsSummary } from "@/components/flowchart/credits-summary";
import { ThemeToggle } from "@/components/flowchart/theme-toggle";
import { useProgress } from "@/hooks/use-progress";
import { useTheme } from "@/hooks/use-theme";
import { calcularResumoCreditos } from "@/lib/creditos";

export default function Home() {
  const {
    isLoaded: progressLoaded,
    concluidas,
    toggleConcluida,
  } = useProgress();
  const { resolvedTheme, toggleTheme, isLoaded: themeLoaded } = useTheme();

  const resumoCreditos = useMemo(
    () => calcularResumoCreditos(concluidas),
    [concluidas]
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Fluxograma de Disciplinas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visualização interativa do currículo do curso de Ciência da
              Computação
            </p>
          </div>
          {themeLoaded && (
            <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />
          )}
        </div>
      </header>

      <section className="container mx-auto px-4 py-4">
        {progressLoaded && <CreditsSummary resumo={resumoCreditos} />}
      </section>

      {/* Legenda */}
      <section className="container mx-auto px-4 pb-4">
        <Legend />
      </section>

      {/* Fluxograma */}
      <section className="container mx-auto px-4">
        <Flowchart
          concluidas={concluidas}
          toggleConcluida={toggleConcluida}
          colorMode={resolvedTheme}
        />
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>Passe o mouse sobre uma disciplina para ver o fluxo completo.</p>
        <p>
          Clique para ver detalhes e ementa. Use o checkbox para marcar como
          concluída.
        </p>
      </footer>
    </main>
  );
}
