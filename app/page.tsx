"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileUp } from "lucide-react";
import { CursoFluxoSeletor } from "@/components/flowchart/curso-fluxo-seletor";
import { ThemeToggle } from "@/components/flowchart/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface Selecao {
  cursoSlug?: string;
  fluxoSlug?: string;
}

export default function Home() {
  const router = useRouter();
  const { resolvedTheme, toggleTheme, isLoaded: themeLoaded } = useTheme();
  const [selecao, setSelecao] = useState<Selecao>({});

  useEffect(() => {
    if (selecao.cursoSlug && selecao.fluxoSlug) {
      router.push(
        `/fluxograma?curso=${selecao.cursoSlug}&fluxo=${selecao.fluxoSlug}`
      );
    }
  }, [selecao, router]);

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Fluxogramas de Cursos da UECE
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Busque um curso e escolha o fluxo para ver o fluxograma
            </p>
          </div>
          {themeLoaded && (
            <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />
          )}
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 flex flex-col items-center gap-6">
        <CursoFluxoSeletor
          cursoSlug={selecao.cursoSlug}
          fluxoSlug={selecao.fluxoSlug}
          onChange={(cursoSlug, fluxoSlug) => setSelecao({ cursoSlug, fluxoSlug })}
        />

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            Não encontrou o seu curso ou fluxo?
          </p>
          <Button variant="outline" asChild>
            <Link href="/cadastrar">
              <FileUp className="h-4 w-4 mr-2" />
              Cadastrar grade curricular
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
