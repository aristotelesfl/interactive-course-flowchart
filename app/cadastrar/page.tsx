"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import {
  ArrowLeft,
  CheckCircle2,
  CloudUpload,
  Download,
  FileUp,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { Flowchart } from "@/components/flowchart/flowchart";
import { ThemeToggle } from "@/components/flowchart/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFluxos } from "@/hooks/use-grade";
import { useTheme } from "@/hooks/use-theme";
import { firebaseConfigurado, getDb } from "@/lib/firebase";
import {
  GradeParseError,
  parseGradePdf,
  type ParsedGrade,
} from "@/lib/parse-grade-pdf";
import { cn } from "@/lib/utils";

type Status = "idle" | "parsing" | "success" | "error";
type SalvarStatus = "idle" | "salvando" | "salvo" | "erro";

const CONCLUIDAS_VAZIO = new Set<string>();
const noop = () => {};

export default function CadastrarPage() {
  const { resolvedTheme, toggleTheme, isLoaded: themeLoaded } = useTheme();

  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>("idle");
  const [parsed, setParsed] = useState<ParsedGrade | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const [salvarStatus, setSalvarStatus] = useState<SalvarStatus>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: fluxosDoCurso } = useFluxos(parsed?.cursoSlug);

  const processarArquivo = useCallback(async (file: File) => {
    setStatus("parsing");
    setParsed(null);
    setErro(null);
    setSalvarStatus("idle");
    try {
      const resultado = await parseGradePdf(await file.arrayBuffer());
      setParsed(resultado);
      setStatus("success");
    } catch (e) {
      setErro(
        e instanceof GradeParseError
          ? e.message
          : "Erro inesperado ao processar o PDF."
      );
      setStatus("error");
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setArrastando(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processarArquivo(file);
    },
    [processarArquivo]
  );

  const baixarJson = useCallback(() => {
    if (!parsed) return;
    const blob = new Blob([JSON.stringify(parsed.grade, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${parsed.grade.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [parsed]);

  const salvarGrade = useCallback(async () => {
    if (!parsed) return;
    const { grade, cursoSlug, fluxoSlug } = parsed;
    setSalvarStatus("salvando");
    try {
      const db = getDb();

      // Deduplicação no servidor: além do índice em cache, confere os
      // documentos reais antes de gravar (as rules bloqueiam sobrescrita
      // de qualquer forma — isto só melhora a mensagem para o usuário).
      const [existente, cursoSnap] = await Promise.all([
        getDoc(doc(db, "grades", grade.id)),
        getDoc(doc(db, "cursos", cursoSlug)),
      ]);
      if (existente.exists()) {
        queryClient.invalidateQueries({ queryKey: ["fluxos", cursoSlug] });
        setSalvarStatus("salvo");
        return;
      }

      const batch = writeBatch(db);
      batch.set(doc(db, "grades", grade.id), {
        ...grade,
        criadaEm: serverTimestamp(),
      });
      // A identidade do curso (nome) é criada uma única vez — tentar
      // recriá-la nas rules conta como "update", que é sempre negado.
      if (!cursoSnap.exists()) {
        batch.set(doc(db, "cursos", cursoSlug), {
          slug: cursoSlug,
          curso: grade.curso,
        });
      }
      batch.set(doc(db, "cursos", cursoSlug, "fluxos", fluxoSlug), {
        id: grade.id,
        fluxo: grade.fluxo,
        nivel: grade.nivel,
        turno: grade.turno,
      });
      await batch.commit();

      queryClient.setQueryData(["grade", grade.id], grade);
      queryClient.invalidateQueries({ queryKey: ["cursos"] });
      queryClient.invalidateQueries({ queryKey: ["fluxos", cursoSlug] });
      setSalvarStatus("salvo");
    } catch (e) {
      console.error("Falha ao salvar a grade no Firestore:", e);
      setSalvarStatus("erro");
    }
  }, [parsed, queryClient]);

  const jaCadastrada = Boolean(
    parsed && fluxosDoCurso?.some((f) => f.id === parsed.grade.id)
  );

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Voltar</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Cadastrar Grade Curricular
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Envie o PDF emitido pelo sisacadg.uece.br
              </p>
            </div>
          </div>
          {themeLoaded && (
            <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />
          )}
        </div>
      </header>

      <section className="container mx-auto px-4 py-6 space-y-6">
        {/* Zona de upload */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setArrastando(true);
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors",
            arrastando
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          {status === "parsing" ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          ) : (
            <FileUp className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="text-center">
            <p className="font-medium text-foreground">
              {status === "parsing"
                ? "Lendo o PDF..."
                : "Arraste o PDF da grade curricular aqui"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              ou clique para escolher o arquivo
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processarArquivo(file);
              e.target.value = "";
            }}
          />
        </label>

        {/* Erro de parse */}
        {status === "error" && erro && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <TriangleAlert className="h-5 w-5" />
                Não foi possível ler a grade
              </CardTitle>
              <CardDescription>{erro}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Resultado do parse */}
        {status === "success" && parsed && (
          <>
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle>{parsed.grade.curso}</CardTitle>
                    <CardDescription className="mt-1">
                      {parsed.grade.nivel} · {parsed.grade.turno} · Fluxo{" "}
                      {parsed.grade.fluxo} ·{" "}
                      {parsed.grade.disciplinas.length} disciplinas
                    </CardDescription>
                  </div>
                  {jaCadastrada ? (
                    <Badge variant="secondary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Grade já cadastrada
                    </Badge>
                  ) : (
                    <Badge>Grade nova</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {parsed.warnings.length > 0 && (
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-sm space-y-1">
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <TriangleAlert className="h-4 w-4 text-amber-500" />
                      Avisos do parser
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {parsed.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {salvarStatus === "salvo" || jaCadastrada ? (
                  <p className="text-sm text-muted-foreground">
                    {salvarStatus === "salvo"
                      ? "Grade salva com sucesso! Ela já está disponível para todos."
                      : "Esta grade já está disponível no fluxograma."}{" "}
                    <Link
                      href={`/fluxograma?curso=${parsed.cursoSlug}&fluxo=${parsed.fluxoSlug}`}
                      className="text-primary underline"
                    >
                      Ver fluxograma
                    </Link>
                  </p>
                ) : firebaseConfigurado ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        onClick={salvarGrade}
                        disabled={salvarStatus === "salvando"}
                      >
                        {salvarStatus === "salvando" ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CloudUpload className="h-4 w-4 mr-2" />
                        )}
                        {salvarStatus === "salvando"
                          ? "Salvando..."
                          : "Salvar grade"}
                      </Button>
                      <Button variant="outline" onClick={baixarJson}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar JSON
                      </Button>
                    </div>
                    {salvarStatus === "erro" && (
                      <p className="text-sm text-destructive">
                        Não foi possível salvar. Verifique sua conexão e tente
                        novamente.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={baixarJson}>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar JSON da grade
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      O banco de dados ainda não foi configurado — por
                      enquanto, envie este arquivo no repositório do projeto.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview do fluxograma */}
            <div>
              <h2 className="font-semibold text-foreground mb-3">
                Confira se o fluxograma corresponde à sua grade
              </h2>
              <Flowchart
                disciplinas={parsed.grade.disciplinas}
                concluidas={CONCLUIDAS_VAZIO}
                toggleConcluida={noop}
                colorMode={resolvedTheme}
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
}
