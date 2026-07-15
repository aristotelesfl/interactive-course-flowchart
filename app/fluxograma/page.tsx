"use client";

import { Suspense, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileUp } from "lucide-react";
import { Flowchart } from "@/components/flowchart/flowchart";
import { Legend } from "@/components/flowchart/legend";
import { CreditsSummary } from "@/components/flowchart/credits-summary";
import { CursoFluxoSeletor } from "@/components/flowchart/curso-fluxo-seletor";
import { ThemeToggle } from "@/components/flowchart/theme-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DEFAULT_CURSO_SLUG,
  DEFAULT_FLUXO_SLUG,
  useGrade,
} from "@/hooks/use-grade";
import { useProgress } from "@/hooks/use-progress";
import { useTheme } from "@/hooks/use-theme";
import { calcularResumoCreditos } from "@/lib/creditos";
import { gradeIdFromSlugs } from "@/lib/slug";

function FluxogramaConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cursoSlug = searchParams.get("curso") ?? DEFAULT_CURSO_SLUG;
  const fluxoSlug = searchParams.get("fluxo") ?? DEFAULT_FLUXO_SLUG;
  const gradeId = gradeIdFromSlugs(cursoSlug, fluxoSlug);

  const trocarSelecao = useCallback(
    (novoCursoSlug: string, novoFluxoSlug: string) => {
      router.push(`/fluxograma?curso=${novoCursoSlug}&fluxo=${novoFluxoSlug}`);
    },
    [router]
  );

  const { data: grade, isLoading, isError } = useGrade(gradeId);
  const {
    isLoaded: progressLoaded,
    concluidas,
    toggleConcluida,
  } = useProgress(gradeId);
  const { resolvedTheme, toggleTheme, isLoaded: themeLoaded } = useTheme();

  const disciplinas = grade?.disciplinas;

  const resumoCreditos = useMemo(
    () =>
      disciplinas ? calcularResumoCreditos(disciplinas, concluidas) : null,
    [disciplinas, concluidas]
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Fluxograma de Disciplinas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {grade
                ? `${grade.curso} · ${grade.turno} · Fluxo ${grade.fluxo}`
                : "Visualização interativa do currículo"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CursoFluxoSeletor
              cursoSlug={cursoSlug}
              fluxoSlug={fluxoSlug}
              onChange={trocarSelecao}
            />
            <Button variant="outline" asChild>
              <Link href="/cadastrar">
                <FileUp className="h-4 w-4 mr-2" />
                Cadastrar grade
              </Link>
            </Button>
            {themeLoaded && (
              <ThemeToggle
                resolvedTheme={resolvedTheme}
                onToggle={toggleTheme}
              />
            )}
          </div>
        </div>
      </header>

      {isError ? (
        <section className="container mx-auto px-4 py-16 text-center">
          <p className="text-foreground font-medium">
            Não foi possível carregar a grade curricular.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Verifique sua conexão e recarregue a página, ou{" "}
            <Link href="/" className="text-primary underline">
              escolha outro curso
            </Link>
            .
          </p>
        </section>
      ) : isLoading || !disciplinas ? (
        <section className="container mx-auto px-4 py-4 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[70vh] min-h-[520px] w-full rounded-xl" />
        </section>
      ) : (
        <>
          <section className="container mx-auto px-4 py-4">
            {progressLoaded && resumoCreditos && (
              <CreditsSummary resumo={resumoCreditos} />
            )}
          </section>

          {/* Legenda */}
          <section className="container mx-auto px-4 pb-4">
            <Legend />
          </section>

          {/* Fluxograma */}
          <section className="container mx-auto px-4">
            <Flowchart
              disciplinas={disciplinas}
              concluidas={concluidas}
              toggleConcluida={toggleConcluida}
              colorMode={resolvedTheme}
            />
          </section>
        </>
      )}

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

export default function FluxogramaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <FluxogramaConteudo />
    </Suspense>
  );
}
