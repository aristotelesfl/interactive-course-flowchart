"use client";

import { Flowchart } from "@/components/flowchart/flowchart";
import { Legend } from "@/components/flowchart/legend";
import { ProgressBar } from "@/components/flowchart/progress-bar";
import { ThemeToggle } from "@/components/flowchart/theme-toggle";
import { useProgress } from "@/hooks/use-progress";
import { useTheme } from "@/hooks/use-theme";

export default function Home() {
  const {
    stats,
    isLoaded: progressLoaded,
    isConcluida,
    toggleConcluida,
  } = useProgress();
  const { resolvedTheme, toggleTheme, isLoaded: themeLoaded } = useTheme();

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
        {progressLoaded && (
          <ProgressBar
            completadas={stats.completadas}
            total={stats.total}
            percentual={stats.percentual}
          />
        )}
      </section>

      {/* Legenda */}
      <section className="container mx-auto px-4 pb-4">
        <Legend />
      </section>

      {/* Fluxograma */}
      <section className="container mx-auto px-4">
        <Flowchart
          isConcluida={isConcluida}
          toggleConcluida={toggleConcluida}
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
